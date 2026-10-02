require('dotenv').config()
const twilio = require('twilio')
const twilioVoice = require('../lib/twilioVoice')

const FROM = twilioVoice.e164(process.env.TWILIO_PHONE_NUMBER)
const TYPED = twilioVoice.e164(process.env.CALL_TO || '+93107443144')
const OWNER = twilioVoice.e164(process.env.TWILIO_OWNER_NUMBER || '+923107443144')
const BASE = String(process.env.PUBLIC_API_URL || '').replace(/\/$/, '')
const ACCOUNT = process.env.TWILIO_DEFAULT_ACCOUNT_ID || 'acc_demo_client'

async function lookup(client, number) {
  try {
    const row = await client.lookups.v2.phoneNumbers(number).fetch({ fields: 'line_type_intelligence' })
    return { number, valid: row.valid, country: row.countryCode, type: row.lineTypeIntelligence?.type || null }
  } catch (error) {
    return { number, valid: false, error: error.message }
  }
}

async function enableCountry(client, iso) {
  try {
    await client.voice.v1.dialingPermissions.bulkCountryUpdates.create({
      updateRequest: JSON.stringify([{ iso_code: iso, low_risk_numbers_enabled: true, high_risk_special_numbers_enabled: true, high_risk_tollfraud_numbers_enabled: false }]),
    })
    console.log('dialing enabled', iso)
  } catch (error) {
    console.warn('dialing update', iso, error.message)
  }
}

async function waitFor(client, sid, seconds = 50) {
  let last = ''
  for (let i = 0; i < seconds; i += 1) {
    const call = await client.calls(sid).fetch()
    const line = `${call.status} duration=${call.duration || 0}`
    if (line !== last) {
      console.log('call', line)
      last = line
    }
    if (['completed', 'busy', 'failed', 'no-answer', 'canceled'].includes(call.status)) return call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return client.calls(sid).fetch()
}

async function main() {
  const creds = twilioVoice.envCreds()
  if (!twilioVoice.twilioReady(creds)) throw new Error('Twilio SID, token and phone number are required')
  const client = twilioVoice.twilioClient(creds)
  const account = await client.api.accounts(creds.accountSid).fetch()
  console.log('account', account.status, account.type)

  const urls = twilioVoice.webhookUrls(BASE)
  const provisioned = await twilioVoice.provisionNumber(creds, urls)
  console.log('provisioned', provisioned.phone, provisioned.voiceUrl)

  await enableCountry(client, 'PK')
  await enableCountry(client, 'AF')
  await enableCountry(client, 'US')

  const candidates = [...new Set([TYPED, OWNER, TYPED.replace('+93', '+92')].filter(Boolean))]
  const looked = []
  for (const number of candidates) looked.push(await lookup(client, number))
  console.log('lookup', JSON.stringify(looked))
  const dest = looked.find((row) => row.valid)?.number || OWNER
  console.log('dialing', dest, 'from', FROM)

  const call = await twilioVoice.placeCall(creds, {
    to: dest,
    url: `${urls.inbound}?account=${encodeURIComponent(ACCOUNT)}`,
    statusCallback: urls.status,
    record: true,
    recordingStatusCallback: urls.recording,
  })
  console.log('queued', call.sid, call.status)
  const done = await waitFor(client, call.sid)
  console.log('finished', done.status, 'duration', done.duration, 'to', dest)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
