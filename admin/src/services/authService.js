import { api } from './api'
import { allPermissions } from '../config/permissions'

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

  logout: async () => {
    writeSession(null)
    return { ok: true }
  },

  requestPasswordReset: ({ email }) => api('/auth/forgot-password', { method: 'POST', body: { email } }),

  resetPassword: ({ password, token }) => api('/auth/reset-password', { method: 'POST', body: { password, token } }),

  changePassword: ({ current, next }) => api('/auth/change-password', { method: 'POST', body: { current, next } }),

  getSessions: () => api('/auth/sessions'),

  getLoginAttempts: () => api('/auth/login-history'),
}

export default authService
