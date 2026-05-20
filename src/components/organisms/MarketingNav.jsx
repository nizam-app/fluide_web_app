import { useState } from 'react'
import { Box, Button, Flex, HStack, Stack } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getHomePath } from '../../lib/roles'
import { FluideLogo } from '../atoms/FluideLogo'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { stitchBlackButton } from '../../theme/fluide-theme'

const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/contact' },
]

export function MarketingNav() {
  const { pathname } = useLocation()
  const { isAuthenticated, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Box as="header" bg="surface" borderBottomWidth="1px" borderColor="outlineVariant" position="sticky" top="0" zIndex={50}>
      <Flex maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} h="16" align="center" justify="space-between">
        <FluideLogo to="/" />
        <HStack as="nav" gap="8" display={{ base: 'none', md: 'flex' }}>
          {publicLinks.map((link) => {
            const active = pathname === link.href
            return (
              <RouterLink key={link.href} to={link.href}>
                <Box
                  textStyle="labelMd"
                  color={active ? 'primary' : 'onSurface'}
                  fontWeight="600"
                  borderBottomWidth={active ? '3px' : 0}
                  borderColor="primary"
                  pb={active ? '1' : 0}
                  _hover={{ color: 'primary' }}
                >
                  {link.label}
                </Box>
              </RouterLink>
            )
          })}
        </HStack>
        <HStack gap="4" display={{ base: 'none', md: 'flex' }}>
          {isAuthenticated ? (
            <RouterLink to={getHomePath(user.role)}>
              <Button {...stitchBlackButton} px="6" py="2">
                Go to Dashboard
              </Button>
            </RouterLink>
          ) : (
            <>
              <RouterLink to="/login">
                <Box textStyle="labelMd" fontWeight="600" _hover={{ color: 'primary' }}>
                  Login
                </Box>
              </RouterLink>
              <RouterLink to="/login">
                <Button {...stitchBlackButton} px="6" py="2">
                  Get Started
                </Button>
              </RouterLink>
            </>
          )}
        </HStack>
        <Button display={{ base: 'inline-flex', md: 'none' }} variant="ghost" size="sm" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          <MaterialIcon name="menu" />
        </Button>
      </Flex>
      {menuOpen && (
        <Box display={{ md: 'none' }} px="marginMobile" pb="4" borderTopWidth="1px" borderColor="outlineVariant">
          <Stack gap="3" pt="3">
            {publicLinks.map((link) => (
              <RouterLink key={link.href} to={link.href} onClick={() => setMenuOpen(false)}>
                <Box textStyle="labelMd" fontWeight="600">
                  {link.label}
                </Box>
              </RouterLink>
            ))}
            <RouterLink to="/login" onClick={() => setMenuOpen(false)}>
              <Box textStyle="labelMd" fontWeight="600">
                Login
              </Box>
            </RouterLink>
            <RouterLink to="/login" onClick={() => setMenuOpen(false)}>
              <Button {...stitchBlackButton} w="full">
                Get Started
              </Button>
            </RouterLink>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
