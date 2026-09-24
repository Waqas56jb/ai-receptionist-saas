const twilioVoice = require('./lib/twilioVoice')

const OWNER_NUMBER = process.env.TWILIO_OWNER_NUMBER || '+923107443144'

const defaultVoice = {
  enabled: true,
  businessNumber: OWNER_NUMBER,
  twilioNumber: '',
  callerId: OWNER_NUMBER,
  greeting: 'Hello, thank you for calling. How can I help you today?',
  goodbye: 'Thank you for calling. Goodbye.',
  voice: 'Aria — warm female',
  language: 'en',
  voiceStyle: 'Conversational',
  speakingSpeed: 1,
  voiceInstructions: '',
  emergencyInstructions: '',
  interruptions: true,
  silenceTimeout: 4,
  autoAnswer: true,
  humanTransfer: true,
  voicemailFallback: true,
  recording: true,
  transcription: true,
  credentials: {},
}

function registerVoice(app, deps) {
  const {
    auth,
    dbSelect,
    dbInsert,
    dbUpdate,
    getSettings,
    saveSettings,
    replyFromKnowledge,
    speakReply,
    transcribeAudio,
    upsertConversation,
    saveMessage,
    publicBase,
    now,
    id,
  } = deps

  function sendTwiml(res, body) {
    res.type('text/xml').send(twilioVoice.twiml(body))
  }

  async function voiceSettings(accountId) {
    const settings = await getSettings(accountId).catch(() => ({ voice: {} }))
    return { ...defaultVoice, ...(settings.voice || {}) }
  }

  async function findAccountForNumber(called) {
    const accounts = await dbSelect('accounts').catch(() => [])
    const active = (accounts || []).filter((row) => row.status !== 'Blocked' && row.status !== 'Suspended')
    for (const account of active) {
      const voice = await voiceSettings(account.id)
      if (voice.twilioNumber && twilioVoice.sameNumber(voice.twilioNumber, called)) return account
    }
    const platform = twilioVoice.envCreds().phone
    if (platform && twilioVoice.sameNumber(platform, called) && active[0]) return active[0]
    if (process.env.TWILIO_DEFAULT_ACCOUNT_ID) {
      return active.find((row) => row.id === process.env.TWILIO_DEFAULT_ACCOUNT_ID) || null
    }
    return active.length === 1 ? active[0] : active[0] || null
  }

  async function upsertCall(accountId, patch) {
    const sid = patch.twilio_sid
    const existing = sid
      ? (await dbSelect('voice_calls', { twilio_sid: sid }).catch(() => []))[0]
      : null
    if (existing) {
      const next = { ...patch }
      delete next.twilio_sid
      await dbUpdate('voice_calls', { id: existing.id }, next).catch(() => {})
      return { ...existing, ...patch }
    }
    const row = {
      id: id('call'),
      account_id: accountId,
      twilio_sid: sid || id('sid'),
      direction: patch.direction || 'inbound',
      from_number: patch.from_number || '',
      to_number: patch.to_number || '',
      status: patch.status || 'initiated',
      duration: patch.duration || 0,
      recording_url: patch.recording_url || null,
      recording_sid: patch.recording_sid || null,
      outcome: patch.outcome || null,
      transferred: Boolean(patch.transferred),
      ai_handled: patch.ai_handled !== false,
      conversation_id: patch.conversation_id || null,
      started_at: patch.started_at || now(),
      ended_at: patch.ended_at || null,
      created_at: now(),
    }
    try {
      return await dbInsert('voice_calls', row)
    } catch (error) {
      console.warn('voice_calls insert skipped:', error.message)
      return row
    }
  }

  async function logTurn(accountId, from, name, inbound, outbound) {
    const conversation = await upsertConversation(accountId, {
      visitorKey: `voice:${from}`,
      name: name || from,
      channel: 'voice',
      lastMessage: outbound || inbound,
    })
    if (inbound) {
      await saveMessage(accountId, conversation.id, 'in', inbound, { type: 'voice', channel: 'voice', visitorKey: `voice:${from}` })
    }
    if (outbound) {
      await saveMessage(accountId, conversation.id, 'out', outbound, { type: 'voice', handled_as: 'ai', channel: 'voice', visitorKey: `voice:${from}` })
    }
    return conversation
  }

  async function audioOrSay(accountId, text, voice) {
    try {
      const spoken = await speakReply(text, 'mp3')
      if (spoken) {
        const token = twilioVoice.storeAudio(spoken)
        return `<Play>${twilioVoice.xml(`${publicUrlForAudio(accountId, token)}`)}</Play>`
      }
    } catch (error) {
      console.warn('Voice TTS fallback to Say:', error.message)
    }
    return `<Say language="${twilioVoice.speechLanguage(voice.language)}" voice="Polly.Joanna">${twilioVoice.xml(text)}</Say>`
  }

  function publicUrlForAudio(accountId, token) {
    const base = process.env.PUBLIC_API_URL || ''
    return `${String(base).replace(/\/$/, '')}/api/twilio/media/${token}`
  }

  function urls(req) {
    return twilioVoice.webhookUrls(process.env.PUBLIC_API_URL || publicBase(req))
  }

  function verifyTwilio(req, res, next) {
    const creds = twilioVoice.envCreds()
    const ok = twilioVoice.validateSignature(req, creds.authToken, process.env.PUBLIC_API_URL || publicBase(req))
    if (!ok) return res.status(403).type('text/xml').send(twilioVoice.twiml('<Say>Unauthorized request.</Say>'))
    next()
  }

  async function startRecording(accountId, callSid, voice) {
    if (!voice.recording || !callSid) return
    const creds = twilioVoice.resolveCreds(voice)
    const client = twilioVoice.twilioClient(creds)
    if (!client) return
    const recordingUrl = `${String(process.env.PUBLIC_API_URL || '').replace(/\/$/, '')}/api/twilio/voice/recording`
    try {
      await client.calls(callSid).recordings.create({ recordingStatusCallback: recordingUrl })
    } catch (error) {
      console.warn('Twilio recording start failed:', error.message)
    }
  }

  async function gatherTwiml(req, account, voice, prompt, extras = {}) {
    const hooks = urls(req)
    const promptXml = prompt ? await audioOrSay(account.id, prompt, voice) : ''
    const timeout = Math.max(2, Number(voice.silenceTimeout || 4))
    const action = `${hooks.gather}?account=${encodeURIComponent(account.id)}&turns=${Number(extras.turns || 0)}`
    return [
      extras.recordHeader || '',
      `<Gather input="speech dtmf" action="${twilioVoice.xml(action)}" method="POST" speechTimeout="auto" timeout="${timeout}" language="${twilioVoice.speechLanguage(voice.language)}" hints="appointment, booking, hours, price, transfer, agent">`,
      promptXml,
      '</Gather>',
      `<Redirect method="POST">${twilioVoice.xml(`${hooks.inbound}?account=${encodeURIComponent(account.id)}&idle=1`)}</Redirect>`,
    ].join('')
  }

  app.post('/api/twilio/voice/inbound', verifyTwilio, async (req, res) => {
    try {
      const called = req.body.Called || req.body.To
      const from = req.body.From || req.body.Caller
      const account =
        (req.query.account && (await dbSelect('accounts', { id: req.query.account }).then((rows) => rows[0]).catch(() => null))) ||
        (await findAccountForNumber(called))
      if (!account) return sendTwiml(res, '<Say>This number is not configured yet.</Say><Hangup/>')

      const voice = await voiceSettings(account.id)
      const hooks = urls(req)
      await upsertCall(account.id, {
        twilio_sid: req.body.CallSid,
        direction: String(req.body.Direction || 'inbound').includes('outbound') ? 'outbound' : 'inbound',
        from_number: from,
        to_number: called,
        status: 'in-progress',
        started_at: now(),
      })

      if (req.query.idle === '1') {
        const goodbye = voice.goodbye || defaultVoice.goodbye
        return sendTwiml(res, `${await audioOrSay(account.id, goodbye, voice)}<Hangup/>`)
      }

      if (!voice.enabled) {
        if (voice.voicemailFallback) {
          return sendTwiml(
            res,
            `${await audioOrSay(account.id, 'Please leave a message after the tone.', voice)}<Record action="${twilioVoice.xml(hooks.voicemail + `?account=${account.id}`)}" method="POST" maxLength="90" playBeep="true" transcribe="true"/>`,
          )
        }
        const transfer = twilioVoice.e164(voice.businessNumber || voice.callerId)
        if (transfer) return sendTwiml(res, `<Dial callerId="${twilioVoice.xml(voice.callerId || called)}">${twilioVoice.xml(transfer)}</Dial>`)
        return sendTwiml(res, '<Say>The receptionist is unavailable right now. Please try again later.</Say><Hangup/>')
      }

      startRecording(account.id, req.body.CallSid, voice).catch(() => {})
      const greeting =
        req.body.Direction === 'outbound-api'
          ? voice.greeting || 'Hello, this is the AI receptionist calling. How can I help?'
          : voice.greeting || defaultVoice.greeting
      sendTwiml(res, await gatherTwiml(req, account, voice, greeting, { turns: 0 }))
    } catch (error) {
      console.error('Twilio inbound failed', error.message)
      sendTwiml(res, '<Say>We are having trouble connecting you. Please try again shortly.</Say><Hangup/>')
    }
  })

  app.post('/api/twilio/voice/outbound', verifyTwilio, (req, res) => {
    const hooks = urls(req)
    const account = encodeURIComponent(req.query.account || '')
    sendTwiml(res, `<Redirect method="POST">${twilioVoice.xml(`${hooks.inbound}?account=${account}`)}</Redirect>`)
  })

  app.post('/api/twilio/voice/gather', verifyTwilio, async (req, res) => {
    try {
      const accountId = req.query.account
      const account = (await dbSelect('accounts', { id: accountId }).catch(() => []))[0]
      if (!account) return sendTwiml(res, '<Say>Session expired.</Say><Hangup/>')
      const voice = await voiceSettings(account.id)
      const speech = String(req.body.SpeechResult || '').trim()
      const digits = String(req.body.Digits || '').trim()
      const turns = Number(req.query.turns || 0) + 1
      const from = req.body.From || req.body.Caller
      const called = req.body.Called || req.body.To

      if (digits === '0' || wantsHuman(speech)) {
        const transfer = twilioVoice.e164(voice.businessNumber || voice.callerId)
        await upsertCall(account.id, { twilio_sid: req.body.CallSid, transferred: true, outcome: 'Transferred', ai_handled: true })
        if (voice.humanTransfer && transfer) {
          const line = 'Please hold while I connect you to the team.'
          await logTurn(account.id, from, from, speech || '0', line)
          return sendTwiml(
            res,
            `${await audioOrSay(account.id, line, voice)}<Dial callerId="${twilioVoice.xml(voice.callerId || called)}">${twilioVoice.xml(transfer)}</Dial>`,
          )
        }
        const fallback = 'I cannot transfer this call right now. I will ask the team to call you back.'
        await logTurn(account.id, from, from, speech || '0', fallback)
        return sendTwiml(res, `${await audioOrSay(account.id, fallback, voice)}<Hangup/>`)
      }

      if (!speech && !digits) {
        if (turns >= 2) {
          return sendTwiml(res, `${await audioOrSay(account.id, voice.goodbye || defaultVoice.goodbye, voice)}<Hangup/>`)
        }
        return sendTwiml(res, await gatherTwiml(req, account, voice, 'Sorry, I did not catch that. How can I help?', { turns }))
      }

      if (wantsHangup(speech) || turns >= 12) {
        const goodbye = voice.goodbye || defaultVoice.goodbye
        await logTurn(account.id, from, from, speech, goodbye)
        await upsertCall(account.id, { twilio_sid: req.body.CallSid, status: 'completed', outcome: 'Completed' })
        return sendTwiml(res, `${await audioOrSay(account.id, goodbye, voice)}<Hangup/>`)
      }

      const extra = [voice.voiceInstructions, voice.emergencyInstructions ? `Emergency instructions: ${voice.emergencyInstructions}` : '']
        .filter(Boolean)
        .join('\n')
      const reply = await replyFromKnowledge(account.id, speech || digits, { spoken: true, extra })
      const conversation = await logTurn(account.id, from, from, speech || digits, reply)
      await upsertCall(account.id, { twilio_sid: req.body.CallSid, conversation_id: conversation.id, status: 'in-progress' })
      sendTwiml(res, await gatherTwiml(req, account, voice, reply, { turns }))
    } catch (error) {
      console.error('Twilio gather failed', error.message)
      sendTwiml(res, '<Say>Let me try that again. How can I help?</Say>')
    }
  })

  app.post('/api/twilio/voice/status', verifyTwilio, async (req, res) => {
    try {
      const sid = req.body.CallSid
      const status = req.body.CallStatus || req.body.CallStatusEvent || 'unknown'
      const duration = Number(req.body.CallDuration || req.body.Duration || 0)
      const called = req.body.Called || req.body.To
      const account =
        (await findAccountForNumber(called)) ||
        (await dbSelect('voice_calls', { twilio_sid: sid }).then((rows) => rows[0] && dbSelect('accounts', { id: rows[0].account_id }).then((list) => list[0])).catch(() => null))
      if (account) {
        await upsertCall(account.id, {
          twilio_sid: sid,
          status,
          duration,
          from_number: req.body.From,
          to_number: called,
          ended_at: status === 'completed' || status === 'busy' || status === 'no-answer' || status === 'failed' ? now() : null,
          outcome:
            status === 'completed'
              ? 'Completed'
              : status === 'no-answer' || status === 'busy'
                ? 'Missed'
                : status === 'failed'
                  ? 'Failed'
                  : null,
        })
      }
    } catch (error) {
      console.warn('Twilio status callback:', error.message)
    }
    res.type('text/xml').send('<Response/>')
  })

  app.post('/api/twilio/voice/recording', verifyTwilio, async (req, res) => {
    try {
      const sid = req.body.CallSid
      const rows = await dbSelect('voice_calls', { twilio_sid: sid }).catch(() => [])
      if (rows[0]) {
        await dbUpdate('voice_calls', { id: rows[0].id }, {
          recording_url: req.body.RecordingUrl || null,
          recording_sid: req.body.RecordingSid || null,
        }).catch(() => {})
        if (req.body.RecordingUrl && rows[0].account_id) {
          const voice = await voiceSettings(rows[0].account_id)
          if (voice.transcription) {
            try {
              const audio = await fetch(`${req.body.RecordingUrl}.mp3`)
              const buffer = Buffer.from(await audio.arrayBuffer())
              const text = await transcribeAudio(buffer, 'call.mp3')
              if (text) {
                await logTurn(rows[0].account_id, rows[0].from_number, rows[0].from_number, `[recording] ${text}`, '')
              }
            } catch (error) {
              console.warn('Recording transcription skipped:', error.message)
            }
          }
        }
      }
    } catch (error) {
      console.warn('Twilio recording callback:', error.message)
    }
    res.type('text/xml').send('<Response/>')
  })

  app.post('/api/twilio/voice/voicemail', verifyTwilio, async (req, res) => {
    try {
      const account = (await dbSelect('accounts', { id: req.query.account }).catch(() => []))[0]
      if (account) {
        const from = req.body.From
        const note = req.body.TranscriptionText || 'Voicemail received.'
        await logTurn(account.id, from, from, note, '')
        await upsertCall(account.id, {
          twilio_sid: req.body.CallSid,
          recording_url: req.body.RecordingUrl || null,
          outcome: 'Voicemail',
          status: 'completed',
        })
      }
    } catch (error) {
      console.warn('Voicemail callback:', error.message)
    }
    sendTwiml(res, '<Say>Thank you. Goodbye.</Say><Hangup/>')
  })

  app.get('/api/twilio/media/:token', (req, res) => {
    const row = twilioVoice.takeAudio(req.params.token)
    if (!row) return res.status(404).end()
    res.setHeader('Content-Type', row.contentType)
    res.setHeader('Cache-Control', 'no-store')
    res.send(row.buffer)
  })

  app.get('/api/voice/status', auth('account'), async (req, res) => {
    try {
      const voice = await voiceSettings(req.actor.id)
      const creds = twilioVoice.resolveCreds(voice)
      const hooks = urls(req)
      res.json({
        ready: twilioVoice.twilioReady(creds),
        enabled: voice.enabled,
        phone: creds.phone || null,
        ownerNumber: process.env.TWILIO_OWNER_NUMBER || voice.businessNumber || null,
        platform: Boolean(twilioVoice.envCreds().accountSid && twilioVoice.envCreds().authToken),
        webhooks: {
          voice: hooks.inbound,
          status: hooks.status,
          recording: hooks.recording,
          outbound: hooks.outbound,
        },
        missing: [
          !creds.accountSid ? 'TWILIO_ACCOUNT_SID' : null,
          !creds.authToken && !(creds.apiKey && creds.apiSecret) ? 'TWILIO_AUTH_TOKEN' : null,
          !creds.phone ? 'TWILIO_PHONE_NUMBER' : null,
        ].filter(Boolean),
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/voice/credentials', auth('account'), async (req, res) => {
    try {
      const voice = await voiceSettings(req.actor.id)
      res.json(twilioVoice.credentialRows(voice))
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/voice/credentials', auth('account'), async (req, res) => {
    try {
      const key = String(req.body?.key || '')
      const value = String(req.body?.value || '').trim()
      const allowed = ['accountSid', 'authToken', 'apiKey', 'apiSecret']
      if (!allowed.includes(key) || !value) return res.status(400).json({ error: 'Credential key and value are required.' })
      const voice = await voiceSettings(req.actor.id)
      const saved = await saveSettings(req.actor.id, {
        voice: {
          ...voice,
          credentials: { ...(voice.credentials || {}), [key]: value },
          credentialsUpdatedAt: now(),
        },
      })
      res.json(twilioVoice.credentialRows(saved.voice || voice))
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.delete('/api/voice/credentials/:key', auth('account'), async (req, res) => {
    try {
      const voice = await voiceSettings(req.actor.id)
      const credentials = { ...(voice.credentials || {}) }
      delete credentials[req.params.key]
      const saved = await saveSettings(req.actor.id, { voice: { ...voice, credentials } })
      res.json(twilioVoice.credentialRows(saved.voice || voice))
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/voice/provision', auth('account'), async (req, res) => {
    try {
      const voice = await voiceSettings(req.actor.id)
      const creds = twilioVoice.resolveCreds(voice)
      const hooks = urls(req)
      const result = await twilioVoice.provisionNumber(creds, hooks)
      await saveSettings(req.actor.id, { voice: { ...voice, twilioNumber: result.phone, enabled: true } })
      res.json({
        ok: true,
        phone: result.phone,
        voiceUrl: result.voiceUrl,
        message: `Twilio number ${result.phone} now points at this server for inbound and outbound calls.`,
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

  app.post('/api/voice/outbound', auth('account'), async (req, res) => {
    try {
      const voice = await voiceSettings(req.actor.id)
      const creds = twilioVoice.resolveCreds(voice)
      if (!twilioVoice.twilioReady(creds)) {
        return res.status(400).json({ error: 'Add Twilio Account SID, Auth Token and phone number first.' })
      }
      const accounts = await dbSelect('accounts', { id: req.actor.id })
      const to = twilioVoice.e164(req.body?.to || voice.businessNumber || process.env.TWILIO_OWNER_NUMBER || accounts[0]?.phone)
      if (!to) return res.status(400).json({ error: 'Enter the destination number with country code.' })
      const hooks = urls(req)
      const call = await twilioVoice.placeCall(creds, {
        to,
        url: `${hooks.inbound}?account=${encodeURIComponent(req.actor.id)}`,
        statusCallback: hooks.status,
        record: Boolean(voice.recording),
        recordingStatusCallback: hooks.recording,
      })
      await upsertCall(req.actor.id, {
        twilio_sid: call.sid,
        direction: 'outbound',
        from_number: creds.phone,
        to_number: to,
        status: call.status || 'queued',
      })
      res.json({
        ok: true,
        sid: call.sid,
        to,
        from: creds.phone,
        status: call.status,
        message: `Calling ${to} from ${creds.phone}. Answer to speak with the AI receptionist.`,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/voice/calls', auth('account'), async (req, res) => {
    try {
      const rows = await dbSelect('voice_calls', { account_id: req.actor.id }).catch(() => [])
      const conversations = await dbSelect('conversations', { account_id: req.actor.id }).catch(() => [])
      const mapped = (rows || [])
        .slice()
        .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
        .map((row) => {
          const conversation = conversations.find((item) => item.id === row.conversation_id)
          return {
            id: row.id,
            customer: conversation?.wa_name || row.from_number || 'Caller',
            phone: row.direction === 'outbound' ? row.to_number : row.from_number,
            at: row.started_at || row.created_at,
            duration: Number(row.duration || 0),
            status: mapCallStatus(row.status, row.outcome),
            aiHandled: row.ai_handled !== false,
            transferred: Boolean(row.transferred),
            outcome: row.outcome || '—',
            recording: Boolean(row.recording_url),
            recordingUrl: row.recording_url || null,
            transcriptId: row.conversation_id || null,
            direction: row.direction,
          }
        })
      res.json(mapped)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/voice/transcripts', auth('account'), async (req, res) => {
    try {
      const conversations = await dbSelect('conversations', { account_id: req.actor.id, channel: 'voice' }).catch(() => [])
      const messages = await dbSelect('messages', { account_id: req.actor.id }).catch(() => [])
      res.json(
        (conversations || []).map((row) => ({
          id: row.id,
          customer: row.wa_name || row.wa_from,
          at: row.created_at,
          messages: messages
            .filter((msg) => msg.conversation_id === row.id)
            .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
            .map((msg) => ({
              id: msg.id,
              from: msg.direction === 'in' ? 'customer' : 'ai',
              at: msg.created_at,
              text: msg.body,
            })),
        })),
      )
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  return { defaultVoice, voiceSettings, findAccountForNumber, urls }
}

function mapCallStatus(status, outcome) {
  if (outcome === 'Voicemail') return 'Voicemail'
  if (outcome === 'Missed' || status === 'no-answer' || status === 'busy') return 'Missed'
  if (status === 'completed' || outcome === 'Completed' || outcome === 'Transferred') return 'Completed'
  if (status === 'failed') return 'Missed'
  return status || 'Completed'
}

registerVoice.defaultVoice = defaultVoice

module.exports = registerVoice
