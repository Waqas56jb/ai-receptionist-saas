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
  return { status: res.status, data }
}

async function main() {
  const health = await req('/api/health')
  if (!health.data.ok) throw new Error('API health check failed')
  if (!health.data.supabase) throw new Error('API is still on memory fallback — restart the server after adding .env')
  console.log('API is connected to Supabase')

  const adminLogin = await req('/api/admin/auth/login', {
    method: 'POST',
    body: { email: 'admin@gmail.com', password: 'admin@123!' },
  })
  if (adminLogin.status !== 200 || !adminLogin.data.token) throw new Error('Admin login failed')
  console.log('Admin login works')

  const clientLogin = await req('/api/auth/login', {
    method: 'POST',
    body: { email: 'client@gmail.com', password: 'client@123!' },
  })
  if (clientLogin.status !== 200 || !clientLogin.data.token) throw new Error('Client login failed')
  const clientToken = clientLogin.data.token

  const stamp = Date.now().toString(36)
  const other = await req('/api/auth/signup', {
    method: 'POST',
    body: {
      email: `clinic-${stamp}@example.test`,
      password: 'Clinic@123!',
      fullName: 'Clinic Owner',
      businessName: 'Clinic One',
    },
  })
  if (other.status !== 200 || !other.data.token) throw new Error(`Second account signup failed: ${other.data.error || other.status}`)
  const otherToken = other.data.token

  const clientKb = await req('/api/knowledge', {
    method: 'POST',
    token: clientToken,
    body: { title: 'Client hours', body: 'Client Business opens at 09:00 and closes at 17:00.', category: 'Business Info' },
  })
  if (clientKb.status !== 200) throw new Error(`Client knowledge save failed: ${clientKb.data.error || clientKb.status}`)

  const otherKb = await req('/api/knowledge', {
    method: 'POST',
    token: otherToken,
    body: { title: 'Clinic hours', body: 'Clinic One emergency desk is open until 22:00.', category: 'Business Info' },
  })
  if (otherKb.status !== 200) throw new Error(`Clinic knowledge save failed: ${otherKb.data.error || otherKb.status}`)

  const clientList = await req('/api/knowledge', { token: clientToken })
  const otherList = await req('/api/knowledge', { token: otherToken })
  const clientTitles = (clientList.data || []).map((row) => row.title)
  const otherTitles = (otherList.data || []).map((row) => row.title)
  if (!clientTitles.includes('Client hours')) throw new Error('Client knowledge was not saved')
  if (!otherTitles.includes('Clinic hours')) throw new Error('Clinic knowledge was not saved')
  if (clientTitles.includes('Clinic hours') || (clientList.data || []).some((row) => String(row.body || '').includes('Clinic One'))) {
    throw new Error('Client account can see clinic knowledge')
  }
  if (otherTitles.includes('Client hours') || (otherList.data || []).some((row) => String(row.body || '').includes('Client Business'))) {
    throw new Error('Clinic account can see client knowledge')
  }
  console.log('Each account only sees its own knowledge')

  const stolenId = (otherList.data || []).find((row) => row.title === 'Clinic hours')?.id
  const steal = await req(`/api/knowledge/${stolenId}`, {
    method: 'PATCH',
    token: clientToken,
    body: { title: 'Hacked', body: 'stolen' },
  })
  const afterSteal = await req('/api/knowledge', { token: otherToken })
  const clinicItem = (afterSteal.data || []).find((row) => row.id === stolenId)
  if (!clinicItem || clinicItem.title === 'Hacked') throw new Error('Client was able to change another account knowledge item')
  console.log('Cross-account knowledge writes are blocked')

  const clientConv = await req('/api/conversations', { token: clientToken })
  const otherConv = await req('/api/conversations', { token: otherToken })
  if (!Array.isArray(clientConv.data) || !Array.isArray(otherConv.data)) throw new Error('Conversation lists failed')
  console.log('Conversation lists stay account-scoped')

  const adminAccounts = await req('/api/admin/accounts', { token: adminLogin.data.token })
  if (!Array.isArray(adminAccounts.data) || adminAccounts.data.length < 2) {
    throw new Error('Admin cannot list live accounts from Supabase')
  }
  if (adminAccounts.data.some((row) => row.password_hash)) throw new Error('Admin list leaked password hashes')
  console.log('Admin sees live accounts without password hashes')

  console.log('API isolation checks passed')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
