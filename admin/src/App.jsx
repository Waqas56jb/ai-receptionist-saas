import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-950" role="status" aria-live="polite">
      <span className="flex items-center gap-3 text-slate-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
        <span className="text-sm">Loading…</span>
      </span>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
