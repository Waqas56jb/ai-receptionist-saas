require('dotenv').config()
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const QRCode = require('qrcode')
const { createClient } = require('@supabase/supabase-js')
const { cleanText, isValidEmail, normalizeEmail, maskEmail } = require('./lib/validate')
const { sendWelcome, sendOtp } = require('./lib/mailer')
const registerMailAuth = require('./mailAuth')
const registerVoice = require('./voiceTwilio')
const sectorKnowledge = require('./lib/sectorKnowledge')
const i18n = require('./lib/languages')
const convoMemory = require('./lib/conversationMemory')

const PORT = Number(process.env.PORT || 4000)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me'
const ON_VERCEL = Boolean(process.env.VERCEL)
const SESSION_ROOT =
  process.env.SESSION_ROOT ||
  (process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'whatsapp-sessions')
    : path.join(__dirname, 'sessions'))
// Keep the API serving when a background task (WhatsApp socket, a webhook, a timer) throws
// outside a request. Without these, Node exits and every dashboard call fails until Railway restarts it.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason?.stack || reason?.message || reason)
})
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error?.stack || error)
})

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })

try {
  fs.mkdirSync(SESSION_ROOT, { recursive: true })
} catch (error) {
  console.warn('Session directory unavailable:', error.message)
}

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
const supabase =
  process.env.SUPABASE_URL && supabaseKey
    ? createClient(process.env.SUPABASE_URL, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null

const memory = {
  accounts: [],
  admins: [],
  knowledge: [],
  conversations: [],
  messages: [],
  connections: {},
  voice_calls: [],
}

const waRuntime = new Map()
const waStarting = new Map()

function now() {
  return new Date().toISOString()
}

function id(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

function sign(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '14d' })
}

async function resolveAccount(actor) {
  if (actor?.id) {
    const byId = await dbSelect('accounts', { id: actor.id })
    if (byId[0]) return byId[0]
  }
  return findAccountByEmail(actor?.email)
}

function auth(kind) {
  return (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.query.token || null
    if (!token) return res.status(401).json({ error: 'Sign in required.' })
    try {
      const payload = jwt.verify(token, JWT_SECRET)
      if (kind && payload.kind !== kind) return res.status(403).json({ error: 'Wrong workspace.' })
      req.actor = payload
      if (kind !== 'account') return next()
      resolveAccount(payload)
        .then((account) => {
          if (!account) return res.status(401).json({ error: 'Session expired. Sign in again.' })
          req.actor = { ...payload, id: account.id }
          req.account = account
          next()
        })
        .catch((error) => res.status(500).json({ error: error.message }))
    } catch {
      return res.status(401).json({ error: 'Session expired. Sign in again.' })
    }
  }
}

async function dbInsert(table, row) {
  if (supabase) {
    const { data, error } = await supabase.from(table).insert(row).select().single()
    if (error) throw error
    return data
  }
  memory[table] = memory[table] || []
  memory[table].unshift(row)
  return row
}

async function dbUpdate(table, match, patch) {
  if (supabase) {
    const { data, error } = await supabase.from(table).update(patch).match(match).select()
    if (error) throw error
    return data
  }
  const key = Object.keys(match)[0]
  memory[table] = (memory[table] || []).map((row) => (row[key] === match[key] ? { ...row, ...patch } : row))
  return memory[table].filter((row) => row[key] === match[key])
}

async function dbDelete(table, match) {
  if (supabase) {
    const { error } = await supabase.from(table).delete().match(match)
    if (error) throw error
    return
  }
  const key = Object.keys(match)[0]
  memory[table] = (memory[table] || []).filter((row) => row[key] !== match[key])
}

async function dbSelect(table, filter = {}) {
  if (supabase) {
    let q = supabase.from(table).select('*')
    Object.entries(filter).forEach(([key, value]) => {
      q = q.eq(key, value)
    })
    const { data, error } = await q
    if (error) throw error
    return data || []
  }
  return (memory[table] || []).filter((row) => Object.entries(filter).every(([key, value]) => row[key] === value))
}

async function findAccountByEmail(email) {
  const value = String(email || '').trim()
  if (!value) return null
  if (supabase) {
    const { data, error } = await supabase.from('accounts').select('*').ilike('email', value).maybeSingle()
    if (error) throw error
    return data || null
  }
  const rows = await dbSelect('accounts')
  return rows.find((row) => String(row.email).toLowerCase() === value.toLowerCase()) || null
}

async function findAdminByEmail(email) {
  const value = String(email || '').trim()
  if (!value) return null
  if (supabase) {
    const { data, error } = await supabase.from('admins').select('*').ilike('email', value).maybeSingle()
    if (error) throw error
    return data || null
  }
  const rows = await dbSelect('admins')
  return rows.find((row) => String(row.email).toLowerCase() === value.toLowerCase()) || null
}

function publicAccount(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    role: row.role || 'Owner',
    status: row.status || 'Active',
    plan: row.plan || 'Starter',
    business_name: row.business_name || row.name || '',
    business: row.business_name || row.name || '',
    industry: row.industry || '',
    country: row.country || '',
    lastLogin: row.last_login || row.lastLogin || null,
    createdAt: row.created_at || row.createdAt || null,
    knowledgeItems: Number(row.knowledgeItems) || 0,
    conversations: Number(row.conversations) || 0,
    whatsappStatus: row.whatsappStatus || 'disconnected',
    whatsappPhone: row.whatsappPhone || '',
    connected: Boolean(row.connected),
  }
}

function countByAccount(rows, key = 'account_id') {
  const counts = {}
  for (const row of rows || []) {
    const id = row?.[key]
    if (!id) continue
    counts[id] = (counts[id] || 0) + 1
  }
  return counts
}

async function adminAccountRows() {
  const [accounts, connections, knowledge, conversations] = await Promise.all([
    dbSelect('accounts'),
    dbSelect('whatsapp_connections').catch(() => []),
    dbSelect('knowledge_items').catch(() => []),
    dbSelect('conversations').catch(() => []),
  ])
  const connBy = {}
  for (const row of connections || []) {
    if (row?.account_id) connBy[row.account_id] = row
  }
  const knowledgeBy = countByAccount(knowledge)
  const conversationBy = countByAccount(conversations)
  return (accounts || []).filter(Boolean).map((row) => {
    const conn = connBy[row.id] || {}
    const status = conn.status || 'disconnected'
    return publicAccount({
      ...row,
      knowledgeItems: knowledgeBy[row.id] || 0,
      conversations: conversationBy[row.id] || 0,
      whatsappStatus: status,
      whatsappPhone: conn.phone || '',
      connected: status === 'connected',
    })
  })
}

function newWidgetToken() {
  return crypto.randomBytes(16).toString('hex')
}

async function ensureWidgetToken(account) {
  if (!account) return account
  if (account.widget_token) return account
  const token = newWidgetToken()
  await dbUpdate('accounts', { id: account.id }, { widget_token: token })
  return { ...account, widget_token: token }
}

async function findAccountByWidgetToken(token) {
  if (!token) return null
  if (supabase) {
    const { data, error } = await supabase.from('accounts').select('*').eq('widget_token', token).maybeSingle()
    if (error) throw error
    return data || null
  }
  const rows = await dbSelect('accounts')
  return rows.find((row) => row.widget_token === token) || null
}

function publicBase(req) {
  if (process.env.PUBLIC_API_URL) return process.env.PUBLIC_API_URL.replace(/\/$/, '')
  const host = req.get('x-forwarded-host') || req.get('host')
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http'
  return `${proto}://${host}`
}

function widgetPayload(account, req) {
  const token = account.widget_token
  const base = publicBase(req)
  const scriptUrl = `${base}/widget.js`
  const frameUrl = `${base}/widget/${token}`
  return {
    token,
    scriptUrl,
    frameUrl,
    snippet: `<script src="${scriptUrl}" data-widget="${token}" async></script>`,
    iframe: `<iframe src="${frameUrl}" style="position:fixed;right:16px;bottom:16px;width:380px;height:560px;border:0;z-index:2147483647;" title="Website chat"></iframe>`,
    businessName: account.business_name || account.name,
  }
}

function parseNotes(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function mapMessage(row) {
  return {
    id: row.id,
    from: row.direction === 'in' ? 'customer' : row.type === 'human' ? 'human' : 'ai',
    at: row.created_at,
    text: row.body,
    author: row.author || null,
  }
}

function mapConversation(row, messages = []) {
  const channel = row.channel || (String(row.wa_from || '').startsWith('web:') ? 'web' : 'whatsapp')
  return {
    id: row.id,
    customer: row.wa_name || (channel === 'web' ? 'Website visitor' : row.wa_from || 'Customer'),
    channel,
    status: row.status || 'open',
    unread: Boolean(row.unread),
    lead: row.lead || 'New',
    language: row.language ? i18n.languageName(row.language) : 'English',
    handledBy: row.handled_by || 'ai',
    startedAt: row.created_at,
    lastMessageAt: row.last_at || row.created_at,
    preview: row.last_message || '',
    messages: messages.map(mapMessage),
    notes: parseNotes(row.notes),
  }
}

async function conversationsForAccount(accountId) {
  const conversations = await dbSelect('conversations', { account_id: accountId })
  const messages = await dbSelect('messages', { account_id: accountId })
  return conversations
    .slice()
    .sort((a, b) => String(b.last_at || '').localeCompare(String(a.last_at || '')))
    .map((row) =>
      mapConversation(
        row,
        messages
          .filter((msg) => msg.conversation_id === row.id)
          .slice()
          .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at))),
      ),
    )
}

async function findConversationByVisitor(accountId, visitorKey) {
  const rows = await dbSelect('conversations', { account_id: accountId, wa_from: visitorKey })
  return rows[0] || null
}

async function upsertConversation(accountId, { visitorKey, name, channel, lastMessage }) {
  let conversation = await findConversationByVisitor(accountId, visitorKey)
  const stamp = now()
  if (!conversation) {
    conversation = await dbInsert('conversations', {
      id: id('conv'),
      account_id: accountId,
      wa_from: visitorKey,
      wa_name: name,
      channel,
      status: 'open',
      unread: true,
      lead: 'New',
      handled_by: 'ai',
      notes: [],
      last_message: lastMessage,
      last_at: stamp,
      created_at: stamp,
    })
  } else {
    await dbUpdate('conversations', { id: conversation.id, account_id: accountId }, {
      last_message: lastMessage,
      last_at: stamp,
      wa_name: name || conversation.wa_name,
      unread: true,
    })
    conversation = { ...conversation, last_message: lastMessage, last_at: stamp, unread: true }
  }
  return conversation
}

async function saveMessage(accountId, conversationId, direction, body, extra = {}) {
  const row = {
    id: id('msg'),
    account_id: accountId,
    conversation_id: conversationId,
    direction,
    type: extra.type || (extra.handled_as === 'human' ? 'human' : 'text'),
    channel: extra.channel || null,
    visitor_key: extra.visitorKey || null,
    body,
    created_at: now(),
  }
  const optional = {}
  if (extra.waMessageId) optional.wa_message_id = extra.waMessageId
  if (extra.language) optional.language = extra.language
  if (extra.transcription) optional.transcription = extra.transcription
  if (extra.audioRef) optional.audio_ref = extra.audioRef
  if (!Object.keys(optional).length) return dbInsert('messages', row)
  try {
    return await dbInsert('messages', { ...row, ...optional })
  } catch (error) {
    if (!isMissingColumnError(error)) throw error
    console.warn('messages: WhatsApp memory columns missing — run supabase/schema.sql.', error.message)
    return dbInsert('messages', row)
  }
}

function isDuplicateError(error) {
  return error?.code === '23505'
}

function isMissingColumnError(error) {
  return error?.code === 'PGRST204' || error?.code === '42703'
}

/** The latest messages of one conversation, oldest first. */
async function recentMessages(accountId, conversationId, limit = convoMemory.HISTORY_LIMIT) {
  if (supabase) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('account_id', accountId)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data || []).reverse()
  }
  return (memory.messages || [])
    .filter((row) => row.account_id === accountId && row.conversation_id === conversationId)
    .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
    .slice(-limit)
}

