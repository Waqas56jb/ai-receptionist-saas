require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const nodemailer = require('nodemailer')

const base = 'http://localhost:4000'

async function json(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

async function main() {
  const health = await json('/api/health')
  console.log('health', health.status, health.data.ok, 'mailer', health.data.mailer, 'supabase', health.data.supabase)

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: true,
    auth: { user: process.env.MAIL_USER, pass: String(process.env.MAIL_PASS || '').replace(/\s+/g, '') },
  })
  await transport.verify()
  console.log('smtp verify ok')

  const bad = await json('/api/auth/login', { method: 'POST', body: { email: 'not-an-email', password: 'x' } })
  console.log('invalid email', bad.status, bad.data.error)

  const login = await json('/api/auth/login', {
    method: 'POST',
    body: { email: process.env.DEMO_CLIENT_EMAIL, password: process.env.DEMO_CLIENT_PASSWORD },
  })
  if (!login.data.token) {
    console.error('login failed', login.status, login.data)
    process.exit(1)
  }
  console.log('login ok', login.data.user.email)

  const me = await json('/api/me', { token: login.data.token })
  console.log('me', me.status, me.data.user?.email, 'twoFactor', me.data.user?.twoFactor)

  const sessions = await json('/api/auth/sessions', { token: login.data.token })
  console.log('sessions', sessions.status, Array.isArray(sessions.data) ? sessions.data.length : sessions.data)

  const prefs = await json('/api/notifications/preferences', { token: login.data.token })
  console.log('prefs', prefs.status, Boolean(prefs.data?.email))

  const help = await json('/api/help', { token: login.data.token })
  console.log('help', help.status, help.data.articles?.length)

  const forgotBad = await json('/api/auth/forgot-password', { method: 'POST', body: { email: 'bad' } })
  console.log('forgot invalid', forgotBad.status)

  console.log('verify-mail-api passed')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
