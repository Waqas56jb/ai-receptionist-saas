import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/** Gate for /app/* — mock session only, no tokens are stored. */
export default function ProtectedRoute({ children, requireOnboarding = true }) {
  const { isAuthenticated, onboarded } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (requireOnboarding && !onboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
