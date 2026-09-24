const crypto = require('crypto')

const audioStore = new Map()
const AUDIO_TTL_MS = 12 * 60 * 1000

function xml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function e164(value) {
  const digits = String(value || '').replace(/[^\d+]/g, '')
  if (!digits) return ''
  if (digits.startsWith('+')) return `+${digits.slice(1).replace(/\D/g, '')}`
  return `+${digits.replace(/\D/g, '')}`
}

function sameNumber(a, b) {
  const left = e164(a).replace(/\D/g, '')
  const right = e164(b).replace(/\D/g, '')
  if (!left || !right) return false
  return left === right || left.endsWith(right) || right.endsWith(left)
}

function twiml(body) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`
}

function speechLanguage(code) {
  const map = { en: 'en-US', fr: 'fr-FR', ar: 'ar-AE', so: 'en-US', de: 'de-DE', es: 'es-ES' }
  return map[String(code || 'en').slice(0, 2)] || 'en-US'
}

function wantsHuman(text) {
  return /\b(human|agent|person|operator|representative|transfer|speak to (someone|a person|staff|manager)|real person|reception)\b/i.test(
    String(text || ''),
  )
}

function wantsHangup(text) {
  return /\b(goodbye|good bye|bye|that's all|that is all|no thanks|hang up|end (the )?call)\b/i.test(String(text || ''))
}

function storeAudio(buffer, contentType = 'audio/mpeg') {
  const token = crypto.randomBytes(16).toString('hex')
  audioStore.set(token, { buffer, contentType, expires: Date.now() + AUDIO_TTL_MS })
  return token
}

function takeAudio(token) {
  const row = audioStore.get(token)
  if (!row) return null
  if (row.expires < Date.now()) {
    audioStore.delete(token)
    return null
  }
  return row
}

setInterval(() => {
  const now = Date.now()
  for (const [key, row] of audioStore) {
    if (row.expires < now) audioStore.delete(key)
  }
}, 60_000).unref?.()

function loadTwilio() {
  try {
    return require('twilio')
  } catch {
    return null
  }
}

function envCreds() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID || ''
  const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN || ''
  const apiKey = process.env.TWILIO_API_KEY || ''
  const apiSecret = process.env.TWILIO_API_SECRET || ''
  const phone = e164(process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM || '')
  return { accountSid, authToken, apiKey, apiSecret, phone }
}

function resolveCreds(voice = {}) {
  const env = envCreds()
  const stored = voice.credentials || {}
  return {
    accountSid: stored.accountSid || env.accountSid,
    authToken: stored.authToken || env.authToken,
    apiKey: stored.apiKey || env.apiKey,
    apiSecret: stored.apiSecret || env.apiSecret,
    phone: e164(voice.twilioNumber || env.phone),
  }
}

function twilioReady(creds = envCreds()) {
  return Boolean(creds.accountSid && (creds.authToken || (creds.apiKey && creds.apiSecret)) && creds.phone)
}

function twilioClient(creds = envCreds()) {
  const twilio = loadTwilio()
  if (!twilio || !creds.accountSid) return null
  if (creds.apiKey && creds.apiSecret) return twilio(creds.apiKey, creds.apiSecret, { accountSid: creds.accountSid })
  if (creds.authToken) return twilio(creds.accountSid, creds.authToken)
  return null
}

function webhookUrls(base) {
  const root = String(base || '').replace(/\/$/, '')
  return {
    inbound: `${root}/api/twilio/voice/inbound`,
    gather: `${root}/api/twilio/voice/gather`,
    status: `${root}/api/twilio/voice/status`,
    recording: `${root}/api/twilio/voice/recording`,
    outbound: `${root}/api/twilio/voice/outbound`,
    voicemail: `${root}/api/twilio/voice/voicemail`,
  }
}

function maskSecret(value) {
  const text = String(value || '')
  if (!text) return null
  return `${'•'.repeat(Math.min(10, text.length))}…${text.slice(-4)}`
}

function credentialRows(voice = {}) {
  const creds = resolveCreds(voice)
  const labels = [
    ['accountSid', 'Account SID'],
    ['authToken', 'Auth Token'],
    ['apiKey', 'API Key'],
    ['apiSecret', 'API Secret'],
  ]
  return labels.map(([key, label]) => ({
    key,
    label,
    saved: Boolean(creds[key]),
    preview: maskSecret(creds[key]),
    updatedAt: voice.credentialsUpdatedAt || null,
    hint: key === 'authToken' ? 'Twilio Console → Account → Auth Token' : undefined,
  }))
}

async function provisionNumber(creds, urls) {
  const client = twilioClient(creds)
  if (!client || !creds.phone) throw new Error('Twilio credentials or phone number are missing.')
  const listed = await client.incomingPhoneNumbers.list({ phoneNumber: creds.phone, limit: 20 })
  const match =
    listed.find((row) => sameNumber(row.phoneNumber, creds.phone)) ||
    (await client.incomingPhoneNumbers.list({ limit: 40 })).find((row) => sameNumber(row.phoneNumber, creds.phone))
  if (!match) throw new Error(`No Twilio number matches ${creds.phone}. Buy or assign it in the Twilio console.`)
  const updated = await client.incomingPhoneNumbers(match.sid).update({
    voiceUrl: urls.inbound,
    voiceMethod: 'POST',
    statusCallback: urls.status,
    statusCallbackMethod: 'POST',
    voiceFallbackUrl: urls.inbound,
    voiceFallbackMethod: 'POST',
  })
  return {
    sid: updated.sid,
    phone: updated.phoneNumber,
    voiceUrl: updated.voiceUrl,
    statusCallback: updated.statusCallback,
  }
}

async function placeCall(creds, { to, url, statusCallback, record = false, recordingStatusCallback }) {
  const client = twilioClient(creds)
  if (!client) throw new Error('Twilio is not configured.')
  const from = creds.phone
  const dest = e164(to)
  if (!from || !dest) throw new Error('From and to numbers are required in E.164 format.')
  return client.calls.create({
    to: dest,
    from,
    url,
    method: 'POST',
    statusCallback,
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    statusCallbackMethod: 'POST',
    record,
    recordingStatusCallback,
    recordingStatusCallbackMethod: 'POST',
  })
}

function validateSignature(req, authToken, publicUrl) {
  if (!authToken || process.env.TWILIO_SKIP_SIGNATURE === 'true') return true
  const twilio = loadTwilio()
  if (!twilio) return true
  const signature = req.headers['x-twilio-signature']
  if (!signature) return false
  const url = `${String(publicUrl || '').replace(/\/$/, '')}${req.originalUrl}`
  return twilio.validateRequest(authToken, signature, url, req.body || {})
}

module.exports = {
  xml,
  e164,
  sameNumber,
  twiml,
  speechLanguage,
  wantsHuman,
  wantsHangup,
  storeAudio,
  takeAudio,
  envCreds,
  resolveCreds,
  twilioReady,
  twilioClient,
  webhookUrls,
  credentialRows,
  provisionNumber,
  placeCall,
  validateSignature,
  maskSecret,
}
