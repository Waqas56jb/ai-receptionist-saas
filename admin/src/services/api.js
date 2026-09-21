import { API_BASE } from '../config/api'

export { API_BASE }

function readToken() {
  try {
    const admin = JSON.parse(localStorage.getItem('devmark.admin.session') || 'null')
    return admin?.token || admin?.admin?.token || null
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
    const recoverable = error.code === 'API_OFFLINE' || error.status >= 500 || error.status === 404
    if (recoverable && fallback) return fallback()
    throw error
  }
}
