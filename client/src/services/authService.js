import { request, clone } from './mockClient'
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

/**
 * Session is issued by the live API. Local storage keeps the JWT so the
 * portal can call authenticated endpoints.
 */
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
    /* private browsing — the session simply does not persist */
  }
}

export const authService = {
  getSession: () => readSession(),

  // Existing businesses are onboarded; only a fresh signup opts out.
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
    try {
      const session = await api('/auth/login', { method: 'POST', body: { email, password } })
      writeSession(session)
      hydrateStore(session)
      return session
    } catch (error) {
      throw error
    }
  },

  signup: async (payload) => {
    try {
      const session = await api('/auth/signup', { method: 'POST', body: payload })
      writeSession(session)
      hydrateStore(session)
      authService.setOnboarded(false)
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

  getSessions: () => request(() => store.sessions),

  revokeSession: (id) =>
    request(() => {
      store.sessions = store.sessions.filter((s) => s.id !== id)
      return store.sessions
    }),

  revokeAllSessions: () =>
    request(() => {
      store.sessions = store.sessions.filter((s) => s.current)
      return store.sessions
    }),

  getLoginHistory: () => request(() => store.loginHistory),

  setTwoFactor: (enabled) =>
    request(() => {
      store.user.twoFactor = enabled
      return clone(store.user)
    }),
}

hydrateStore(readSession())

export default authService
