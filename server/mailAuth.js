const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { cleanText, isValidEmail, normalizeEmail, maskEmail } = require('./lib/validate')
const { sendWelcome, sendResetLink, sendOtp, sendTeamInvite, sendMail } = require('./lib/mailer')

const otpHits = new Map()
const APP_URL = (process.env.CLIENT_APP_URL || process.env.PUBLIC_APP_URL || 'http://localhost:5173').replace(/\/$/, '')

function rateLimit(key, max = 5, windowMs = 15 * 60 * 1000) {
  const stamp = Date.now()
  const hits = (otpHits.get(key) || []).filter((time) => stamp - time < windowMs)
  if (hits.length >= max) return false
  hits.push(stamp)
  otpHits.set(key, hits)
  return true
}

function hashToken(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex')
}

function parseDevice(req) {
  const ua = String(req.headers['user-agent'] || '')
  if (/iPhone|iPad/i.test(ua)) return 'iPhone / iPad'
  if (/Android/i.test(ua)) return 'Android'
  if (/Macintosh/i.test(ua)) return 'Mac'
  if (/Windows/i.test(ua)) return 'Windows PC'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Web browser'
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  return forwarded || req.ip || req.socket?.remoteAddress || 'unknown'
}

function sixDigit() {
  return String(crypto.randomInt(100000, 1000000))
}

function defaultNotifications() {
  return {
    email: { newLead: true, newBooking: true, humanEscalation: true, aiError: true, usageLimit: true, weeklySummary: false },
    inApp: { newLead: true, newBooking: true, humanEscalation: true, aiError: true, usageLimit: true },
  }
}

function defaultCatalog() {
  return { services: [], products: [], policies: [], bookingRules: [] }
}

