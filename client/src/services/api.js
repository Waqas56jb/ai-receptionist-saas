import { API_BASE } from '../config/api'

export { API_BASE }

function readToken() {
  try {
    const portal = JSON.parse(localStorage.getItem('devmark.portal.session') || 'null')
    if (portal?.token) return portal.token
    const admin = JSON.parse(localStorage.getItem('devmark.admin.session') || 'null')
    return admin?.token || null
  } catch {
    return null
  }
}

export function isApiOfflineError(error) {
  return error?.code === 'API_OFFLINE'
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {}
  const token = readToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const payload = body instanceof FormData ? body : form instanceof FormData ? form : body
  const isForm = payload instanceof FormData
  if (!isForm) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: isForm ? payload : body === undefined ? undefined : JSON.stringify(body),
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

export function whatsappEventSource() {
  const token = readToken()
  return new EventSource(`${API_BASE}/whatsapp/events?token=${encodeURIComponent(token || '')}`)
}
