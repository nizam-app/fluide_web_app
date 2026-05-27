import { Flex, Spinner, Text } from '@chakra-ui/react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { canAccessPath, getHomePath } from '../../lib/roles'

/**
 * @param {{ children: import('react').ReactNode, role?: string, roles?: string[] }} props
 */
export function ProtectedRoute({ children, role, roles }) {
  const { user, isAuthenticated, hydrating } = useAuth()
  const location = useLocation()

  if (hydrating) {
    return (
      <Flex minH="100vh" align="center" justify="center" gap="3">
        <Spinner color="primary" />
        <Text color="onSurfaceVariant" textStyle="bodySm">
          Restoring your session…
        </Text>
      </Flex>
    )
  }

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