async function openaiClient() {
  if (!process.env.OPENAI_API_KEY) return null
  const OpenAI = require('openai')
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

function formatCatalogLines(label, rows, line) {
  if (!Array.isArray(rows) || !rows.length) return ''
  return `${label}:\n${rows.map(line).filter(Boolean).join('\n')}`
}

async function knowledgeContext(accountId) {
  const [itemRows, settings, accounts] = await Promise.all([
    dbSelect('knowledge_items', { account_id: accountId }).catch(() => []),
    getSettings(accountId).catch(() => defaultSettings),
    dbSelect('accounts', { id: accountId }).catch(() => []),
  ])
  const account = accounts[0] || {}
  const catalog = settings.catalog || {}
  const prompts = settings.prompts || {}
  const items = itemRows.filter((item) => String(item.status || 'Active') !== 'Disabled' && String(item.status || '') !== 'Draft')
  const titles = new Set(items.map((item) => item.title))
  const parts = []

  parts.push(
    [
      `Business name: ${account.business_name || account.name || 'this business'}`,
      account.industry ? `Sector: ${account.industry}` : '',
      account.description ? `About: ${account.description}` : '',
      account.phone ? `Phone: ${account.phone}` : '',
      account.email ? `Email: ${account.email}` : '',
      account.website ? `Website: ${account.website}` : '',
      account.address ? `Address: ${account.address}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  )

  const hours = parseHours(account.hours)
  if (hours.length) {
    parts.push(
      `Opening hours:\n${hours
        .map((row) => `${row.day || row.label || ''}: ${row.closed ? 'Closed' : `${row.open || ''}–${row.close || ''}`}`)
        .join('\n')}`,
    )
  }

  const services = formatCatalogLines('Services and prices', catalog.services, (row) =>
    row?.name ? `- ${row.name}${row.price ? ` (${row.price}${row.unit ? ` ${row.unit}` : ''})` : ''}${row.description ? `: ${row.description}` : ''}` : '',
  )
  const products = formatCatalogLines('Products', catalog.products, (row) =>
    row?.name ? `- ${row.name}${row.price ? ` (${row.price})` : ''}${row.description ? `: ${row.description}` : ''}` : '',
  )
  const policies = formatCatalogLines('Policies', catalog.policies, (row) =>
    row?.title || row?.name ? `- ${row.title || row.name}: ${row.body || row.description || ''}` : '',
  )
  const rules = formatCatalogLines('Booking rules', catalog.bookingRules, (row) =>
    row?.title || row?.name ? `- ${row.title || row.name}: ${row.body || row.description || ''}` : '',
  )
  ;[services, products, policies, rules].forEach((block) => block && parts.push(block))

  if (prompts.system || prompts.businessRules || prompts.restrictions) {
    parts.push(
      [
        prompts.system ? `Owner instructions: ${prompts.system}` : '',
        prompts.businessRules ? `Business rules: ${prompts.businessRules}` : '',
        prompts.restrictions ? `Restrictions: ${prompts.restrictions}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  if (account.industry) {
    const packs = sectorKnowledge.packFor(account.industry)
    for (const pack of packs) {
      for (const item of pack.items) {
        if (titles.has(item.title)) continue
        parts.push(`# Sector pack — ${item.title}\n${item.body || ''}`)
      }
    }
  }

  if (items.length) {
    parts.push(items.map((item) => `# ${item.title}\n${item.body || ''}`).join('\n\n'))
  }

  const text = parts.filter(Boolean).join('\n\n').trim()
  return text ? text.slice(0, 60000) : 'No business knowledge has been added yet.'
}

function matchKnowledge(items, userText) {
  const query = String(userText || '').toLowerCase()
  const words = query.split(/\W+/).filter((word) => word.length > 3)
  return items
    .filter((item) => item.status === 'Active')
    .map((item) => {
      const hay = `${item.title || ''} ${item.body || ''}`.toLowerCase()
      const score = words.reduce((sum, word) => sum + (hay.includes(word) ? 1 : 0), 0)
      return { item, score }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.item
}

function receptionistPrompt(accountName, context, spoken = false, language = {}) {
  return `You are the AI receptionist for ${accountName || 'this business'} on WhatsApp, website chat and voice.

PRIVATE BUSINESS KNOWLEDGE (sector packs, uploaded files, services, policies and hours):
${context}

Rules:
1. If the knowledge answers the question, use it. Never contradict it.
2. If the question is not covered by the knowledge, answer it with ChatGPT general knowledge. Stay in a helpful receptionist voice.
3. Never invent this specific business's prices, hours, staff names, bookings, account numbers or private policies. If those are missing from knowledge, say you will confirm with the team, then still help with any general part of the question.
4. Keep replies short and suitable for WhatsApp.
5. Reply in the customer's language (English, Arabic, Somali, Amharic, Afar or French) — see the language rules below.${spoken ? '\n6. You are on a live phone call. Speak in 1–3 short sentences. No markdown, lists, or URLs.' : ''}

${i18n.languageRules({ ...language, spoken })}`
}

async function aiLanguageSettings(accountId) {
  const settings = await getSettings(accountId).catch(() => null)
  return { defaultLanguage: i18n.normalizeLanguage(settings?.ai_config?.defaultLanguage) }
}

const phraseCache = new Map()

/**
 * Fixed system phrases in the customer's language, as { key: text }. Bundled
 * translations are used first; anything else (Afar, or an owner's custom
 * English greeting) is translated by the model in one call and cached.
 * `custom` maps a key to owner-written text that replaces the stock phrase.
 */
async function localizePhrases(keys, lang, custom = {}) {
  const code = i18n.normalizeLanguage(lang)
  const result = {}
  const missing = {}
  for (const key of keys) {
    const stock = i18n.phrase(key, 'en') || ''
    const english = custom[key] || stock
    if (code === 'en' || i18n.detectLanguage(english) === code) result[key] = english
    else if (english === stock && i18n.phrase(key, code)) result[key] = i18n.phrase(key, code)
    else if (phraseCache.has(`${code}:${english}`)) result[key] = phraseCache.get(`${code}:${english}`)
    else missing[key] = english
  }
  if (!Object.keys(missing).length) return result
  Object.assign(result, missing)
  try {
    const client = await openaiClient()
    if (!client) return result
    const completion = await client.chat.completions.create({
      model: i18n.chatModelFor(code),
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Translate every value of the JSON object into ${i18n.languageName(code)} (${i18n.LANGUAGES[code].native}) using ${i18n.LANGUAGES[code].script} script. The text is said by a business receptionist to customers. Keep the keys, placeholders like {name}, names and numbers unchanged. Return only the JSON object.`,
        },
        { role: 'user', content: JSON.stringify(missing) },
      ],
    })
    const translated = JSON.parse(completion.choices[0]?.message?.content || '{}')
    for (const [key, english] of Object.entries(missing)) {
      const text = typeof translated[key] === 'string' ? translated[key].trim() : ''
      if (!text) continue
      phraseCache.set(`${code}:${english}`, text)
      result[key] = text
    }
  } catch (error) {
    console.warn('Phrase translation skipped:', error.message)
  }
  return result
}

async function localizePhrase(key, lang, customText) {
  const result = await localizePhrases([key], lang, customText ? { [key]: customText } : {})
  return result[key]
}

/** Store the detected customer language on a conversation (ignored if the column is missing). */
async function rememberLanguage(accountId, conversationId, text) {
  const lang = i18n.detectLanguage(text)
  if (!lang || !conversationId) return lang
  await dbUpdate('conversations', { id: conversationId, account_id: accountId }, { language: lang }).catch(() => {})
  return lang
}

async function replyFromKnowledge(accountId, userText, { spoken = false, extra = '', language = null, history = [] } = {}) {
  const detected = i18n.detectLanguage(userText) || (language ? i18n.normalizeLanguage(language) : null)
  let fallbackLang = detected || 'en'
  try {
    const [context, accounts, langSettings] = await Promise.all([
      knowledgeContext(accountId),
      dbSelect('accounts', { id: accountId }).catch(() => []),
      aiLanguageSettings(accountId),
    ])
    fallbackLang = detected || langSettings.defaultLanguage
    const name = accounts[0]?.business_name || accounts[0]?.name || 'this business'
    const client = await openaiClient()
    if (!client) {
      const items = await dbSelect('knowledge_items', { account_id: accountId })
      const hit = matchKnowledge(items, userText)
      return hit?.body || i18n.phrase('followUp', fallbackLang) || i18n.phrase('followUp', 'en')
    }
    const completion = await Promise.race([
      client.chat.completions.create({
        model: i18n.chatModelFor(fallbackLang),
        temperature: 0.5,
        messages: [
          { role: 'system', content: receptionistPrompt(name, context, spoken, { ...langSettings, detected }) },
          extra ? { role: 'system', content: extra } : null,
          ...history,
          { role: 'user', content: userText },
        ].filter(Boolean),
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('OpenAI timeout')), 25000)),
    ])
    return completion.choices[0]?.message?.content?.trim() || i18n.phrase('thanks', fallbackLang) || i18n.phrase('thanks', 'en')
  } catch (error) {
    console.error('replyFromKnowledge failed', error.message)
    return i18n.phrase('trouble', fallbackLang) || i18n.phrase('trouble', 'en')
  }
}

const TRANSCRIBE_PROMPT =
  "The speaker may use English, Arabic, Somali, Amharic, Afar, French or any other language. Transcribe exactly what is said in the original language and its own script (Amharic in Ge'ez letters, Arabic in Arabic letters). Do not translate."

/**
 * Speech to text in the caller's own language. gpt-4o-transcribe recognises Somali
 * and Amharic far better than whisper-1 (which hears them as Swahili / English), so
 * it is tried first; whisper-1 stays as the fallback.
 */
async function transcribeAudio(buffer, filename = 'audio.ogg', language = null) {
  const client = await openaiClient()
  if (!client) return ''
  const meta = language ? i18n.LANGUAGES[i18n.normalizeLanguage(language, '')] : null
  // A line configured for Somali or Amharic passes an explicit hint; otherwise the model detects.
  const hint = meta?.lowResource && meta.whisper ? meta.whisper : null
  const models = [process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-transcribe', 'whisper-1']
  let lastError
  for (const model of [...new Set(models)]) {
    try {
      const params = { file: await OpenAIFile(buffer, filename), model, prompt: TRANSCRIBE_PROMPT }
      if (hint) params.language = hint
      const result = await client.audio.transcriptions.create(params)
      return String(result.text || '').trim()
    } catch (error) {
      lastError = error
      console.warn(`Transcription with ${model} failed:`, error.message)
    }
  }
  if (lastError) throw lastError
  return ''
}

async function speakReply(text, format = 'opus', language = null) {
  const client = await openaiClient()
  if (!client) return null
  // gpt-4o-mini-tts takes a delivery instruction, so the voice speaks the reply's language natively.
  const models = [process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts', 'tts-1']
  // The customer's language wins: short replies can look like another language to the word-list detector.
  const lang = language || i18n.detectLanguage(text)
  let lastError
  for (const model of [...new Set(models)]) {
    try {
      const params = {
        model,
        voice: 'nova',
        input: text,
        response_format: format,
      }
      if (model !== 'tts-1' && model !== 'tts-1-hd') params.instructions = i18n.speechInstructions(lang)
      const speech = await client.audio.speech.create(params)
      return Buffer.from(await speech.arrayBuffer())
    } catch (error) {
      lastError = error
    }
  }
  if (lastError) throw lastError
  return null
}

async function OpenAIFile(buffer, filename) {
  const { toFile } = require('openai/uploads')
  return toFile(buffer, filename)
}

function extractPrintableText(buffer) {
  const raw = buffer.toString('utf8').replace(/\u0000/g, ' ')
  const chunks = raw.match(/[\t\n\r\x20-\x7E\u00A0-\u024F]{6,}/g) || []
  return chunks.join('\n').replace(/[ \t]{2,}/g, ' ').trim()
}

function withTimeout(promise, ms, message) {
  let timer
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms)
    }),
  ]).finally(() => clearTimeout(timer))
}

/** pdf-parse in a worker thread with a time and memory limit, so one bad PDF cannot freeze the API. */
function parsePdfIsolated(buffer, timeoutMs = 30000) {
  return new Promise((resolve) => {
    let settled = false
    const done = (result) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      worker?.terminate().catch(() => {})
      resolve(result)
    }
    let worker
    const timer = setTimeout(() => done({ error: 'PDF parsing timed out' }), timeoutMs)
    try {
      const { Worker } = require('worker_threads')
      worker = new Worker(path.join(__dirname, 'lib', 'pdfWorker.js'), {
        workerData: { buffer: new Uint8Array(buffer) },
        resourceLimits: { maxOldGenerationSizeMb: 384 },
      })
    } catch (error) {
      done({ error: `PDF worker unavailable: ${error.message}` })
      return
    }
    worker.once('message', done)
    worker.once('error', (error) => done({ error: error.message }))
    worker.once('exit', (code) => done({ error: `PDF worker exited (${code})` }))
  })
}

/** Reads a PDF (text and page images) with the OpenAI model — for scanned or designed documents. */
async function readPdfWithModel(buffer, name) {
  const client = await openaiClient()
  if (!client || buffer.length > 30 * 1024 * 1024) return ''
  const completion = await withTimeout(
    client.chat.completions.create({
      model: process.env.OPENAI_PDF_MODEL || 'gpt-4.1-mini',
      temperature: 0,
      max_tokens: 12000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'file', file: { filename: name || 'document.pdf', file_data: `data:application/pdf;base64,${buffer.toString('base64')}` } },
            {
              type: 'text',
              text: 'Extract all useful business information from this document for a receptionist knowledge base: services, prices, hours, locations, contacts, policies, team, FAQs and any other facts. Keep the original language. Plain text only, no commentary.',
            },
          ],
        },
      ],
    }),
    120000,
    'PDF reading timed out',
  )
  return String(completion.choices[0]?.message?.content || '').trim()
}

async function extractUploadText(file) {
  const mime = file.mimetype || ''
  const name = file.originalname || 'upload'
  const lower = name.toLowerCase()
  if (mime === 'application/pdf' || lower.endsWith('.pdf')) {
    const parsed = await parsePdfIsolated(file.buffer)
    const text = String(parsed.text || '').trim()
    // Designed (Canva) or scanned PDFs carry their words as images, and some PDFs stall the
    // parser — let the model read those pages instead.
    const thin = text.length < Math.max(200, (parsed.pages || 1) * 60)
    if (parsed.error || thin) {
      const read = await readPdfWithModel(file.buffer, name).catch((error) => {
        console.warn('PDF model read failed:', name, error.message)
        return ''
      })
      if (read.length > text.length) return read
    }
    return text
  }
  if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    lower.endsWith('.docx')
  ) {
    try {
      const mammoth = require('mammoth')
      const parsed = await mammoth.extractRawText({ buffer: file.buffer })
      return String(parsed.value || '').trim()
    } catch {
      return extractPrintableText(file.buffer)
    }
  }
  if (mime === 'application/msword' || lower.endsWith('.doc')) {
    const text = extractPrintableText(file.buffer)
    if (text.length > 40) return text
    return `Legacy Word document uploaded: ${name}. Convert it to PDF or DOCX if the extracted text looks incomplete.`
  }
  if (mime.startsWith('text/') || /\.(txt|csv|md)$/i.test(name)) {
    return file.buffer.toString('utf8')
  }
  if (mime.startsWith('image/')) {
    const client = await openaiClient()
    if (!client) return `Image uploaded: ${name}`
    const b64 = file.buffer.toString('base64')
    const vision = await withTimeout(client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract every useful business fact from this image for a receptionist knowledge base. Plain text only.' },
            { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } },
          ],
        },
      ],
    }), 60000, 'Image reading timed out')
    return vision.choices[0]?.message?.content || `Image uploaded: ${name}`
  }
  const fallback = extractPrintableText(file.buffer)
  return fallback || `Document uploaded: ${name}`
}

function uploadKind(file) {
  const mime = file.mimetype || ''
  const name = String(file.originalname || '').toLowerCase()
  if (mime.startsWith('image/')) return 'Image'
  if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'PDF'
  if (name.endsWith('.doc') || name.endsWith('.docx') || mime.includes('word')) return 'Document'
  return 'Document'
}

async function upsertConnection(accountId, patch) {
  memory.connections[accountId] = { ...(memory.connections[accountId] || { account_id: accountId }), ...patch }
  if (!supabase) return memory.connections[accountId]
  const existing = await dbSelect('whatsapp_connections', { account_id: accountId })
  if (existing[0]) {
    await dbUpdate('whatsapp_connections', { account_id: accountId }, patch)
    return { ...existing[0], ...patch }
  }
  return dbInsert('whatsapp_connections', { account_id: accountId, status: 'disconnected', ...patch })
}

async function getConnection(accountId) {
  if (supabase) {
    const rows = await dbSelect('whatsapp_connections', { account_id: accountId })
    if (rows[0]) return rows[0]
  }
  return memory.connections[accountId] || { account_id: accountId, status: 'disconnected' }
}

function sessionDir(accountId) {
  return path.join(SESSION_ROOT, accountId)
}

function isIgnoredWaJid(jid) {
  const value = String(jid || '')
  return (
    !value ||
    value.endsWith('@g.us') ||
    value.endsWith('@newsletter') ||
    value.endsWith('@broadcast') ||
    value === 'status@broadcast'
  )
}

function isWaLive(runtime) {
  return Boolean(runtime?.sock && runtime.last?.status === 'connected')
}

function readSessionFiles(accountId) {
  const dir = sessionDir(accountId)
  if (!fs.existsSync(dir)) return null
  const files = {}
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.json')) continue
    try {
      files[name] = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'))
    } catch {
      /* skip unreadable auth files */
    }
  }
  return Object.keys(files).length ? files : null
}

function writeSessionFiles(accountId, files) {
  if (!files || typeof files !== 'object') return false
  const dir = sessionDir(accountId)
  fs.mkdirSync(dir, { recursive: true })
  let wrote = false
  for (const [name, value] of Object.entries(files)) {
    if (!name.endsWith('.json') || value == null) continue
    fs.writeFileSync(path.join(dir, name), JSON.stringify(value))
    wrote = true
  }
  return wrote
}

async function persistWhatsAppSession(accountId) {
  const files = readSessionFiles(accountId)
  if (!files) return
  await upsertConnection(accountId, { session: files, last_seen: now() }).catch((error) => {
    console.warn('WhatsApp session persist skipped', accountId, error.message)
  })
}

function emitWa(accountId, payload) {
  const runtime = waRuntime.get(accountId)
  if (!runtime) return
  runtime.last = { ...runtime.last, ...payload }
  runtime.clients.forEach((res) => res.write(`data: ${JSON.stringify(runtime.last)}\n\n`))
}

function closeWaSocket(sock) {
  if (!sock) return
  try {
    sock.ev?.removeAllListeners?.('connection.update')
    sock.ev?.removeAllListeners?.('creds.update')
    sock.ev?.removeAllListeners?.('messages.upsert')
  } catch {
    /* ignore */
  }
  try {
    sock.end(undefined)
  } catch {
    /* already closed */
  }
}

async function encodeWhatsAppQr(raw) {
  return QRCode.toDataURL(String(raw), {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    margin: 2,
    width: 360,
    color: { dark: '#000000', light: '#FFFFFF' },
  })
}

async function resolveWaVersion(baileys) {
  try {
    const res = await fetch('https://web.whatsapp.com/sw.js', {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    })
    const text = await res.text()
    const match = text.match(/"?client_revision"?\s*:\s*(\d+)/)
    if (match?.[1]) {
      const version = [2, 3000, Number(match[1])]
      console.log('WhatsApp web version', version.join('.'), '(sw.js)')
      return version
    }
  } catch (error) {
    console.warn('WhatsApp sw.js version lookup failed:', error.message)
  }
  try {
    if (typeof baileys.fetchLatestWaWebVersion === 'function') {
      const result = await baileys.fetchLatestWaWebVersion()
      if (result?.version) {
        console.log('WhatsApp web version', result.version.join('.'), result.isLatest ? '(live)' : '(fallback)')
        return result.version
      }
    }
  } catch (error) {
    console.warn('fetchLatestWaWebVersion failed:', error.message)
  }
  try {
    const result = await baileys.fetchLatestBaileysVersion()
    return result?.version
  } catch {
    return undefined
  }
}

function waitForWa(accountId, predicate, timeoutMs = 20000) {
  return new Promise((resolve) => {
    const started = Date.now()
    const tick = () => {
      const runtime = waRuntime.get(accountId)
      if (runtime && predicate(runtime)) return resolve(runtime)
      if (Date.now() - started >= timeoutMs) return resolve(runtime || null)
      setTimeout(tick, 150)
    }
    tick()
  })
}

function waBrowser(baileys) {
  try {
    if (baileys.Browsers?.macOS) return baileys.Browsers.macOS('Chrome')
  } catch {
    /* use explicit Chrome fingerprint */
  }
  return ['Mac OS', 'Chrome', '14.4.1']
}

async function loadBaileys() {
  try {
    return require('@whiskeysockets/baileys')
  } catch (error) {
    if (error.code !== 'ERR_REQUIRE_ESM') {
      throw new Error('WhatsApp engine is not installed. Run npm install inside /server.')
    }
  }
  return import('@whiskeysockets/baileys')
}

function unwrapWaMessage(message) {
  if (!message) return null
  return (
    message.ephemeralMessage?.message ||
    message.viewOnceMessage?.message ||
    message.viewOnceMessageV2?.message ||
    message.documentWithCaptionMessage?.message ||
    message.editedMessage?.message ||
    message
  )
}

async function sendWhatsAppReply(sock, msg, payload) {
  const targets = [msg.key.remoteJid, msg.key.remoteJidAlt, msg.key.participant, msg.key.participantAlt].filter(Boolean)
  let lastError
  for (const jid of [...new Set(targets)]) {
    if (isIgnoredWaJid(jid)) continue
    try {
      await sock.sendMessage(jid, payload)
      return jid
    } catch (error) {
      lastError = error
      console.warn('WhatsApp send failed', jid, error.message)
    }
  }
  if (lastError) throw lastError
}

async function handleIncoming(accountId, sock, msg) {
  const inner = unwrapWaMessage(msg.message)
  if (!inner || msg.key.fromMe) return
  const from = msg.key.remoteJid
  if (isIgnoredWaJid(from)) return

  const audio = inner.audioMessage || inner.pttMessage
  const text =
    inner.conversation ||
    inner.extendedTextMessage?.text ||
    inner.imageMessage?.caption ||
    inner.videoMessage?.caption ||
    inner.buttonsResponseMessage?.selectedDisplayText ||
    inner.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ''
  if (!text && !audio) return

  let audioBuffer = null
  let audioRef = null
  if (audio) {
    // Enough to re-download the original note from WhatsApp later.
    audioRef = {
      provider: 'whatsapp',
      messageId: msg.key.id || null,
      mimetype: audio.mimetype || null,
      seconds: audio.seconds || null,
      directPath: audio.directPath || null,
      mediaKey: audio.mediaKey ? Buffer.from(audio.mediaKey).toString('base64') : null,
    }
    try {
      const baileys = await loadBaileys()
      audioBuffer = await baileys.downloadMediaMessage(msg, 'buffer', {})
    } catch (error) {
      console.warn('WhatsApp voice note download failed', error.message)
    }
  }

  const result = await handleWhatsAppTurn(
    accountId,
    { from, name: msg.pushName || from, text, isVoice: Boolean(audio), audio: audioBuffer, audioRef, waMessageId: msg.key.id || null },
    (payload) => sendWhatsAppReply(sock, msg, payload),
  )
  if (result.status !== 'duplicate') await upsertConnection(accountId, { last_seen: now() })
}

const waInFlight = new Set()

function phoneFromJid(jid) {
  const value = String(jid || '')
  return value.endsWith('@s.whatsapp.net') ? `+${value.split('@')[0]}` : null
}

async function extractConversationMemory({ clock, profile, state, history, latest, latestType, bookings, language }) {
  const client = await openaiClient()
  if (!client) return null
  // Somali, Amharic and Afar need the stronger model to read dates and intents reliably.
  const lowResource = language && i18n.LANGUAGES[i18n.normalizeLanguage(language, '')]?.lowResource
  const completion = await withTimeout(
    client.chat.completions.create({
      model: lowResource ? i18n.chatModelFor(language) : process.env.OPENAI_MEMORY_MODEL || 'gpt-4.1-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: convoMemory.extractionMessages({ clock, profile, state, history, latest, latestType, bookings }),
    }),
    20000,
    'Memory extraction timed out',
  )
  return convoMemory.mergeExtraction(completion.choices[0]?.message?.content, profile, state)
}

/**
 * Pending booking requests from the chat. The AI never confirms: staff (or a future
 * calendar check) moves a booking to Confirmed. Returns the conversation's bookings and a
 * factual result line for the reply model.
 */
async function applyBookingAction(accountId, conversation, mem, { customer, phone, language }) {
  const list = () => dbSelect('bookings', { account_id: accountId, conversation_id: conversation.id })
  let bookings = await list().catch(() => [])
  const newest = (rows) => rows.slice().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0]
  const pending = newest(bookings.filter((row) => row.status === 'Pending'))
  const confirmed = newest(bookings.filter((row) => row.status === 'Confirmed'))
  const wanted = mem.state.booking || {}
  let actionResult = ''
  try {
    const sameSlot = bookings.find((row) => row.status !== 'Cancelled' && row.date === wanted.date && row.time === wanted.time)
    if ((mem.action === 'request' || mem.action === 'modify') && mem.ready && sameSlot) {
      // Already requested (or confirmed by staff) for this slot — nothing to change.
      actionResult =
        sameSlot.status === 'Confirmed'
          ? `The booking on ${sameSlot.date} at ${sameSlot.time} is CONFIRMED by the team.`
          : `The booking request for ${sameSlot.date} at ${sameSlot.time} was already received and is PENDING the team's confirmation. It is NOT confirmed yet.`
      return { bookings, actionResult }
    }
    if ((mem.action === 'request' || mem.action === 'modify') && mem.ready) {
      const fields = { service: wanted.service || 'Appointment', date: wanted.date, time: wanted.time, guests: wanted.guests || 1 }
      if (pending) {
        const same = pending.date === fields.date && pending.time === fields.time && (pending.service || '') === fields.service
        if (!same) await dbUpdate('bookings', { id: pending.id, account_id: accountId }, { ...fields, customer, updated_at: now() })
      } else {
        await dbInsert('bookings', {
          id: id('bk'),
          account_id: accountId,
          conversation_id: conversation.id,
          customer,
          phone,
          ...fields,
          status: 'Pending',
          source: 'whatsapp',
          notes: confirmed
            ? `Change requested on WhatsApp for the confirmed booking on ${confirmed.date} ${confirmed.time}.`
            : 'Requested on WhatsApp — waiting for staff confirmation.',
          language,
          created_at: now(),
          updated_at: now(),
        })
      }
      actionResult = `The booking request (${fields.service}, ${fields.date} at ${fields.time}) has ALREADY been saved as PENDING (do not ask whether to proceed). Tell the customer the request has been received and the team will confirm it. It is NOT confirmed and availability has NOT been checked.`
    } else if (mem.action === 'cancel') {
      if (pending) {
        await dbUpdate('bookings', { id: pending.id, account_id: accountId }, { status: 'Cancelled', updated_at: now() })
        actionResult = `The pending booking request for ${pending.date} at ${pending.time} has been cancelled.`
      } else if (confirmed) {
        await dbUpdate('bookings', { id: confirmed.id, account_id: accountId }, {
          notes: `${confirmed.notes ? `${confirmed.notes}\n` : ''}Customer asked on WhatsApp to cancel this booking.`,
          updated_at: now(),
        })
        actionResult = `The customer wants to cancel the CONFIRMED booking on ${confirmed.date} at ${confirmed.time}. It has NOT been cancelled yet — tell them the team has been asked and will confirm the cancellation.`
      } else {
        actionResult = 'There is no booking for this customer to cancel.'
      }
    } else {
      return { bookings, actionResult }
    }
  } catch (error) {
    console.warn('Booking action failed', error.message)
    return {
      bookings,
      actionResult: 'Saving the booking request FAILED. Do not say it was received or booked; tell the customer the team will contact them to arrange it.',
    }
  }
  bookings = await list().catch(() => bookings)
  return { bookings, actionResult }
}

/**
 * One inbound WhatsApp message (text or voice): dedupe, transcribe, persist, then — unless a
 * human has taken over — reply in the customer's language using the thread, the stored
 * profile/state and the business clock. `send` delivers a Baileys payload.
 */
async function handleWhatsAppTurn(accountId, input, send) {
  const { from, name, waMessageId } = input
  const claim = waMessageId ? `${accountId}:${waMessageId}` : null
  if (claim) {
    if (waInFlight.has(claim)) return { status: 'duplicate' }
    waInFlight.add(claim)
    setTimeout(() => waInFlight.delete(claim), 10 * 60 * 1000).unref?.()
    const seen = await dbSelect('messages', { account_id: accountId, wa_message_id: waMessageId }).catch(() => [])
    if (seen.length) return { status: 'duplicate' }
  }

  const type = input.isVoice ? 'voice' : 'text'
  let transcription = null
  if (input.isVoice && input.audio) {
    try {
      transcription = (await transcribeAudio(input.audio, 'voice.ogg')) || null
    } catch (error) {
      console.warn('WhatsApp voice transcription failed', error.message)
    }
  }
  const inbound = input.isVoice ? transcription || '[voice note]' : String(input.text || '').trim()
  if (!inbound) return { status: 'empty' }

  const conversation = await upsertConversation(accountId, { visitorKey: from, name, channel: 'whatsapp', lastMessage: inbound })
  const detected = i18n.detectLanguage(inbound)
  let inboundRow
  try {
    inboundRow = await saveMessage(accountId, conversation.id, 'in', inbound, {
      type,
      channel: 'whatsapp',
      visitorKey: from,
      waMessageId,
      transcription,
      language: detected,
      audioRef: input.audioRef,
    })
  } catch (error) {
    if (isDuplicateError(error)) return { status: 'duplicate' }
    throw error
  }
  await rememberLanguage(accountId, conversation.id, inbound)

  // Human mode: the team owns this conversation, the AI stays silent.
  if ((conversation.handled_by || 'ai') === 'human') return { status: 'human' }

  const [rows, accounts] = await Promise.all([
    recentMessages(accountId, conversation.id, convoMemory.HISTORY_LIMIT + 1).catch(() => []),
    dbSelect('accounts', { id: accountId }).catch(() => []),
  ])
  const history = convoMemory.historyToChat(rows.filter((row) => row.id !== inboundRow?.id))
  const clock = convoMemory.businessClock(accounts[0]?.timezone)
  const profile = convoMemory.parseJson(conversation.profile)
  const prevState = convoMemory.parseJson(conversation.state)
  const existingBookings = await dbSelect('bookings', { account_id: accountId, conversation_id: conversation.id }).catch(() => [])

  let mem = null
  try {
    mem = await extractConversationMemory({
      clock,
      profile,
      state: prevState,
      history,
      latest: inbound,
      latestType: type,
      bookings: existingBookings,
      language: detected || conversation.language,
    })
  } catch (error) {
    console.warn('Conversation memory extraction failed', error.message)
  }
  if (!mem) mem = { profile, state: prevState, action: 'none', ready: false, handoff: i18n.wantsHumanAny(inbound), language: null }

  const extractedCode = mem.language ? i18n.normalizeLanguage(mem.language, '') : ''
  const unlistedLanguage = Boolean(mem.language && !extractedCode)
  const replyLanguage = detected || extractedCode || (unlistedLanguage ? null : conversation.language || null)
  const phone = phoneFromJid(from)
  const customer = mem.profile.name || conversation.wa_name || name || phone || 'WhatsApp customer'

  let bookings = existingBookings
  let actionResult = ''
  const convoPatch = { profile: mem.profile, state: { ...mem.state, updated_at: now() } }
  if (extractedCode && !detected) convoPatch.language = extractedCode
  if (mem.handoff) {
    convoPatch.handled_by = 'human'
    convoPatch.unread = true
    convoPatch.notes = [
      ...parseNotes(conversation.notes),
      { id: id('n'), author: 'AI receptionist', at: now(), text: 'Customer asked for a person. AI replies are paused until the team hands the conversation back to AI.' },
    ]
  } else {
    ;({ bookings, actionResult } = await applyBookingAction(accountId, conversation, mem, { customer, phone, language: replyLanguage || mem.language }))
  }
  await dbUpdate('conversations', { id: conversation.id, account_id: accountId }, convoPatch).catch(async (error) => {
    console.warn('Conversation memory not saved', error.message)
    if (mem.handoff) await dbUpdate('conversations', { id: conversation.id, account_id: accountId }, { handled_by: 'human', unread: true }).catch(() => {})
  })

  const guidance = [
    convoMemory.memoryBlock({ clock, profile: mem.profile, state: mem.state, phone, bookings, actionResult, handoff: mem.handoff }),
    type === 'voice'
      ? 'The customer sent a WhatsApp voice note and your reply will be sent back as a voice note. Reply in the exact language the customer spoke. Use short, natural spoken sentences: no markdown, lists, emojis or links.'
      : '',
  ]
    .filter(Boolean)
    .join('\n\n')
  const reply = await replyFromKnowledge(accountId, inbound, { language: replyLanguage, history, extra: guidance })

  let spoken = null
  if (type === 'voice') {
    try {
      spoken = await speakReply(reply, 'opus', replyLanguage || mem.language)
    } catch (error) {
      console.warn('WhatsApp voice reply failed, sending text', error.message)
    }
  }
  await saveMessage(accountId, conversation.id, 'out', reply, {
    type: spoken ? 'voice' : 'text',
    handled_as: 'ai',
    channel: 'whatsapp',
    visitorKey: from,
    language: replyLanguage || extractedCode || null,
    audioRef: spoken ? { provider: 'openai-tts', model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts', format: 'opus', bytes: spoken.length } : null,
  })
  await dbUpdate('conversations', { id: conversation.id, account_id: accountId }, { last_message: reply, last_at: now() })
  try {
    await send(spoken ? { audio: spoken, ptt: true, mimetype: 'audio/ogg; codecs=opus' } : { text: reply })
  } catch (error) {
    console.error('WhatsApp deliver failed', accountId, error.message)
    if (spoken) {
      try {
        await send({ text: reply })
      } catch (fallbackError) {
        console.error('WhatsApp text fallback failed', accountId, fallbackError.message)
      }
    }
  }
  return { status: mem.handoff ? 'handoff' : 'replied', reply, voice: Boolean(spoken), memory: mem, bookings, transcription }
}

async function startWhatsApp(accountId, { forceQr = false } = {}) {
  const existing = waRuntime.get(accountId)
  if (existing?.sock && existing.last?.status === 'connected' && !forceQr) return existing
  if (!forceQr && waStarting.has(accountId)) return waStarting.get(accountId)

  const job = (async () => {
    const baileys = await loadBaileys()

    const current = waRuntime.get(accountId)
    if (current?.sock) {
      current.stopping = true
      closeWaSocket(current.sock)
      current.sock = null
    }

    const dir = sessionDir(accountId)
    if (forceQr) {
      try {
        fs.rmSync(dir, { recursive: true, force: true })
      } catch {
        /* ignore */
      }
      await upsertConnection(accountId, { session: null, status: 'qr', phone: null }).catch(() => {})
    } else if (!fs.existsSync(path.join(dir, 'creds.json'))) {
      const stored = await getConnection(accountId).catch(() => null)
      if (stored?.session) writeSessionFiles(accountId, stored.session)
    }
    fs.mkdirSync(dir, { recursive: true })
    const { state, saveCreds } = await baileys.useMultiFileAuthState(dir)
    const version = await resolveWaVersion(baileys)
    const logger = require('pino')({ level: 'silent' })
    const makeWASocket = baileys.default?.default || baileys.default || baileys.makeWASocket
    const sock = makeWASocket({
      auth: state,
      version,
      logger,
      browser: waBrowser(baileys),
      syncFullHistory: false,
      markOnlineOnConnect: false,
      connectTimeoutMs: 60_000,
      defaultQueryTimeoutMs: 60_000,
    })

    const runtime = waRuntime.get(accountId) || { clients: new Set(), last: { status: 'starting' } }
    runtime.sock = sock
    runtime.stopping = false
    runtime.last = { ...runtime.last, status: 'starting', qr: forceQr ? null : runtime.last?.qr || null }
    waRuntime.set(accountId, runtime)

    sock.ev.on('creds.update', async () => {
      await saveCreds()
      persistWhatsAppSession(accountId).catch(() => {})
    })
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update
      if (qr) {
        try {
          const qrDataUrl = await encodeWhatsAppQr(qr)
          await upsertConnection(accountId, { status: 'qr' })
          emitWa(accountId, { status: 'qr', qr: qrDataUrl, pairingCode: null })
        } catch (error) {
          console.error('WhatsApp QR encode failed', accountId, error.message)
        }
      }
      if (connection === 'open') {
        const phone = sock.user?.id?.split(':')[0] || sock.user?.id
        persistWhatsAppSession(accountId).catch(() => {})
        await upsertConnection(accountId, {
          status: 'connected',
          phone,
          push_name: sock.user?.name || sock.user?.verifiedName || null,
          connected_at: now(),
          last_seen: now(),
        })
        emitWa(accountId, { status: 'connected', qr: null, pairingCode: null, phone })
      }
      if (connection === 'close') {
        if (runtime.stopping) return
        const code = lastDisconnect?.error?.output?.statusCode
        const loggedOut = code === baileys.DisconnectReason.loggedOut
        if (loggedOut) {
          await upsertConnection(accountId, { status: 'disconnected', phone: null })
          emitWa(accountId, { status: 'disconnected', qr: null, pairingCode: null })
          return
        }
        emitWa(accountId, { status: 'reconnecting' })
        const delay = code === 428 || code === 405 ? 8000 : 2500
        setTimeout(() => startWhatsApp(accountId).catch(() => {}), delay)
      }
    })
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type && type !== 'notify') return
      for (const msg of messages || []) {
        try {
          await handleIncoming(accountId, sock, msg)
        } catch (error) {
          console.error('WhatsApp inbound failed', accountId, error.message)
        }
      }
    })

    return runtime
  })()

  waStarting.set(accountId, job)
  try {
    return await job
  } finally {
    if (waStarting.get(accountId) === job) waStarting.delete(accountId)
  }
}

async function restoreSessions() {
  const ids = new Set()
  if (fs.existsSync(SESSION_ROOT)) {
    for (const entry of fs.readdirSync(SESSION_ROOT, { withFileTypes: true })) {
      if (entry.isDirectory() && fs.existsSync(path.join(SESSION_ROOT, entry.name, 'creds.json'))) ids.add(entry.name)
    }
  }
  try {
    const rows = await dbSelect('whatsapp_connections').catch(() => [])
    for (const row of rows || []) {
      if (row.status === 'connected' || row.session) ids.add(row.account_id)
    }
  } catch (error) {
    console.warn('WhatsApp restore list failed:', error.message)
  }
  for (const accountId of ids) {
    try {
      await startWhatsApp(accountId)
      console.log('Restored WhatsApp session', accountId)
    } catch (error) {
      console.error('Could not restore WhatsApp session', accountId, error.message)
    }
  }
}

async function upsertLogin(table, finder, email, password, row) {
  const existing = await finder(email)
  if (existing) {
    await dbUpdate(table, { id: existing.id }, { password_hash: bcrypt.hashSync(password, 10) })
    return existing
  }
  return dbInsert(table, row)
}

async function bootstrapLogins() {
  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@gmail.com'
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || 'admin@123!'
  const clientEmail = process.env.DEMO_CLIENT_EMAIL || 'client@gmail.com'
  const clientPassword = process.env.DEMO_CLIENT_PASSWORD || 'client@123!'

  await upsertLogin('admins', findAdminByEmail, adminEmail, adminPassword, {
    id: 'adm_demo_admin',
    name: process.env.BOOTSTRAP_ADMIN_NAME || 'Platform Admin',
    email: adminEmail,
    password_hash: bcrypt.hashSync(adminPassword, 10),
    created_at: now(),
  })
  console.log('Admin login ready:', adminEmail)

  const client = await upsertLogin('accounts', findAccountByEmail, clientEmail, clientPassword, {
    id: 'acc_demo_client',
    name: 'Client Owner',
    email: clientEmail,
    password_hash: bcrypt.hashSync(clientPassword, 10),
    role: 'Owner',
    status: 'Active',
    business_name: 'Client Business',
    plan: 'Starter',
    widget_token: newWidgetToken(),
    created_at: now(),
  })
  await ensureWidgetToken(client)
  console.log('Client login ready:', clientEmail)
}

const app = express()

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://ai-receptionist-saas-nu.vercel.app',
  'https://ai-receptionist-saas-admin-psi.vercel.app',
  'https://ai-receptionist-saas-production-2c89.up.railway.app',
]
const allowedOrigins = [
  ...defaultOrigins,
  ...String(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
]

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  try {
    const host = new URL(origin).hostname
    return host.endsWith('.vercel.app')
  } catch {
    return false
  }
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin) ? origin || true : false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  }),
)
app.options('*', cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '8mb' }))

