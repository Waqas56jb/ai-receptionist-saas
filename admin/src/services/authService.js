import { request, clone } from './mockClient'
import { admins, currentAdmin, adminSessions, loginAttempts } from '../data/mock/admins'

/**
 * Mock admin auth. No password is validated and no token is stored — only a
 * session marker, so nothing sensitive lives in the browser.
 */
const SESSION_KEY = 'devmark.admin.session'

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    /* private browsing — the session simply does not persist */
  }
}

export const authService = {
  getSession: () => readSession(),

  login: ({ email } = {}) =>
    request(() => {
      // Signing in with another admin's address adopts that admin's role, which
      // makes the permission gating easy to demonstrate.
      const match = admins.find((a) => a.email.toLowerCase() === String(email || '').toLowerCase())
      const admin = clone(match && match.status === 'Active' ? match : currentAdmin)
      const session = { admin, signedInAt: new Date().toISOString() }
      writeSession(session)
      return session
    }),

  logout: () =>
    request(() => {
      writeSession(null)
      return { ok: true }
    }, { latency: [120, 240] }),

  requestPasswordReset: ({ email }) => request({ ok: true, email }),
  resetPassword: () => request({ ok: true }),
  changePassword: () => request({ ok: true }),

  getSessions: () => request(() => adminSessions),
  getLoginAttempts: () => request(() => loginAttempts),
}

export default authService
