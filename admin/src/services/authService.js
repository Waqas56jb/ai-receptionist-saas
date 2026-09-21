import { request } from './mockClient'
import { api } from './api'
import { allPermissions } from '../config/permissions'

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

  login: async ({ email, password } = {}) => {
    try {
      const session = await api('/admin/auth/login', { method: 'POST', body: { email, password } })
      session.admin = {
        ...session.admin,
        roleId: session.admin?.roleId || 'super-admin',
        permissions: session.admin?.permissions?.length ? session.admin.permissions : allPermissions,
      }
      writeSession(session)
      return session
    } catch (error) {
      throw error
    }
  },

  logout: () =>
    request(() => {
      writeSession(null)
      return { ok: true }
    }, { latency: [120, 240] }),

  requestPasswordReset: ({ email }) => request({ ok: true, email }),
  resetPassword: () => request({ ok: true }),
  changePassword: () => request({ ok: true }),

  getSessions: () => request(() => []),
  getLoginAttempts: () => request(() => []),
}

export default authService