let bootPromise = null
async function ensureVoiceTables() {
  const urls = [...new Set([process.env.DATABASE_URL, process.env.DATABASE_DIRECT_URL].filter(Boolean))]
  if (!urls.length) return
  const { Client } = require('pg')
  let lastError
  for (const url of urls) {
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
    try {
      await client.connect()
      await applyVoiceTables(client)
      await client.end().catch(() => {})
      return
    } catch (error) {
      lastError = error
      await client.end().catch(() => {})
    }
  }
  throw lastError || new Error('No database URL')
}

async function applyVoiceTables(client) {
    await client.query(`alter table account_settings add column if not exists voice jsonb default '{}'`)
    await client.query(`
      create table if not exists voice_calls (
        id text primary key,
        account_id text not null references accounts(id) on delete cascade,
        conversation_id text,
        twilio_sid text unique,
        direction text not null default 'inbound',
        from_number text,
        to_number text,
        status text default 'initiated',
        duration integer default 0,
        recording_url text,
        recording_sid text,
        outcome text,
        transferred boolean default false,
        ai_handled boolean default true,
        started_at timestamptz,
        ended_at timestamptz,
        created_at timestamptz default now()
      )
    `)
    await client.query(`create index if not exists voice_calls_account_idx on voice_calls(account_id, created_at desc)`)
    await client.query(`alter table voice_calls enable row level security`)
    await client.query(`revoke all on table voice_calls from anon, authenticated, public`)
    await client.query(`grant all on table voice_calls to service_role`)
    await client.query(`alter table whatsapp_connections add column if not exists session jsonb`)
}

