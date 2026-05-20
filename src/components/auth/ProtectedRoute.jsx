import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { canAccessPath, getHomePath } from '../../lib/roles'

/**
 * @param {{ children: import('react').ReactNode, role?: string, roles?: string[] }} props
 */
export function ProtectedRoute({ children, role, roles }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const allowed = roles ?? (role ? [role] : null)
  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to={getHomePath(user.role)} replace />
  }

  if (!canAccessPath(user.role, location.pathname)) {
    return <Navigate to={getHomePath(user.role)} replace />
  }

  return children
}
