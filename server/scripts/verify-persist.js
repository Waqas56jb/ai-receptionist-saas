const BASE = process.env.API_URL || 'http://localhost:4000'

async function req(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${data.error || ''}`)
  return data
}

async function main() {
  const health = await req('/api/health')
  if (!health.supabase) throw new Error('API is not connected to Supabase')

  const session = await req('/api/auth/login', {
    method: 'POST',
    body: { email: 'client@gmail.com', password: 'client@123!' },
  })
  const token = session.token

  const business = await req('/api/me', {
    method: 'PATCH',
    token,
    body: { name: 'Client Business', phone: '+253 77000000', country: 'Djibouti' },
  })
  if (business.phone !== '+253 77000000') throw new Error('Business profile did not persist')

  const whatsapp = await req('/api/settings/whatsapp', {
    method: 'PUT',
    token,
    body: { displayName: 'Client Business', greeting: 'Hello, how can I help?' },
  })
  if (whatsapp.displayName !== 'Client Business') throw new Error('WhatsApp settings did not persist')

  const knowledge = await req('/api/knowledge', {
    method: 'POST',
    token,
    body: { title: 'Opening hours', body: 'We are open every day from 09:00 to 18:00.', category: 'Business Info' },
  })
  if (!knowledge.some((row) => row.title === 'Opening hours')) throw new Error('Knowledge did not persist')

  const widget = await req('/api/widget', { token })
  const chat = await fetch(`${BASE}/api/widget/${widget.token}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What are your opening hours?', visitorId: 'verify-visitor', visitorName: 'Test visitor' }),
  })
  const chatData = await chat.json()
  if (!chat.ok) throw new Error(chatData.error || 'Widget chat failed')

  const inbox = await req('/api/conversations', { token })
  const web = inbox.find((row) => row.channel === 'web' && String(row.customer).includes('Test visitor'))
  if (!web) throw new Error('Website chat did not appear in conversations')
  if (!(web.messages || []).some((row) => String(row.text || '').includes('09:00'))) {
    throw new Error('Website reply was not saved from knowledge')
  }

  const settings = await req('/api/settings', { token })
  if (settings.whatsapp.greeting !== 'Hello, how can I help?') throw new Error('Settings reload missed WhatsApp greeting')

  console.log('WhatsApp settings, knowledge, and website chats persist in Supabase')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