async function syncPlatformTwilio() {
  const creds = require('./lib/twilioVoice').envCreds()
  if (!require('./lib/twilioVoice').twilioReady(creds) || !process.env.PUBLIC_API_URL) return null
  const urls = require('./lib/twilioVoice').webhookUrls(process.env.PUBLIC_API_URL)
  return require('./lib/twilioVoice').provisionNumber(creds, urls)
}

function ensureStarted() {
  if (!bootPromise) {
    bootPromise = (async () => {
      try {
        await ensureVoiceTables()
      } catch (error) {
        console.warn('Voice tables skipped:', error.message)
      }
      try {
        await bootstrapLogins()
      } catch (error) {
        console.warn('Bootstrap skipped:', error.message)
      }
    })()
  }
  return bootPromise
}

function healthPayload() {
  return {
    ok: true,
    uptime: Math.round(process.uptime()),
    supabase: Boolean(supabase),
    openai: Boolean(process.env.OPENAI_API_KEY),
    mailer: Boolean(process.env.MAIL_USER && process.env.MAIL_PASS),
    vercel: ON_VERCEL,
    twilio: Boolean(
      (process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID) &&
        (process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN || (process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET)) &&
        (process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM),
    ),
    whatsapp: [...waRuntime.values()].filter((runtime) => isWaLive(runtime)).length,
    time: now(),
  }
}

