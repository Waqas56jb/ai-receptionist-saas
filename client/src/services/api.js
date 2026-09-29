import { API_BASE } from '../config/api'

export { API_BASE }

export const OFFLINE_MESSAGE = 'Cannot reach the server. Please check your connection and try again.'

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
  // A failed fetch means the request never got a response (server restarting, mobile data
  // dropping). GET is safe to repeat, so it retries before giving up.
  const attempts = method === 'GET' ? 3 : 1
  for (let attempt = 1; ; attempt += 1) {
    try {
      res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: isForm ? payload : body === undefined ? undefined : JSON.stringify(body),
      })
      break
    } catch {
      if (attempt >= attempts) {
        const error = new Error(OFFLINE_MESSAGE)
        error.code = 'API_OFFLINE'
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt))
    }
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
