import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import authService from '../services/authService'
import { roleById } from '../config/permissions'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession())

  const login = useCallback(async (credentials) => {
    const next = await authService.login(credentials)
    setSession(next)
    return next
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setSession(null)
  }, [])

  const admin = session?.admin || null
  const permissions = useMemo(() => new Set(admin?.permissions || []), [admin])

  /** Gate for UI affordances. The backend will enforce the same rules later. */
  const can = useCallback((permission) => (permission ? permissions.has(permission) : true), [permissions])

  const value = useMemo(
    () => ({
      session,
      admin,
      role: admin ? roleById(admin.roleId) : null,
      isAuthenticated: Boolean(session),
      permissions,
      can,
      login,
      logout,
      setAdmin: (patch) => setSession((prev) => (prev ? { ...prev, admin: { ...prev.admin, ...patch } } : prev)),
    }),
    [session, admin, permissions, can, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export default AuthContext
