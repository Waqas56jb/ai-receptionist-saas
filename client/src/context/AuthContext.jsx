import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession())
  const [onboarded, setOnboardedState] = useState(() => authService.isOnboarded())

  const login = useCallback(async (credentials) => {
    const next = await authService.login(credentials)
    if (next.requiresOtp) return next
    authService.setOnboarded(true)
    setSession(next)
    setOnboardedState(true)
    return next
  }, [])

  const verifyLoginOtp = useCallback(async (payload) => {
    const next = await authService.verifyLoginOtp(payload)
    authService.setOnboarded(true)
    setSession(next)
    setOnboardedState(true)
    return next
  }, [])

  const signup = useCallback(async (payload) => {
    const next = await authService.signup(payload)
    setSession(next)
    setOnboardedState(false)
    return next
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setSession(null)
  }, [])

  const completeOnboarding = useCallback(() => {
    authService.setOnboarded(true)
    setOnboardedState(true)
  }, [])

  const updateUser = useCallback((patch) => {
    setSession((prev) => (prev ? { ...prev, user: { ...prev.user, ...patch } } : prev))
  }, [])

  const updateBusiness = useCallback((patch) => {
    setSession((prev) => (prev ? { ...prev, business: { ...prev.business, ...patch } } : prev))
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      business: session?.business || null,
      isAuthenticated: Boolean(session),
      onboarded,
      login,
      verifyLoginOtp,
      signup,
      logout,
      completeOnboarding,
      updateUser,
      updateBusiness,
    }),
    [session, onboarded, login, verifyLoginOtp, signup, logout, completeOnboarding, updateUser, updateBusiness],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export default AuthContext
