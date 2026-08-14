import { request, clone } from './mockClient'
import { store } from './store'

/**
 * Mock auth. No password is ever validated here and no token is stored —
 * only a session flag, so nothing sensitive lives in the browser.
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

  login: ({ email }) =>
    request(() => {
      const session = {
        user: { ...clone(store.user), email: email || store.user.email },
        business: { id: store.business.id, name: store.business.name },
        signedInAt: new Date().toISOString(),
      }
      writeSession(session)
      return session
    }),

  signup: (payload) =>
    request(() => {
      if (payload.businessName) store.business.name = payload.businessName
      if (payload.businessType) store.business.type = payload.businessType
      if (payload.country) store.business.country = payload.country
      if (payload.phone) store.business.phone = payload.phone
      if (payload.website) store.business.website = payload.website
      if (payload.fullName) store.user.name = payload.fullName
      if (payload.email) store.user.email = payload.email

      const session = {
        user: clone(store.user),
        business: { id: store.business.id, name: store.business.name },
        signedInAt: new Date().toISOString(),
      }
      writeSession(session)
      authService.setOnboarded(false)
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

export default authService
