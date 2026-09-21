import { store } from './store'
import { api } from './api'

function hydrateStore(session) {
  if (!session) return
  if (session.user) {
    store.user = {
      ...store.user,
      id: session.user.id || store.user.id,
      name: session.user.name || '',
      email: session.user.email || '',
      role: session.user.role || store.user.role,
      phone: session.user.phone || store.user.phone,
      twoFactor: Boolean(session.user.twoFactor),
    }
  }
  if (session.business) {
    store.business = {
      ...store.business,
      id: session.business.id || store.business.id,
      name: session.business.name || '',
      email: session.user?.email || store.business.email,
    }
  }
}

const SESSION_KEY = 'devmark.portal.session'
const ONBOARDING_KEY = 'devmark.portal.onboarded'

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
    /* private browsing */
  }
}

function persist(session) {
  writeSession(session)
  hydrateStore(session)
  return session
}

export const authService = {
  getSession: () => readSession(),

  isOnboarded: () => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) !== 'false'
    } catch {
      return true
    }
  },

  setOnboarded: (value = true) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, String(value))
    } catch {
      /* ignore */
    }
  },

  login: async ({ email, password }) => {
    const session = await api('/auth/login', { method: 'POST', body: { email, password } })
    if (session.requiresOtp) return session
    return persist(session)
  },

  verifyLoginOtp: async ({ challengeId, code }) => {
    const session = await api('/auth/login/otp', { method: 'POST', body: { challengeId, code } })
    return persist(session)
  },

  signup: async (payload) => {
    const session = await api('/auth/signup', { method: 'POST', body: payload })
    persist(session)
    authService.setOnboarded(false)
    return session
  },

  logout: async () => {
    writeSession(null)
    return { ok: true }
  },

  requestPasswordReset: ({ email }) => api('/auth/forgot-password', { method: 'POST', body: { email } }),

  resetPassword: ({ password, token }) => api('/auth/reset-password', { method: 'POST', body: { password, token } }),

  changePassword: ({ current, next }) => api('/auth/change-password', { method: 'POST', body: { current, next } }),

  getSessions: () => api('/auth/sessions'),

  revokeSession: (id) => api(`/auth/sessions/${id}`, { method: 'DELETE' }),

  revokeAllSessions: () => api('/auth/sessions/revoke-others', { method: 'POST' }),

  getLoginHistory: () => api('/auth/login-history'),

  startTwoFactor: () => api('/auth/2fa/start', { method: 'POST' }),

  confirmTwoFactor: ({ challengeId, code }) => api('/auth/2fa/confirm', { method: 'POST', body: { challengeId, code } }),

  disableTwoFactor: ({ password }) => api('/auth/2fa/disable', { method: 'POST', body: { password } }),

  setTwoFactor: async (enabled, extra = {}) => {
    if (enabled) return authService.startTwoFactor()
    return authService.disableTwoFactor(extra)
  },
}

hydrateStore(readSession())

export default authService