function registerMailAuth(deps) {
  const { app, auth, sign, dbSelect, dbInsert, dbUpdate, dbDelete, findAccountByEmail, id, now } = deps

  async function recordLogin(account, req, result) {
    try {
      await dbInsert('login_events', {
        id: id('log'),
        account_id: account.id,
        device: parseDevice(req),
        location: 'Web',
        ip: clientIp(req),
        result,
        created_at: now(),
      })
    } catch (error) {
      console.warn('login_events insert skipped:', error.message)
    }
  }

  async function createSessionRow(account, token, req) {
    try {
      const row = await dbInsert('account_sessions', {
        id: id('ses'),
        account_id: account.id,
        token_hash: hashToken(token),
        device: parseDevice(req),
        location: 'Web',
        ip: clientIp(req),
        last_active: now(),
        created_at: now(),
      })
      return row
    } catch (error) {
      console.warn('account_sessions insert skipped:', error.message)
      return null
    }
  }

  function portalPayload(account, token) {
    return {
      token,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        phone: account.phone || '',
        twoFactor: Boolean(account.two_factor),
      },
      business: { id: account.id, name: account.business_name || account.name },
      signedInAt: now(),
    }
  }

  async function issuePortalSession(account, req) {
    const token = sign({ kind: 'account', id: account.id, email: account.email })
    await createSessionRow(account, token, req)
    return portalPayload(account, token)
  }

  async function createOtp(account, purpose, email = account.email) {
    const code = sixDigit()
    const row = await dbInsert('email_otps', {
      id: id('otp'),
      account_id: account.id,
      purpose,
      email: normalizeEmail(email),
      code_hash: bcrypt.hashSync(code, 8),
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      used: false,
      created_at: now(),
    })
    return { id: row.id, code }
  }

  async function consumeOtp(challengeId, code, purpose) {
    const rows = await dbSelect('email_otps', { id: challengeId })
    const row = rows[0]
    if (!row || row.used || (purpose && row.purpose !== purpose)) return null
    if (new Date(row.expires_at).getTime() < Date.now()) return null
    if (!bcrypt.compareSync(String(code || ''), row.code_hash)) return null
    await dbUpdate('email_otps', { id: row.id }, { used: true })
    return row
  }

  async function listSessions(accountId, currentToken) {
    const currentHash = hashToken(currentToken)
    const rows = await dbSelect('account_sessions', { account_id: accountId })
    return rows
      .sort((a, b) => new Date(b.last_active || b.created_at) - new Date(a.last_active || a.created_at))
      .map((row) => ({
        id: row.id,
        device: row.device,
        location: row.location,
        ip: row.ip,
        current: row.token_hash === currentHash,
        lastActive: row.last_active || row.created_at,
      }))
  }

  async function listHistory(accountId) {
    const rows = await dbSelect('login_events', { account_id: accountId })
    return rows
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 30)
      .map((row) => ({
        id: row.id,
        device: row.device,
        location: row.location,
        ip: row.ip,
        result: row.result,
        at: row.created_at,
      }))
  }

  function currentToken(req) {
    const header = req.headers.authorization || ''
    return header.startsWith('Bearer ') ? header.slice(7) : ''
  }

  app.post('/api/auth/login/otp', async (req, res) => {
    try {
      const challengeId = cleanText(req.body?.challengeId, 80)
      const code = cleanText(req.body?.code, 12)
      const row = await consumeOtp(challengeId, code, 'login')
      if (!row) return res.status(401).json({ error: 'That code is invalid or has expired.' })
      const accounts = await dbSelect('accounts', { id: row.account_id })
      const account = accounts[0]
      if (!account) return res.status(401).json({ error: 'Account not found.' })
      await dbUpdate('accounts', { id: account.id }, { last_login: now() })
      await recordLogin(account, req, 'Success')
      res.json(await issuePortalSession(account, req))
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const email = normalizeEmail(req.body?.email)
      if (!isValidEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
      if (!rateLimit(`reset:${email}`, 5)) {
        return res.json({ ok: true })
      }
      const account = await findAccountByEmail(email)
      if (account) {
        const raw = crypto.randomBytes(32).toString('hex')
        await dbInsert('password_resets', {
          id: id('rst'),
          account_id: account.id,
          email: account.email,
          token_hash: hashToken(raw),
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          used: false,
          created_at: now(),
        })
        const link = `${APP_URL}/reset-password?token=${raw}`
        await sendResetLink({ to: account.email, name: account.name, link })
      }
      res.json({ ok: true })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const token = cleanText(req.body?.token, 200)
      const password = String(req.body?.password || '')
      if (!token) return res.status(400).json({ error: 'This reset link is missing or incomplete.' })
      if (password.length < 8) return res.status(400).json({ error: 'Use at least 8 characters.' })
      const rows = await dbSelect('password_resets', { token_hash: hashToken(token) })
      const row = rows[0]
      if (!row || row.used || new Date(row.expires_at).getTime() < Date.now()) {
        return res.status(400).json({ error: 'This reset link is invalid or has expired.' })
      }
      await dbUpdate('accounts', { id: row.account_id }, { password_hash: bcrypt.hashSync(password, 10) })
      await dbUpdate('password_resets', { id: row.id }, { used: true })
      const sessions = await dbSelect('account_sessions', { account_id: row.account_id })
      await Promise.all(sessions.map((session) => dbDelete('account_sessions', { id: session.id })))
      res.json({ ok: true })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/auth/change-password', auth('account'), async (req, res) => {
    try {
      const current = String(req.body?.current || req.body?.currentPassword || '')
      const nextPassword = String(req.body?.next || req.body?.password || '')
      if (!bcrypt.compareSync(current, req.account.password_hash)) {
        return res.status(400).json({ error: 'Current password is incorrect.' })
      }
      if (nextPassword.length < 8) return res.status(400).json({ error: 'Use at least 8 characters.' })
      await dbUpdate('accounts', { id: req.actor.id }, { password_hash: bcrypt.hashSync(nextPassword, 10) })
      const keep = hashToken(currentToken(req))
      const sessions = await dbSelect('account_sessions', { account_id: req.actor.id })
      await Promise.all(sessions.filter((session) => session.token_hash !== keep).map((session) => dbDelete('account_sessions', { id: session.id })))
      res.json({ ok: true })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/auth/2fa/start', auth('account'), async (req, res) => {
    try {
      const email = normalizeEmail(req.account.email)
      if (!rateLimit(`2fa:${email}`, 5)) return res.status(429).json({ error: 'Too many codes sent. Try again shortly.' })
      const otp = await createOtp(req.account, 'enable_2fa', email)
      await sendOtp({ to: email, name: req.account.name, code: otp.code, reason: 'turn on two-factor authentication' })
      res.json({ challengeId: otp.id, emailHint: maskEmail(email) })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/auth/2fa/confirm', auth('account'), async (req, res) => {
    try {
      const row = await consumeOtp(cleanText(req.body?.challengeId, 80), cleanText(req.body?.code, 12), 'enable_2fa')
      if (!row || row.account_id !== req.actor.id) return res.status(401).json({ error: 'That code is invalid or has expired.' })
      await dbUpdate('accounts', { id: req.actor.id }, { two_factor: true })
      res.json({
        id: req.account.id,
        name: req.account.name,
        email: req.account.email,
        role: req.account.role,
        phone: req.account.phone || '',
        twoFactor: true,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/auth/2fa/disable', auth('account'), async (req, res) => {
    try {
      const password = String(req.body?.password || '')
      if (!bcrypt.compareSync(password, req.account.password_hash)) {
        return res.status(400).json({ error: 'Enter your current password to turn this off.' })
      }
      await dbUpdate('accounts', { id: req.actor.id }, { two_factor: false })
      res.json({
        id: req.account.id,
        name: req.account.name,
        email: req.account.email,
        role: req.account.role,
        phone: req.account.phone || '',
        twoFactor: false,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/auth/sessions', auth('account'), async (req, res) => {
    try {
      res.json(await listSessions(req.actor.id, currentToken(req)))
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.delete('/api/auth/sessions/:id', auth('account'), async (req, res) => {
    try {
      const rows = await dbSelect('account_sessions', { id: req.params.id })
      if (rows[0] && rows[0].account_id === req.actor.id) await dbDelete('account_sessions', { id: req.params.id })
      res.json(await listSessions(req.actor.id, currentToken(req)))
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/auth/sessions/revoke-others', auth('account'), async (req, res) => {
    try {
      const keep = hashToken(currentToken(req))
      const sessions = await dbSelect('account_sessions', { account_id: req.actor.id })
      await Promise.all(sessions.filter((session) => session.token_hash !== keep).map((session) => dbDelete('account_sessions', { id: session.id })))
      res.json(await listSessions(req.actor.id, currentToken(req)))
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/auth/login-history', auth('account'), async (req, res) => {
    try {
      res.json(await listHistory(req.actor.id))
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/team', auth('account'), async (req, res) => {
    try {
      const settings = await deps.getSettings(req.actor.id)
      res.json(Array.isArray(settings.team) ? settings.team : [])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.post('/api/team', auth('account'), async (req, res) => {
    try {
      const name = cleanText(req.body?.name, 80)
      const email = normalizeEmail(req.body?.email)
      const role = cleanText(req.body?.role, 60) || 'Agent / Staff'
      if (!name) return res.status(400).json({ error: 'Enter the teammate name.' })
      if (!isValidEmail(email)) return res.status(400).json({ error: 'Enter a valid teammate email.' })
      const settings = await deps.getSettings(req.actor.id)
      const team = Array.isArray(settings.team) ? settings.team : []
      if (team.some((member) => normalizeEmail(member.email) === email)) {
        return res.status(409).json({ error: 'That email is already on the team.' })
      }
      const member = { id: id('usr'), name, email, role, status: 'Invited', lastActive: null }
      const next = await deps.saveSettings(req.actor.id, { team: [...team, member] })
      await sendTeamInvite({ to: email, name: req.account.name, businessName: req.account.business_name, role })
      res.json(next.team)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.patch('/api/team/:id', auth('account'), async (req, res) => {
    try {
      const settings = await deps.getSettings(req.actor.id)
      const team = (settings.team || []).map((member) =>
        member.id === req.params.id
          ? { ...member, role: cleanText(req.body?.role, 60) || member.role, name: req.body?.name ? cleanText(req.body.name, 80) : member.name }
          : member,
      )
      const next = await deps.saveSettings(req.actor.id, { team })
      res.json(next.team)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.delete('/api/team/:id', auth('account'), async (req, res) => {
    try {
      const settings = await deps.getSettings(req.actor.id)
      const team = (settings.team || []).filter((member) => member.id !== req.params.id)
      const next = await deps.saveSettings(req.actor.id, { team })
      res.json(next.team)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/catalog/:collection', auth('account'), async (req, res) => {
    try {
      const key = req.params.collection
      const settings = await deps.getSettings(req.actor.id)
      res.json(Array.isArray(settings.catalog?.[key]) ? settings.catalog[key] : [])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.put('/api/catalog/:collection', auth('account'), async (req, res) => {
    try {
      const key = req.params.collection
      if (!['services', 'products', 'policies', 'bookingRules'].includes(key)) {
        return res.status(404).json({ error: 'Unknown catalog.' })
      }
      const items = Array.isArray(req.body) ? req.body : req.body?.items || []
      const settings = await deps.getSettings(req.actor.id)
      const catalog = { ...defaultCatalog(), ...(settings.catalog || {}), [key]: items }
      const next = await deps.saveSettings(req.actor.id, { catalog })
      res.json(next.catalog[key])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/notifications', auth('account'), async (_req, res) => {
    res.json([])
  })

  app.get('/api/billing', auth('account'), async (req, res) => {
    res.json({
      plan: req.account.plan || 'Starter',
      status: req.account.status || 'Active',
      billingCycle: 'Monthly',
      renewsOn: null,
      seats: 1,
      paymentMethod: null,
    })
  })

  app.get('/api/notifications/preferences', auth('account'), async (req, res) => {
    try {
      const settings = await deps.getSettings(req.actor.id)
      res.json(settings.notifications || defaultNotifications())
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.put('/api/notifications/preferences', auth('account'), async (req, res) => {
    try {
      const current = (await deps.getSettings(req.actor.id)).notifications || defaultNotifications()
      const group = cleanText(req.body?.group, 20)
      const key = cleanText(req.body?.key, 40)
      if (!current[group] || !(key in current[group])) return res.status(400).json({ error: 'Unknown preference.' })
      current[group][key] = Boolean(req.body?.value)
      const next = await deps.saveSettings(req.actor.id, { notifications: current })
      res.json(next.notifications)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/help', auth('account'), async (_req, res) => {
    res.json({
      articles: [
        { id: 'wa', title: 'Connect WhatsApp', category: 'Channels', description: 'Scan the QR code from WhatsApp Agent. The number stays live until you disconnect.' },
        { id: 'widget', title: 'Embed the website widget', category: 'Channels', description: 'Copy the snippet from Website Widget and paste it before </body> on your site.' },
        { id: 'kb', title: 'Train the receptionist', category: 'AI', description: 'Add knowledge items so WhatsApp and the website widget answer from your business facts.' },
      ],
      faqs: [
        { id: 'f1', q: 'Where do conversations appear?', a: 'WhatsApp and website chats are saved per account under Conversations.' },
        { id: 'f2', q: 'How does two-factor work?', a: 'When enabled, a 6-digit code is emailed to your account address at every sign-in.' },
      ],
      support: [{ id: 'email', name: 'Email support', value: process.env.MAIL_USER || 'support@devmark.app' }],
    })
  })

  app.post('/api/help/issue', auth('account'), async (req, res) => {
    try {
      const subject = cleanText(req.body?.subject, 140)
      const details = cleanText(req.body?.details, 4000)
      const area = cleanText(req.body?.area, 80)
      if (!subject) return res.status(400).json({ error: 'Add a subject.' })
      const reference = `SUP-${Date.now()}`
      await sendMail({
        to: process.env.MAIL_USER,
        subject: `[${reference}] ${area}: ${subject}`,
        title: 'New support request',
        text: `${req.account.email} reported ${area}: ${subject}\n\n${details}`,
      })
      if (isValidEmail(req.account.email)) {
        await sendMail({
          to: req.account.email,
          subject: `We received your DEVMARK request ${reference}`,
          title: 'Support request received',
          text: `Hi ${req.account.name || 'there'}, we received your request (${reference}). We will reply to this email.`,
        })
      }
      res.json({ ok: true, reference })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  return {
    recordLogin,
    issuePortalSession,
    createOtp,
    defaultNotifications,
    defaultCatalog,
    rateLimit,
  }
}

module.exports = registerMailAuth
module.exports.defaultNotifications = defaultNotifications
module.exports.defaultCatalog = defaultCatalog
module.exports.isValidEmail = isValidEmail
module.exports.normalizeEmail = normalizeEmail
module.exports.cleanText = cleanText
module.exports.maskEmail = maskEmail
module.exports.rateLimit = rateLimit
module.exports.sixDigit = sixDigit
