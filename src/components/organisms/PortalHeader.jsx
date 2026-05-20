import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getHomePath, getRoleLabel } from '../../lib/roles'
import { FluideLogo } from '../atoms/FluideLogo'
import { MaterialIcon } from '../atoms/MaterialIcon'

export function PortalHeader({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box as="header" h="16" bg="surface" borderBottomWidth="1px" borderColor="outlineVariant" flexShrink={0}>
      <Flex h="full" px={{ base: 4, lg: 6 }} align="center" justify="space-between" maxW="100%">
        <HStack gap="3">
          <Button
            display={{ base: 'inline-flex', md: 'none' }}
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            aria-label="Open menu"
          >
            <MaterialIcon name="menu" size={24} />
          </Button>
          <FluideLogo to={getHomePath(user?.role)} />
        </HStack>
        <HStack gap="4">
          <Box display={{ base: 'none', sm: 'block' }} textAlign="right">
            <Text textStyle="labelMd" color="onSurface">
              {user?.name}
            </Text>
            <Text textStyle="labelSm" color="primary" textTransform="uppercase">
              {getRoleLabel(user?.role)}
            </Text>
          </Box>
          <Button variant="ghost" size="sm" onClick={handleLogout} color="onSurfaceVariant" _hover={{ color: 'error' }}>
            <MaterialIcon name="logout" size={20} />
            <Text display={{ base: 'none', md: 'inline' }} ml="1">
              Logout
            </Text>
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}
