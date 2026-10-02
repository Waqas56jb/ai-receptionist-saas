const WebSocket = require('ws')
const { twilioMulawToOpenAiPcm, openAiPcmToTwilioMulaw } = require('./audioCodec')
const twilioVoice = require('./twilioVoice')

function canUseRealtime() {
  return Boolean(process.env.OPENAI_API_KEY) && process.env.TWILIO_REALTIME !== 'false'
}

function toWsUrl(httpUrl) {
  return String(httpUrl || '')
    .replace(/^https:/i, 'wss:')
    .replace(/^http:/i, 'ws:')
}

function connectTwiml({ streamUrl, accountId, from, to, callSid, direction }) {
  return [
    '<Connect>',
    `<Stream url="${twilioVoice.xml(streamUrl)}">`,
    `<Parameter name="account" value="${twilioVoice.xml(accountId || '')}"/>`,
    `<Parameter name="from" value="${twilioVoice.xml(from || '')}"/>`,
    `<Parameter name="to" value="${twilioVoice.xml(to || '')}"/>`,
    `<Parameter name="callSid" value="${twilioVoice.xml(callSid || '')}"/>`,
    `<Parameter name="direction" value="${twilioVoice.xml(direction || 'inbound')}"/>`,
    '</Stream>',
    '</Connect>',
  ].join('')
}

function sendJson(ws, payload) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
}

function openOpenAiSocket(model) {
  const url = `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`
  const ws = new WebSocket(url, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1',
    },
  })
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.close()
      reject(new Error(`OpenAI Realtime timeout (${model})`))
    }, 12000)
    ws.once('open', () => {
      clearTimeout(timer)
      resolve(ws)
    })
    ws.once('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
  })
}

async function connectOpenAi() {
  const models = [process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime', 'gpt-4o-realtime-preview']
  let lastError
  for (const model of [...new Set(models)]) {
    try {
      return await openOpenAiSocket(model)
    } catch (error) {
      lastError = error
      console.warn(`OpenAI Realtime ${model} failed:`, error.message)
    }
  }
  throw lastError || new Error('OpenAI Realtime is unavailable')
}

function attachRealtime(httpServer, handlers = {}) {
  const wss = new WebSocket.Server({ noServer: true })
  httpServer.on('upgrade', (req, socket, head) => {
    const path = String(req.url || '').split('?')[0]
    if (path !== '/api/twilio/voice/stream') {
      socket.destroy()
      return
    }
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req))
  })
  wss.on('connection', (twilioWs) => handleTwilioStream(twilioWs, handlers))
  return wss
}

function handleTwilioStream(twilioWs, handlers) {
  let streamSid = ''
  let openaiWs = null
  let closed = false
  let meta = {}
  let greetingSent = false

  const closeBoth = () => {
    if (closed) return
    closed = true
    try {
      openaiWs?.close()
    } catch {
      /* ignore */
    }
    try {
      twilioWs.close()
    } catch {
      /* ignore */
    }
  }

  const pushAudio = (base64Pcm) => {
    if (!streamSid || twilioWs.readyState !== WebSocket.OPEN || !base64Pcm) return
    const mulaw = openAiPcmToTwilioMulaw(base64Pcm)
    if (!mulaw.length) return
    sendJson(twilioWs, {
      event: 'media',
      streamSid,
      media: { payload: mulaw.toString('base64') },
    })
  }

  const onOpenAiMessage = async (raw) => {
    let event
    try {
      event = JSON.parse(raw.toString())
    } catch {
      return
    }
    if (event.type === 'session.created' && !greetingSent) {
      greetingSent = true
      let instructions = 'You are a live phone receptionist. Speak in short sentences. No markdown.'
      try {
        instructions = (await handlers.buildInstructions?.(meta)) || instructions
      } catch (error) {
        console.warn('Realtime instructions failed:', error.message)
      }
      sendJson(openaiWs, {
        type: 'session.update',
        session: {
          modalities: ['text', 'audio'],
          instructions,
          voice: process.env.OPENAI_REALTIME_VOICE || 'alloy',
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          input_audio_transcription: { model: 'whisper-1' },
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 550,
          },
        },
      })
      sendJson(openaiWs, {
        type: 'response.create',
        response: {
          modalities: ['audio', 'text'],
          instructions: 'Greet the caller now in one short spoken sentence. Do not wait for them to speak first.',
        },
      })
    }
    if (event.type === 'input_audio_buffer.speech_started' && streamSid) {
      sendJson(twilioWs, { event: 'clear', streamSid })
    }
    if (event.type === 'response.audio.delta' || event.type === 'response.output_audio.delta') {
      pushAudio(event.delta)
    }
    if (event.type === 'conversation.item.input_audio_transcription.completed' && event.transcript) {
      handlers.logTurn?.(meta, event.transcript, 'in').catch?.(() => {})
      if (twilioVoice.wantsHuman(event.transcript)) handlers.transferCall?.(meta).catch?.(() => {})
      if (twilioVoice.wantsHangup(event.transcript)) handlers.hangupCall?.(meta).catch?.(() => {})
    }
    if (
      (event.type === 'response.audio_transcript.done' || event.type === 'response.output_audio_transcript.done') &&
      event.transcript
    ) {
      handlers.logTurn?.(meta, event.transcript, 'out').catch?.(() => {})
    }
    if (event.type === 'error') {
      console.error('OpenAI Realtime error', event.error || event)
    }
  }

  twilioWs.on('message', async (raw) => {
    let msg
    try {
      msg = JSON.parse(raw.toString())
    } catch {
      return
    }
    if (msg.event === 'start') {
      streamSid = msg.start?.streamSid || ''
      const custom = msg.start?.customParameters || {}
      meta = {
        accountId: custom.account,
        from: custom.from,
        to: custom.to,
        callSid: custom.callSid || msg.start?.callSid,
        direction: custom.direction || 'inbound',
        streamSid,
      }
      try {
        openaiWs = await connectOpenAi()
        openaiWs.on('message', onOpenAiMessage)
        openaiWs.on('close', closeBoth)
        openaiWs.on('error', (error) => {
          console.error('OpenAI Realtime socket error', error.message)
          closeBoth()
        })
      } catch (error) {
        console.error('OpenAI Realtime connect failed', error.message)
        closeBoth()
      }
    }
    if (msg.event === 'media' && openaiWs && msg.media?.payload) {
      try {
        const pcm = twilioMulawToOpenAiPcm(msg.media.payload)
        sendJson(openaiWs, { type: 'input_audio_buffer.append', audio: pcm.toString('base64') })
      } catch (error) {
        console.warn('Realtime uplink failed:', error.message)
      }
    }
    if (msg.event === 'stop') closeBoth()
  })

  twilioWs.on('close', closeBoth)
  twilioWs.on('error', closeBoth)
}

module.exports = {
  canUseRealtime,
  toWsUrl,
  connectTwiml,
  attachRealtime,
}
