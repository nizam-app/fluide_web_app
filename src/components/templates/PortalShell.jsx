import { useEffect, useState } from 'react'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { Navigate, useLocation, useOutlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { canAccessPath, getHomePath } from '../../lib/roles'
import { PortalHeader } from '../organisms/PortalHeader'
import { PortalSidebar } from '../organisms/PortalSidebar'

/**
 * Single authenticated shell: auth gate + sidebar + one keyed outlet.
 * Avoids nested layout outlets that can leave the previous page mounted.
 */
function KeyedPortalOutlet() {
  const location = useLocation()
  const page = useOutlet()
  return <Box key={`${location.pathname}-${location.key}`}>{page}</Box>
}

export function PortalShell() {
  const { user, isAuthenticated, hydrating } = useAuth()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname, location.key])

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

  if (!canAccessPath(user.role, location.pathname)) {
    return <Navigate to={getHomePath(user.role)} replace />
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="background">
      <PortalHeader onMenuToggle={() => setMobileNavOpen((o) => !o)} />
      <Flex flex="1" minH="0">
        <PortalSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <Box as="main" flex="1" minW="0" overflow="auto">
          <KeyedPortalOutlet />
        </Box>
      </Flex>
    </Box>
  )
}