app.get(['/health', '/api/health'], (_req, res) => {
  res.json(healthPayload())
})

app.use((req, res, next) => {
  if (req.path === '/health' || req.path === '/api/health') return next()
  ensureStarted().then(() => next(), next)
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password || '')
    const fullName = cleanText(req.body?.fullName, 80)
    const businessName = cleanText(req.body?.businessName, 120)
    const phone = cleanText(req.body?.phone, 40)
    const businessType = cleanText(req.body?.businessType, 80)
    const website = cleanText(req.body?.website, 200)
    const country = cleanText(req.body?.country, 80)
    if (!fullName || !password) return res.status(400).json({ error: 'Name, email and password are required.' })
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
    if (password.length < 8) return res.status(400).json({ error: 'Use at least 8 characters for your password.' })
    if (await findAccountByEmail(email)) return res.status(409).json({ error: 'An account already exists for that email.' })
    const row = await dbInsert('accounts', {
      id: id('acc'),
      name: fullName,
      email,
      password_hash: bcrypt.hashSync(password, 10),
      role: 'Owner',
      status: 'Active',
      business_name: businessName || fullName,
      industry: businessType || null,
      phone: phone || null,
      website: website || null,
      country: country || null,
      plan: 'Starter',
      two_factor: false,
      widget_token: newWidgetToken(),
      created_at: now(),
    })
    sendWelcome({ to: email, name: fullName, businessName: row.business_name }).catch((error) => {
      console.warn('Welcome email failed:', error.message)
    })
    const token = sign({ kind: 'account', id: row.id, email: row.email })
    res.json({
      token,
      user: { id: row.id, name: row.name, email: row.email, role: row.role, phone: row.phone || '', twoFactor: false },
      business: { id: row.id, name: row.business_name },
      signedInAt: now(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password || '')
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
    const row = await findAccountByEmail(email)
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: 'Email or password is incorrect.' })
    }
    if (row.status === 'Blocked' || row.status === 'Suspended') {
      return res.status(403).json({ error: `This account is ${row.status.toLowerCase()}.` })
    }
    await ensureWidgetToken(row)
    if (row.two_factor) {
      const code = String(crypto.randomInt(100000, 1000000))
      const challenge = await dbInsert('email_otps', {
        id: id('otp'),
        account_id: row.id,
        purpose: 'login',
        email: row.email,
        code_hash: bcrypt.hashSync(code, 8),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        used: false,
        created_at: now(),
      })
      await sendOtp({ to: row.email, name: row.name, code, reason: 'complete sign-in' })
      return res.json({
        requiresOtp: true,
        challengeId: challenge.id,
        emailHint: maskEmail(row.email),
      })
    }
    await dbUpdate('accounts', { id: row.id }, { last_login: now() })
    const token = sign({ kind: 'account', id: row.id, email: row.email })
    dbInsert('account_sessions', {
      id: id('ses'),
      account_id: row.id,
      token_hash: crypto.createHash('sha256').update(token).digest('hex'),
      device: String(req.headers['user-agent'] || '').slice(0, 80) || 'Web browser',
      location: 'Web',
      ip: String(req.headers['x-forwarded-for'] || req.ip || 'unknown').split(',')[0].trim(),
      last_active: now(),
      created_at: now(),
    }).catch((error) => console.warn('session insert skipped:', error.message))
    dbInsert('login_events', {
      id: id('log'),
      account_id: row.id,
      device: 'Web',
      location: 'Web',
      ip: String(req.headers['x-forwarded-for'] || req.ip || 'unknown').split(',')[0].trim(),
      result: 'Success',
      created_at: now(),
    }).catch((error) => console.warn('login event skipped:', error.message))
    res.json({
      token,
      user: { id: row.id, name: row.name, email: row.email, role: row.role, phone: row.phone || '', twoFactor: Boolean(row.two_factor) },
      business: { id: row.id, name: row.business_name },
      signedInAt: now(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/admin/auth/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password || '')
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
    const row = await findAdminByEmail(email)
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: 'Email or password is incorrect.' })
    }
    const token = sign({ kind: 'admin', id: row.id, email: row.email })
    res.json({ token, admin: { id: row.id, name: row.name, email: row.email, role: 'Super Admin', status: 'Active' }, signedInAt: now() })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/whatsapp/status', auth('account'), async (req, res) => {
  try {
    const connection = await getConnection(req.actor.id)
    let runtime = waRuntime.get(req.actor.id)
    if ((connection.status === 'connected' || connection.session) && !isWaLive(runtime) && !waStarting.has(req.actor.id)) {
      startWhatsApp(req.actor.id).catch((error) => console.warn('WhatsApp restore failed', req.actor.id, error.message))
      runtime = waRuntime.get(req.actor.id)
    }
    const live = isWaLive(runtime)
    res.json({
      connected: live,
      status: live ? 'connected' : runtime?.last?.status || (connection.session || connection.status === 'connected' ? 'reconnecting' : connection.status || 'disconnected'),
      phone: runtime?.last?.phone || connection.phone || null,
      qr: runtime?.last?.qr || null,
      pairingCode: runtime?.last?.pairingCode || null,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/whatsapp/qr', auth('account'), async (req, res) => {
  try {
    const connection = await getConnection(req.actor.id)
    if (isWaLive(waRuntime.get(req.actor.id)) && !req.body?.force) {
      return res.json({ connected: true, status: 'connected', phone: connection.phone, qr: null })
    }
    const runtime = await startWhatsApp(req.actor.id, { forceQr: Boolean(req.body?.force) })
    const ready = await waitForWa(
      req.actor.id,
      (item) => Boolean(item.last?.qr) || item.last?.status === 'connected',
      20000,
    )
    const last = ready?.last || runtime?.last || {}
    res.json({
      status: last.status || 'qr',
      qr: last.qr || null,
      pairingCode: last.pairingCode || null,
      phone: last.phone || connection.phone || null,
      connected: last.status === 'connected',
      message: last.qr
        ? 'Scan the WhatsApp QR code. Closing this page does not disconnect the number.'
        : 'WhatsApp is preparing a new QR code. Keep this page open.',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/whatsapp/pair', auth('account'), async (req, res) => {
  try {
    const phone = String(req.body?.phone || '').replace(/\D/g, '')
    if (phone.length < 8 || phone.length > 15) {
      return res.status(400).json({ error: 'Enter the WhatsApp number with country code, digits only.' })
    }
    const connection = await getConnection(req.actor.id)
    if (isWaLive(waRuntime.get(req.actor.id))) {
      return res.json({ connected: true, status: 'connected', phone: connection.phone, qr: null })
    }
    const runtime = await startWhatsApp(req.actor.id, { forceQr: true })
    await waitForWa(req.actor.id, (item) => Boolean(item.sock), 8000)
    const sock = waRuntime.get(req.actor.id)?.sock || runtime.sock
    if (!sock?.requestPairingCode) {
      return res.status(500).json({ error: 'WhatsApp pairing is unavailable on this server.' })
    }
    if (sock.authState?.creds?.registered) {
      return res.json({ connected: true, status: 'connected', phone: connection.phone, qr: null })
    }
    await new Promise((resolve) => setTimeout(resolve, 2500))
    const code = await sock.requestPairingCode(phone)
    emitWa(req.actor.id, { status: 'pairing', pairingCode: code, phone })
    res.json({
      status: 'pairing',
      pairingCode: code,
      phone,
      connected: false,
      message: 'Enter this code in WhatsApp → Linked devices → Link with phone number.',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/whatsapp/events', auth('account'), async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()
  const runtime = waRuntime.get(req.actor.id) || { clients: new Set(), last: { status: 'disconnected' } }
  runtime.clients.add(res)
  waRuntime.set(req.actor.id, runtime)
  res.write(`data: ${JSON.stringify(runtime.last)}\n\n`)
  req.on('close', () => runtime.clients.delete(res))
})

app.post('/api/whatsapp/disconnect', auth('account'), async (req, res) => {
  try {
    const runtime = waRuntime.get(req.actor.id)
    if (runtime?.sock) {
      try {
        await runtime.sock.logout()
      } catch {
        try {
          runtime.sock.end(undefined)
        } catch {
          /* ignore */
        }
      }
    }
    waRuntime.delete(req.actor.id)
    fs.rmSync(sessionDir(req.actor.id), { recursive: true, force: true })
    await upsertConnection(req.actor.id, { status: 'disconnected', phone: null, push_name: null, session: null })
    res.json({ connected: false, status: 'disconnected' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/knowledge', auth('account'), async (req, res) => {
  try {
    const items = await dbSelect('knowledge_items', { account_id: req.actor.id })
    res.json(items.map(mapKnowledge))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/knowledge', auth('account'), async (req, res) => {
  try {
    const { title, category, body, status } = req.body || {}
    if (!title || !body) return res.status(400).json({ error: 'Title and content are required.' })
    await dbInsert('knowledge_items', {
      id: id('kb'),
      account_id: req.actor.id,
      title,
      category: category || 'Business Info',
      body,
      source: 'Manual',
      status: status || 'Active',
      created_at: now(),
      updated_at: now(),
    })
    res.json((await dbSelect('knowledge_items', { account_id: req.actor.id })).map(mapKnowledge))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/knowledge/:id', auth('account'), async (req, res) => {
  try {
    const { id: _id, account_id: _accountId, created_at: _created, ...safe } = req.body || {}
    await dbUpdate('knowledge_items', { id: req.params.id, account_id: req.actor.id }, { ...safe, updated_at: now() })
    res.json((await dbSelect('knowledge_items', { account_id: req.actor.id })).map(mapKnowledge))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/knowledge/:id', auth('account'), async (req, res) => {
  try {
    await dbDelete('knowledge_items', { id: req.params.id, account_id: req.actor.id })
    res.json((await dbSelect('knowledge_items', { account_id: req.actor.id })).map(mapKnowledge))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/knowledge/upload', auth('account'), upload.array('files', 8), async (req, res) => {
  try {
    const files = req.files || []
    if (!files.length) return res.status(400).json({ error: 'Choose a PDF, Word, text or image file to upload.' })
    const sector = cleanText(req.body?.sector, 80)
    const category = cleanText(req.body?.category, 60) || 'Documents'
    const existing = await dbSelect('knowledge_items', { account_id: req.actor.id }).catch(() => [])
    const recentCutoff = Date.now() - 3 * 60 * 1000
    for (const file of files) {
      // The phone client retries an upload whose connection dropped; skip the copy if the first one landed.
      const repeat = existing.some(
        (row) => row.file_name === file.originalname && new Date(row.created_at).getTime() > recentCutoff,
      )
      if (repeat) continue
      // One unreadable file (e.g. a HEIC phone photo the vision model rejects) must not fail the whole upload.
      const body = await extractUploadText(file).catch((error) => {
        console.warn('Upload text extraction failed:', file.originalname, error.message)
        return ''
      })
      const kind = uploadKind(file)
      const extracted = String(body || '').trim()
      const row = {
        id: id('kb'),
        account_id: req.actor.id,
        title: sector ? `${sector} — ${file.originalname}` : file.originalname,
        category,
        body:
          extracted ||
          `Uploaded ${file.originalname}. The file had no readable text. Add a short summary so the AI can use it.`,
        source: kind,
        status: 'Active',
        created_at: now(),
        updated_at: now(),
      }
      try {
        await dbInsert('knowledge_items', { ...row, file_name: file.originalname, mime: file.mimetype })
      } catch {
        await dbInsert('knowledge_items', row)
      }
    }
    res.json((await dbSelect('knowledge_items', { account_id: req.actor.id })).map(mapKnowledge))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/knowledge/sectors', auth('account'), async (req, res) => {
  try {
    const items = await dbSelect('knowledge_items', { account_id: req.actor.id })
    const titles = new Set(items.map((item) => item.title))
    res.json({
      businessType: req.account?.industry || '',
      sectors: sectorKnowledge.listSectors().map((sector) => ({
        ...sector,
        loaded: sectorKnowledge.packTitles(sector.id).every((title) => titles.has(title)),
      })),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/knowledge/sector-pack', auth('account'), async (req, res) => {
  try {
    const requested = cleanText(req.body?.sector, 80) || req.account?.industry || ''
    const packs = sectorKnowledge.packFor(requested)
    if (!packs.length) return res.status(400).json({ error: 'Choose a business sector to add.' })
    const existing = await dbSelect('knowledge_items', { account_id: req.actor.id })
    const titles = new Set(existing.map((item) => item.title))
    let added = 0
    for (const pack of packs) {
      for (const item of pack.items) {
        if (titles.has(item.title)) continue
        await dbInsert('knowledge_items', {
          id: id('kb'),
          account_id: req.actor.id,
          title: item.title,
          category: item.category || 'Business Info',
          body: item.body,
          source: 'Sector pack',
          status: 'Active',
          created_at: now(),
          updated_at: now(),
        })
        titles.add(item.title)
        added += 1
      }
    }
    res.json({
      added,
      items: (await dbSelect('knowledge_items', { account_id: req.actor.id })).map(mapKnowledge),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/conversations', auth('account'), async (req, res) => {
  try {
    res.json(await conversationsForAccount(req.actor.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/conversations/:id', auth('account'), async (req, res) => {
  try {
    const rows = await conversationsForAccount(req.actor.id)
    const found = rows.find((row) => row.id === req.params.id)
    if (!found) return res.status(404).json({ error: 'Conversation not found.' })
    res.json(found)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/conversations/:id', auth('account'), async (req, res) => {
  try {
    const existing = (await dbSelect('conversations', { account_id: req.actor.id })).find((row) => row.id === req.params.id)
    if (!existing) return res.status(404).json({ error: 'Conversation not found.' })
    const patch = {}
    if (req.body.status) patch.status = req.body.status
    if (req.body.lead) patch.lead = req.body.lead
    if (req.body.handledBy) patch.handled_by = req.body.handledBy
    if (req.body.unread !== undefined) patch.unread = req.body.unread
    if (Object.keys(patch).length) await dbUpdate('conversations', { id: existing.id, account_id: req.actor.id }, patch)
    const rows = await conversationsForAccount(req.actor.id)
    res.json(rows.find((row) => row.id === existing.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/conversations/:id/notes', auth('account'), async (req, res) => {
  try {
    const existing = (await dbSelect('conversations', { account_id: req.actor.id })).find((row) => row.id === req.params.id)
    if (!existing) return res.status(404).json({ error: 'Conversation not found.' })
    const notes = [
      ...parseNotes(existing.notes),
      { id: id('n'), author: req.body.author || 'Team', at: now(), text: req.body.text },
    ]
    await dbUpdate('conversations', { id: existing.id, account_id: req.actor.id }, { notes })
    const rows = await conversationsForAccount(req.actor.id)
    res.json(rows.find((row) => row.id === existing.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/conversations/:id/reply', auth('account'), async (req, res) => {
  try {
    const existing = (await dbSelect('conversations', { account_id: req.actor.id })).find((row) => row.id === req.params.id)
    if (!existing) return res.status(404).json({ error: 'Conversation not found.' })
    const text = String(req.body.text || '').trim()
    if (!text) return res.status(400).json({ error: 'Reply text is required.' })
    await saveMessage(req.actor.id, existing.id, 'out', text, { type: 'human' })
    await dbUpdate('conversations', { id: existing.id, account_id: req.actor.id }, {
      last_message: text,
      last_at: now(),
      handled_by: 'human',
      unread: false,
    })
    // WhatsApp threads: deliver the team's reply to the customer through the linked number.
    let delivered = null
    const target = String(existing.wa_from || '')
    if ((existing.channel || 'whatsapp') === 'whatsapp' && target.includes('@') && !isIgnoredWaJid(target)) {
      delivered = false
      if (!isWaLive(waRuntime.get(req.actor.id))) {
        await startWhatsApp(req.actor.id).catch(() => {})
        await waitForWa(req.actor.id, (item) => isWaLive(item), 8000)
      }
      const sock = waRuntime.get(req.actor.id)?.sock
      if (sock) {
        try {
          await sock.sendMessage(target, { text })
          delivered = true
        } catch (error) {
          console.warn('Dashboard reply not delivered to WhatsApp', error.message)
        }
      }
    }
    const rows = await conversationsForAccount(req.actor.id)
    res.json({ ...rows.find((row) => row.id === existing.id), delivered })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const BOOKING_STATUSES = ['Confirmed', 'Pending', 'Completed', 'Cancelled']

function mapBooking(row) {
  return {
    id: row.id,
    customer: row.customer || '',
    phone: row.phone || '',
    service: row.service || '',
    date: row.date || '',
    time: row.time || '',
    guests: Number(row.guests || 1),
    nights: Number(row.nights || 0),
    value: Number(row.value || 0),
    status: row.status || 'Pending',
    source: row.source || 'manual',
    notes: row.notes || '',
    language: row.language || null,
    conversationId: row.conversation_id || null,
    createdAt: row.created_at,
  }
}

async function bookingsForAccount(accountId) {
  const rows = await dbSelect('bookings', { account_id: accountId })
  return rows.map(mapBooking).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
}

function bookingPatch(body = {}) {
  const patch = {}
  for (const key of ['customer', 'phone', 'service', 'notes']) if (body[key] !== undefined) patch[key] = cleanText(body[key], key === 'notes' ? 2000 : 160)
  if (body.date !== undefined) patch.date = /^\d{4}-\d{2}-\d{2}$/.test(String(body.date)) ? String(body.date) : null
  if (body.time !== undefined) patch.time = /^\d{2}:\d{2}$/.test(String(body.time)) ? String(body.time) : null
  for (const key of ['guests', 'nights', 'value']) if (body[key] !== undefined) patch[key] = Math.max(0, Number(body[key]) || 0)
  if (body.status !== undefined && BOOKING_STATUSES.includes(body.status)) patch.status = body.status
  return patch
}

app.get('/api/bookings', auth('account'), async (req, res) => {
  try {
    res.json(await bookingsForAccount(req.actor.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/bookings', auth('account'), async (req, res) => {
  try {
    const patch = bookingPatch(req.body)
    if (!patch.customer) return res.status(400).json({ error: 'Customer is required.' })
    await dbInsert('bookings', {
      id: id('bk'),
      account_id: req.actor.id,
      status: 'Pending',
      source: cleanText(req.body.source, 40) || 'manual',
      created_at: now(),
      ...patch,
      updated_at: now(),
    })
    res.json(await bookingsForAccount(req.actor.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/bookings/:id', auth('account'), async (req, res) => {
  try {
    const existing = (await dbSelect('bookings', { id: req.params.id, account_id: req.actor.id }))[0]
    if (!existing) return res.status(404).json({ error: 'Booking not found.' })
    const patch = bookingPatch(req.body)
    if (Object.keys(patch).length) await dbUpdate('bookings', { id: existing.id, account_id: req.actor.id }, { ...patch, updated_at: now() })
    res.json(await bookingsForAccount(req.actor.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/bookings/:id', auth('account'), async (req, res) => {
  try {
    await dbDelete('bookings', { id: req.params.id, account_id: req.actor.id })
    res.json(await bookingsForAccount(req.actor.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/widget', auth('account'), async (req, res) => {
  try {
    const account = await ensureWidgetToken(req.account)
    if (!account) return res.status(404).json({ error: 'Account not found.' })
    res.json(widgetPayload(account, req))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/widget/regenerate', auth('account'), async (req, res) => {
  try {
    const token = newWidgetToken()
    await dbUpdate('accounts', { id: req.actor.id }, { widget_token: token })
    res.json(widgetPayload({ ...req.account, widget_token: token }, req))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/widget/:token/config', async (req, res) => {
  try {
    const account = await findAccountByWidgetToken(req.params.token)
    if (!account || account.status === 'Blocked' || account.status === 'Suspended') {
      return res.status(404).json({ error: 'This chat widget is not available.' })
    }
    const trained = (await dbSelect('knowledge_items', { account_id: account.id })).some((item) => item.status === 'Active')
    await touchWidget(account.id)
    const businessName = account.business_name || account.name
    const requested = String(req.query.lang || '').trim()
    const language = requested
      ? i18n.normalizeLanguage(requested, (await aiLanguageSettings(account.id)).defaultLanguage)
      : (await aiLanguageSettings(account.id)).defaultLanguage
    const greetingKey = trained ? 'widgetGreeting' : 'widgetGreetingOpen'
    const uiKeys = ['widgetSubtitle', 'widgetPlaceholder', 'widgetSend', 'widgetConnecting', 'widgetVoiceHint', 'widgetEndVoice', 'widgetListening', 'widgetThinking', 'widgetSpeechTurns', 'widgetMicUnavailable', 'widgetHello', 'thanks']
    const text = await localizePhrases([greetingKey, ...uiKeys], language)
    res.json({
      businessName,
      greeting: text[greetingKey].replace('{name}', businessName),
      trained,
      voice: Boolean(process.env.OPENAI_API_KEY),
      language,
      dir: language === 'ar' ? 'rtl' : 'ltr',
      ui: Object.fromEntries(uiKeys.map((key) => [key, text[key]])),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/widget/:token/history', async (req, res) => {
  try {
    const account = await findAccountByWidgetToken(req.params.token)
    if (!account || account.status === 'Blocked' || account.status === 'Suspended') {
      return res.status(404).json({ error: 'This chat widget is not available.' })
    }
    const visitorId = String(req.query.visitorId || '').trim()
    if (!visitorId) return res.json({ messages: [] })
    const conversation = await findConversationByVisitor(account.id, `web:${visitorId}`)
    if (!conversation) return res.json({ messages: [] })
    const messages = (await dbSelect('messages', { conversation_id: conversation.id }))
      .slice()
      .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
    res.json({ conversationId: conversation.id, messages: messages.map(mapMessage) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

async function touchWidget(accountId, visitorId) {
  const existing = await dbSelect('widget_connections', { account_id: accountId })
  const patch = { status: 'live', last_seen: now(), last_visitor: visitorId || null }
  if (existing[0]) {
    await dbUpdate('widget_connections', { account_id: accountId }, patch)
    return { ...existing[0], ...patch }
  }
  return dbInsert('widget_connections', { account_id: accountId, created_at: now(), ...patch })
}

async function persistWidgetMessages(account, { visitorId, visitorName, inbound, outbound, type = 'text' }) {
  const visitorKey = `web:${visitorId}`
  const conversation = await upsertConversation(account.id, {
    visitorKey,
    name: visitorName || 'Website visitor',
    channel: 'web',
    lastMessage: outbound || inbound,
  })
  if (inbound) await saveMessage(account.id, conversation.id, 'in', inbound, { type, channel: 'web', visitorKey })
  if (outbound) await saveMessage(account.id, conversation.id, 'out', outbound, { type, handled_as: 'ai', channel: 'web', visitorKey })
  await dbUpdate('conversations', { id: conversation.id, account_id: account.id }, { last_message: outbound || inbound, last_at: now() })
  await touchWidget(account.id, visitorId)
  return conversation
}

app.post('/api/widget/:token/realtime', async (req, res) => {
  try {
    const account = await findAccountByWidgetToken(req.params.token)
    if (!account || account.status === 'Blocked' || account.status === 'Suspended') {
      return res.status(404).json({ error: 'This chat widget is not available.' })
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'Voice needs an OpenAI key on the server.', fallback: true })
    }
    const context = await knowledgeContext(account.id)
    const name = account.business_name || account.name
    const instructions = receptionistPrompt(name, context, true, await aiLanguageSettings(account.id))
    const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime'
    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    }
    let response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model,
          instructions,
          audio: {
            input: { transcription: { model: 'gpt-4o-mini-transcribe' } },
            output: { voice: 'marin' },
          },
        },
      }),
    })
    let data = await response.json().catch(() => ({}))
    if (!response.ok) {
      response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: { ...headers, 'OpenAI-Beta': 'realtime=v1' },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview',
          voice: 'alloy',
          modalities: ['audio', 'text'],
          instructions,
          input_audio_transcription: { model: 'whisper-1' },
        }),
      })
      data = await response.json().catch(() => ({}))
    }
    const value = data.value || data.client_secret?.value
    if (!response.ok || !value) {
      return res.status(502).json({ error: data.error?.message || 'Could not start a live voice session.', fallback: true })
    }
    res.json({
      value,
      expiresAt: data.expires_at || data.client_secret?.expires_at || null,
      model: data.session?.model || data.model || model,
    })
  } catch (error) {
    res.status(500).json({ error: error.message, fallback: true })
  }
})

app.post('/api/widget/:token/voice', upload.single('audio'), async (req, res) => {
  try {
    const account = await findAccountByWidgetToken(req.params.token)
    if (!account || account.status === 'Blocked' || account.status === 'Suspended') {
      return res.status(404).json({ error: 'This chat widget is not available.' })
    }
    if (!req.file?.buffer) return res.status(400).json({ error: 'Audio is required.' })
    const visitorId = String(req.body.visitorId || '').trim() || id('vis')
    const visitorName = String(req.body.visitorName || '').trim() || 'Website visitor'
    const visitorLang = req.body.lang ? i18n.normalizeLanguage(req.body.lang) : null
    const transcript = (await transcribeAudio(req.file.buffer, req.file.originalname || 'voice.webm')) || ''
    if (!transcript) return res.status(422).json({ error: await localizePhrase('couldNotHear', visitorLang || 'en') })
    const reply = await replyFromKnowledge(account.id, transcript, { language: visitorLang })
    await persistWidgetMessages(account, { visitorId, visitorName, inbound: transcript, outbound: reply, type: 'voice' })
    const spoken = await speakReply(reply, 'mp3')
    res.json({
      visitorId,
      transcript,
      reply,
      audio: spoken ? spoken.toString('base64') : null,
      mime: 'audio/mpeg',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/widget/:token/voice-log', async (req, res) => {
  try {
    const account = await findAccountByWidgetToken(req.params.token)
    if (!account || account.status === 'Blocked' || account.status === 'Suspended') {
      return res.status(404).json({ error: 'This chat widget is not available.' })
    }
    const visitorId = String(req.body.visitorId || '').trim() || id('vis')
    const visitorName = String(req.body.visitorName || '').trim() || 'Website visitor'
    const inbound = String(req.body.inbound || '').trim()
    const outbound = String(req.body.outbound || '').trim()
    if (!inbound && !outbound) return res.status(400).json({ error: 'Nothing to save.' })
    await persistWidgetMessages(account, { visitorId, visitorName, inbound, outbound, type: 'voice' })
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/widget/:token/chat', async (req, res) => {
  try {
    const account = await findAccountByWidgetToken(req.params.token)
    if (!account) return res.status(404).json({ error: 'This chat widget is not available.' })
    if (account.status === 'Blocked' || account.status === 'Suspended') {
      return res.status(403).json({ error: 'This chat widget is currently disabled.' })
    }
    const text = String(req.body.message || req.body.text || '').trim()
    if (!text) return res.status(400).json({ error: 'Message is required.' })
    const visitorId = String(req.body.visitorId || '').trim() || id('vis')
    const visitorName = String(req.body.visitorName || '').trim() || 'Website visitor'
    const conversation = await upsertConversation(account.id, {
      visitorKey: `web:${visitorId}`,
      name: visitorName,
      channel: 'web',
      lastMessage: text,
    })
    await saveMessage(account.id, conversation.id, 'in', text, { channel: 'web', visitorKey: `web:${visitorId}` })
    const language = (await rememberLanguage(account.id, conversation.id, text)) || conversation.language || req.body.lang || null
    const reply = await replyFromKnowledge(account.id, text, { language })
    await saveMessage(account.id, conversation.id, 'out', reply, { handled_as: 'ai', channel: 'web', visitorKey: `web:${visitorId}` })
    await dbUpdate('conversations', { id: conversation.id, account_id: account.id }, { last_message: reply, last_at: now() })
    await touchWidget(account.id, visitorId)
    res.json({
      visitorId,
      conversationId: conversation.id,
      reply,
      messages: [
        { from: 'customer', text, at: now() },
        { from: 'ai', text: reply, at: now() },
      ],
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const defaultSettings = {
  ai_config: {
    enabled: true,
    status: 'online',
    knowledgeMode: 'shared',
    promptMode: 'shared',
    defaultLanguage: 'en',
    supportedLanguages: [...i18n.ALL_CODES],
    responseStyle: 'Balanced',
    personality: 'Professional',
    tone: 'Professional',
    responseLength: 'Balanced',
    humanHandoff: true,
    handoffNumber: '',
    businessHoursBehaviour: 'Answer questions, capture leads, no direct booking',
    afterHoursBehaviour: 'Answer questions, capture leads, no direct booking',
    lastTrainedAt: null,
  },
  prompts: {
    system: '',
    businessRules: '',
    restrictions: '',
    escalation: '',
    booking: '',
    leadQualification: '',
  },
  whatsapp: {
    enabled: true,
    displayName: '',
    businessNumber: '',
    greeting: '',
    instructions: '',
    knowledgeSource: 'shared',
    promptSource: 'shared',
    language: 'en',
    tone: 'Professional',
    responseLength: 'Short',
    humanHandoff: true,
    respectBusinessHours: true,
    afterHoursMessage: '',
    automation: {
      autoReply: true,
      leadCapture: true,
      bookingEnquiries: true,
      faqHandling: true,
      humanEscalation: true,
    },
  },
  web: { enabled: true },
  voice: require('./voiceTwilio').defaultVoice,
  notifications: registerMailAuth.defaultNotifications(),
  team: [],
  catalog: registerMailAuth.defaultCatalog(),
}

function mapBusiness(account) {
  return {
    id: account.id,
    name: account.business_name || account.name || '',
    type: account.industry || '',
    description: account.description || '',
    website: account.website || '',
    email: account.email || '',
    phone: account.phone || '',
    address: account.address || '',
    country: account.country || '',
    timezone: account.timezone || '',
    logo: null,
    currency: account.currency || 'USD',
    createdAt: account.created_at,
  }
}

function parseHours(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

/** The AI always answers English, French, Arabic, Somali, Amharic and Afar; extra languages stay as saved. */
function withCoreLanguages(aiConfig) {
  const saved = Array.isArray(aiConfig.supportedLanguages) ? aiConfig.supportedLanguages : []
  return { ...aiConfig, supportedLanguages: [...new Set([...i18n.ALL_CODES, ...saved])] }
}

async function getSettings(accountId) {
  const rows = await dbSelect('account_settings', { account_id: accountId })
  const row = rows[0] || {}
  return {
    ai_config: withCoreLanguages({ ...defaultSettings.ai_config, ...(row.ai_config || {}) }),
    prompts: { ...defaultSettings.prompts, ...(row.prompts || {}) },
    prompt_versions: Array.isArray(row.prompt_versions) ? row.prompt_versions : [],
    whatsapp: { ...defaultSettings.whatsapp, ...(row.whatsapp || {}) },
    web: { ...defaultSettings.web, ...(row.web || {}) },
    voice: { ...defaultSettings.voice, ...(row.voice || {}) },
    notifications: { ...defaultSettings.notifications, ...(row.notifications || {}) },
    team: Array.isArray(row.team) ? row.team : [],
    catalog: { ...defaultSettings.catalog, ...(row.catalog || {}) },
  }
}

async function saveSettings(accountId, patch) {
  const current = await getSettings(accountId)
  const next = {
    account_id: accountId,
    ai_config: withCoreLanguages({ ...current.ai_config, ...(patch.ai_config || {}) }),
    prompts: { ...current.prompts, ...(patch.prompts || {}) },
    prompt_versions: patch.prompt_versions || current.prompt_versions,
    whatsapp: { ...current.whatsapp, ...(patch.whatsapp || {}) },
    web: { ...current.web, ...(patch.web || {}) },
    voice: { ...current.voice, ...(patch.voice || {}) },
    notifications: patch.notifications || current.notifications,
    team: patch.team || current.team,
    catalog: patch.catalog || current.catalog,
    updated_at: now(),
  }
  const existing = await dbSelect('account_settings', { account_id: accountId })
  try {
    if (existing[0]) await dbUpdate('account_settings', { account_id: accountId }, next)
    else await dbInsert('account_settings', next)
  } catch (error) {
    const lean = { ...next }
    delete lean.notifications
    delete lean.team
    delete lean.catalog
    delete lean.voice
    if (existing[0]) await dbUpdate('account_settings', { account_id: accountId }, lean)
    else await dbInsert('account_settings', lean)
    console.warn('Settings extras skipped:', error.message)
  }
  return getSettings(accountId)
}

app.get('/api/me', auth('account'), async (req, res) => {
  try {
    res.json({
      user: {
        id: req.account.id,
        name: req.account.name,
        email: req.account.email,
        role: req.account.role,
        phone: req.account.phone || '',
        twoFactor: Boolean(req.account.two_factor),
      },
      business: mapBusiness(req.account),
      hours: parseHours(req.account.hours),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/me', auth('account'), async (req, res) => {
  try {
    const body = req.body || {}
    const patch = {}
    if (body.name !== undefined) patch.business_name = body.name
    if (body.type !== undefined) patch.industry = body.type
    if (body.description !== undefined) patch.description = body.description
    if (body.website !== undefined) patch.website = body.website
    if (body.phone !== undefined) patch.phone = body.phone
    if (body.address !== undefined) patch.address = body.address
    if (body.country !== undefined) patch.country = body.country
    if (body.timezone !== undefined) patch.timezone = body.timezone
    if (body.currency !== undefined) patch.currency = body.currency
    if (body.hours !== undefined) patch.hours = body.hours
    if (Object.keys(patch).length) await dbUpdate('accounts', { id: req.actor.id }, patch)
    const rows = await dbSelect('accounts', { id: req.actor.id })
    res.json(mapBusiness(rows[0] || { ...req.account, ...patch }))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/me/hours', auth('account'), async (req, res) => {
  try {
    res.json(parseHours(req.account.hours))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/me/hours', auth('account'), async (req, res) => {
  try {
    const hours = Array.isArray(req.body) ? req.body : req.body?.hours
    if (!Array.isArray(hours)) return res.status(400).json({ error: 'Hours must be a list.' })
    await dbUpdate('accounts', { id: req.actor.id }, { hours })
    res.json(hours)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/me/profile', auth('account'), async (req, res) => {
  try {
    const patch = {}
    if (req.body.name !== undefined) patch.name = cleanText(req.body.name, 80)
    if (req.body.phone !== undefined) patch.phone = cleanText(req.body.phone, 40)
    if (req.body.email !== undefined) {
      const email = normalizeEmail(req.body.email)
      if (!isValidEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
      const existing = await findAccountByEmail(email)
      if (existing && existing.id !== req.actor.id) return res.status(409).json({ error: 'That email is already in use.' })
      patch.email = email
    }
    if (Object.keys(patch).length) await dbUpdate('accounts', { id: req.actor.id }, patch)
    const rows = await dbSelect('accounts', { id: req.actor.id })
    const account = rows[0] || { ...req.account, ...patch }
    res.json({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      phone: account.phone || '',
      twoFactor: Boolean(account.two_factor),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/settings', auth('account'), async (req, res) => {
  try {
    res.json(await getSettings(req.actor.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/settings', auth('account'), async (req, res) => {
  try {
    res.json(await saveSettings(req.actor.id, req.body || {}))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/settings/:channel', auth('account'), async (req, res) => {
  try {
    const settings = await getSettings(req.actor.id)
    if (req.params.channel === 'whatsapp') return res.json(settings.whatsapp)
    if (req.params.channel === 'web') return res.json(settings.web)
    if (req.params.channel === 'voice') {
      const { credentials, ...safeVoice } = settings.voice || {}
      return res.json(safeVoice)
    }
    return res.status(404).json({ error: 'Unknown channel.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/settings/:channel', auth('account'), async (req, res) => {
  try {
    if (!['whatsapp', 'web', 'voice'].includes(req.params.channel)) {
      return res.status(404).json({ error: 'Unknown channel.' })
    }
    const body = { ...(req.body || {}) }
    if (req.params.channel === 'voice') delete body.credentials
    const saved = await saveSettings(req.actor.id, { [req.params.channel]: body })
    if (req.params.channel === 'voice') {
      const { credentials, ...safeVoice } = saved.voice || {}
      return res.json(safeVoice)
    }
    res.json(saved[req.params.channel])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/ai/test', auth('account'), async (req, res) => {
  try {
    const text = String(req.body.text || '').trim()
    if (!text) return res.status(400).json({ error: 'Message is required.' })
    const reply = await replyFromKnowledge(req.actor.id, text)
    res.json({ id: id('msg'), from: 'ai', at: now(), text: reply })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/widget.js', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store')
  res.type('application/javascript')
  res.sendFile(path.join(__dirname, 'public', 'widget.js'))
})

app.get('/widget/:token', async (req, res) => {
  const account = await findAccountByWidgetToken(req.params.token)
  if (!account || account.status === 'Blocked' || account.status === 'Suspended') {
    return res.status(404).type('html').send('<!doctype html><title>Chat unavailable</title><p>This chat widget is not available.</p>')
  }
  res.setHeader('Cache-Control', 'no-store')
  res.sendFile(path.join(__dirname, 'public', 'widget-frame.html'))
})

app.get('/api/kpis', auth('account'), async (req, res) => {
  try {
    res.json(await buildKpis(req.actor.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/admin/accounts', auth('admin'), async (_req, res) => {
  try {
    res.json(await adminAccountRows())
  } catch (error) {
    console.error('admin accounts', error.message)
    res.json([])
  }
})

app.post('/api/admin/accounts', auth('admin'), async (req, res) => {
  try {
    const { name, email, password, businessName, phone, role, plan } = req.body || {}
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required.' })
    if (await findAccountByEmail(email)) return res.status(409).json({ error: 'That email is already in use.' })
    await dbInsert('accounts', {
      id: id('acc'),
      name,
      email,
      password_hash: bcrypt.hashSync(password, 10),
      role: role || 'Owner',
      status: 'Active',
      business_name: businessName || name,
      phone: phone || null,
      plan: plan || 'Starter',
      widget_token: newWidgetToken(),
      created_at: now(),
    })
    res.json(await adminAccountRows())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/admin/accounts/:id', auth('admin'), async (req, res) => {
  try {
    const patch = { ...req.body }
    delete patch.password
    delete patch.password_hash
    if (req.body.password) patch.password_hash = bcrypt.hashSync(req.body.password, 10)
    if (req.body.businessName) patch.business_name = req.body.businessName
    await dbUpdate('accounts', { id: req.params.id }, patch)
    const rows = await adminAccountRows()
    res.json(rows.find((row) => row.id === req.params.id) || null)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/admin/accounts/:id/status', auth('admin'), async (req, res) => {
  try {
    const { status, reason } = req.body || {}
    await dbUpdate('accounts', { id: req.params.id }, { status, blocked_reason: status === 'Active' ? null : reason || null })
    const rows = await adminAccountRows()
    res.json(rows.find((row) => row.id === req.params.id) || null)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/admin/accounts/:id', auth('admin'), async (req, res) => {
  try {
    const runtime = waRuntime.get(req.params.id)
    if (runtime?.sock) {
      try {
        runtime.sock.end(undefined)
      } catch {
        /* ignore */
      }
    }
    waRuntime.delete(req.params.id)
    fs.rmSync(sessionDir(req.params.id), { recursive: true, force: true })
    await dbDelete('messages', { account_id: req.params.id })
    await dbDelete('conversations', { account_id: req.params.id })
    await dbDelete('knowledge_items', { account_id: req.params.id })
    await dbDelete('whatsapp_connections', { account_id: req.params.id })
    await dbDelete('widget_connections', { account_id: req.params.id })
    await dbDelete('account_settings', { account_id: req.params.id })
    await dbDelete('accounts', { id: req.params.id })
    res.json(await adminAccountRows())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/admin/accounts/:id/kpis', auth('admin'), async (req, res) => {
  try {
    res.json(await buildKpis(req.params.id))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/admin/conversations', auth('admin'), async (_req, res) => {
  try {
    const accounts = await dbSelect('accounts')
    const all = []
    for (const account of accounts || []) {
      try {
        const rows = await conversationsForAccount(account.id)
        for (const row of rows) {
          if (row.channel !== 'whatsapp' && row.channel !== 'web' && row.channel !== 'voice') continue
          all.push({
            id: row.id,
            businessId: account.id,
            business: account.business_name || account.name,
            customer: row.customer,
            channel: row.channel,
            handledBy: row.handledBy === 'human' ? 'Human' : 'AI',
            lastMessage: row.preview,
            status: row.status,
            outcome: row.lead || '—',
            at: row.lastMessageAt,
            messages: row.messages,
          })
        }
      } catch (error) {
        console.warn('admin conversations skipped', account.id, error.message)
      }
    }
    all.sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')))
    res.json(all)
  } catch (error) {
    console.error('admin conversations', error.message)
    res.json([])
  }
})

app.get('/api/admin/voice', auth('admin'), async (_req, res) => {
  try {
    const rows = await adminAccountRows()
    const calls = await dbSelect('voice_calls').catch(() => [])
    res.json(
      rows.map((row) => {
        const accountCalls = (calls || []).filter((item) => item.account_id === row.id)
        return {
          id: row.id,
          account: row.business || row.name,
          identifier: row.phone || '—',
          connected: accountCalls.some((item) => item.status === 'in-progress' || item.status === 'completed'),
          status: accountCalls[0]?.status || 'idle',
          messages: accountCalls.length,
        }
      }),
    )
  } catch (error) {
    console.error('admin voice', error.message)
    res.json([])
  }
})

app.get('/api/admin/whatsapp', auth('admin'), async (_req, res) => {
  try {
    const rows = await adminAccountRows()
    res.json(
      rows.map((row) => {
        const runtime = waRuntime.get(row.id)
        const status = runtime?.last?.status || row.whatsappStatus || 'disconnected'
        return {
          id: row.id,
          account: row.business || row.name,
          identifier: runtime?.last?.phone || row.whatsappPhone || '—',
          connected: status === 'connected',
          status,
          messages: row.conversations || 0,
        }
      }),
    )
  } catch (error) {
    console.error('admin whatsapp', error.message)
    res.json([])
  }
})

function mapKnowledge(item) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    body: item.body,
    source: item.source,
    status: item.status,
    fileName: item.file_name,
    updatedAt: item.updated_at || item.created_at,
    createdAt: item.created_at,
  }
}

function conversationChannel(row) {
  return row.channel || (String(row.wa_from || '').startsWith('web:') ? 'web' : 'whatsapp')
}

async function buildKpis(accountId) {
  const messages = await dbSelect('messages', { account_id: accountId })
  const conversations = await dbSelect('conversations', { account_id: accountId })
  const byChannel = (channel) => conversations.filter((row) => conversationChannel(row) === channel)
  const webConversations = byChannel('web')
  const whatsappConversations = byChannel('whatsapp')
  const conversationIds = (rows) => new Set(rows.map((row) => row.id))
  const webIds = conversationIds(webConversations)
  const whatsappIds = conversationIds(whatsappConversations)
  const days = []
  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - i)
    const key = date.toISOString().slice(0, 10)
    const inbound = messages.filter((msg) => msg.direction === 'in' && String(msg.created_at).startsWith(key)).length
    const outbound = messages.filter((msg) => msg.direction === 'out' && String(msg.created_at).startsWith(key)).length
    const voice = messages.filter((msg) => msg.type === 'voice' && String(msg.created_at).startsWith(key)).length
    const web = messages.filter((msg) => webIds.has(msg.conversation_id) && String(msg.created_at).startsWith(key)).length
    const whatsapp = messages.filter((msg) => whatsappIds.has(msg.conversation_id) && String(msg.created_at).startsWith(key)).length
    days.push({
      date: key,
      inbound,
      outbound,
      voice,
      web,
      whatsapp,
      total: inbound + outbound,
      calls: voice,
      messages: inbound + outbound,
      leads: inbound,
      conversations: inbound,
    })
  }
  return {
    summary: {
      conversations: conversations.length,
      messages: messages.length,
      inbound: messages.filter((msg) => msg.direction === 'in').length,
      outbound: messages.filter((msg) => msg.direction === 'out').length,
      voice: messages.filter((msg) => msg.type === 'voice').length,
      web: webConversations.length,
      whatsapp: whatsappConversations.length,
      leads: messages.filter((msg) => msg.direction === 'in').length,
      bookings: 0,
      missedCalls: 0,
      aiResolution: 100,
      handoff: 0,
      avgDuration: 0,
      activeChannels: [webConversations.length, whatsappConversations.length, messages.some((msg) => msg.type === 'voice')].filter(Boolean).length,
    },
    daily: days,
    channels: [
      { name: 'Website', value: webConversations.length, color: '#60a5fa' },
      { name: 'WhatsApp', value: whatsappConversations.length, color: '#FF7A00' },
      { name: 'Voice', value: messages.filter((msg) => msg.type === 'voice').length, color: '#0066FF' },
    ],
    handling: [
      { name: 'Handled by AI', value: conversations.filter((row) => (row.handled_by || 'ai') === 'ai').length || 1, color: '#0066FF' },
      { name: 'Human handoff', value: conversations.filter((row) => row.handled_by === 'human').length, color: '#8494ac' },
    ],
    channelPerformance: [
      { channel: 'Website', conversations: webConversations.length, aiResolved: 100, leads: webConversations.length, avgResponse: 'instant' },
      { channel: 'WhatsApp', conversations: whatsappConversations.length, aiResolved: 100, leads: whatsappConversations.length, avgResponse: 'instant' },
    ],
  }
}

const voiceApi = registerVoice(app, {
  auth,
  dbSelect,
  dbInsert,
  dbUpdate,
  getSettings,
  saveSettings,
  replyFromKnowledge,
  speakReply,
  transcribeAudio,
  localizePhrase,
  rememberLanguage,
  upsertConversation,
  saveMessage,
  publicBase,
  now,
  id,
  knowledgeContext,
  receptionistPrompt,
  aiLanguageSettings,
})

registerMailAuth({
  app,
  auth,
  sign,
  dbSelect,
  dbInsert,
  dbUpdate,
  dbDelete,
  findAccountByEmail,
  id,
  now,
  getSettings,
  saveSettings,
})

app.use((error, _req, res, _next) => {
  if (error?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'This file is larger than 20 MB. Upload a smaller file.' })
  if (error?.code === 'LIMIT_FILE_COUNT' || error?.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Upload up to 8 files at a time.' })
  }
  res.status(500).json({ error: error.message || 'Server error' })
})

if (!ON_VERCEL) {
  const http = require('http')
  const server = http.createServer(app)
  voiceApi.attachStream(server)
  server.listen(PORT, '0.0.0.0', async () => {
    console.log(`AI receptionist API on http://0.0.0.0:${PORT}`)
    console.log(`Supabase: ${supabase ? 'connected' : 'memory fallback — add credentials to server/.env'}`)
    console.log(`WhatsApp sessions: ${SESSION_ROOT}`)
    try {
      await ensureStarted()
      await restoreSessions()
      const provisioned = await syncPlatformTwilio()
      if (provisioned) console.log(`Twilio voice webhook: ${provisioned.voiceUrl} (${provisioned.phone})`)
      else console.log('Twilio: add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER to enable calls')
    } catch (error) {
      console.error('Startup restore failed', error.message)
    }
  })
}

module.exports = app
// Used by the offline multi-turn tests (no WhatsApp socket, memory database).
module.exports.internals = { handleWhatsAppTurn, dbInsert, dbSelect, dbUpdate, extractUploadText, parsePdfIsolated }
