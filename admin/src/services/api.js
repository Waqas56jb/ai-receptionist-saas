const API_BASE = import.meta.env.VITE_API_URL || '/api'

function readToken() {
  try {
    const admin = JSON.parse(localStorage.getItem('devmark.admin.session') || 'null')
    return admin?.token || null
  } catch {
    return null
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = readToken()
  if (token) headers.Authorization = `Bearer ${token}`
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    const error = new Error('API_OFFLINE')
    error.code = 'API_OFFLINE'
    throw error
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || 'Request failed')
    error.status = res.status
    throw error
  }
  return data
}

export async function live(path, options, fallback) {
  try {
    return await api(path, options)
  } catch (error) {
    if (error.code === 'API_OFFLINE' && fallback) return fallback()
    throw error
  }
}
