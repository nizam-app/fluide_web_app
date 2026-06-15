import { useState } from 'react'
import { Box, Button, Flex, Grid, HStack, Stack } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getHomePath } from '../../lib/roles'
import { useLocale } from '../../context/LocaleContext'
import { FluideLogo } from '../atoms/FluideLogo'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { stitchBlackButton } from '../../theme/fluide-theme'

const publicLinks = {
  en: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  fr: [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
}

export function MarketingNav() {
  const { pathname } = useLocation()
  const { locale, setLocale } = useLocale()
  const { isAuthenticated, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const links = publicLinks[locale]

  return (
    <Box
      as="header"
      bg="surface"
      borderBottomWidth="1px"
      borderColor="outlineVariant"
      position="sticky"
      top="0"
      zIndex={50}
      w="full"
    >
      <Box maxW="contentMax" mx="auto" px={{ base: 4, md: 8 }} w="full">
        <Grid
          templateColumns={{ base: '1fr auto', md: 'auto 1fr auto' }}
          alignItems="center"
          minH="16"
          py="2"
          gap={{ md: 8 }}
          w="full"
        >
          <Box translate="no" lang="zxx" className="notranslate brand-lock">
            <FluideLogo to="/" />
          </Box>

          <HStack
            as="nav"
            gap="8"
            display={{ base: 'none', md: 'flex' }}
            justify="center"
            justifySelf="center"
          >
            {links.map((link) => {
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
                    whiteSpace="nowrap"
                    _hover={{ color: 'primary' }}
                  >
                    {link.label}
                  </Box>
                </RouterLink>
              )
            })}
          </HStack>

          <HStack gap="4" display={{ base: 'none', md: 'flex' }} justifySelf="end">
            <HStack
              gap="0"
              p="0.5"
              borderRadius="md"
              borderWidth="1px"
              borderColor="outlineVariant"
              bg="surfaceContainerLow"
              className="notranslate"
              translate="no"
            >
              {['fr', 'en'].map((code) => (
                <Button
                  key={code}
                  type="button"
                  size="xs"
                  minW="2.5rem"
                  borderRadius="sm"
                  variant={locale === code ? 'solid' : 'ghost'}
                  bg={locale === code ? 'surface' : 'transparent'}
                  color={locale === code ? 'onSurface' : 'onSurfaceVariant'}
                  fontWeight="700"
                  fontSize="xs"
                  onClick={() => setLocale(code)}
                  aria-pressed={locale === code}
                  aria-label={code === 'fr' ? 'Français' : 'English'}
                >
                  {code.toUpperCase()}
                </Button>
              ))}
            </HStack>
            {isAuthenticated ? (
              <RouterLink to={getHomePath(user.role)}>
                <Button {...stitchBlackButton} px="6" py="2" size="sm">
                  Dashboard
                </Button>
              </RouterLink>
            ) : (
              <>
                <RouterLink to="/login">
                  <Box textStyle="labelMd" fontWeight="600" _hover={{ color: 'primary' }} whiteSpace="nowrap">
                    Login
                  </Box>
                </RouterLink>
                <RouterLink to="/login">
                  <Button {...stitchBlackButton} px="6" py="2" size="sm" whiteSpace="nowrap">
                    Get Started
                  </Button>
                </RouterLink>
              </>
            )}
          </HStack>

          <Button
            display={{ base: 'inline-flex', md: 'none' }}
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            justifySelf="end"
          >
            <MaterialIcon name={menuOpen ? 'close' : 'menu'} decorative />
          </Button>
        </Grid>
      </Box>

      {menuOpen && (
        <Box display={{ md: 'none' }} px="4" pb="4" borderTopWidth="1px" borderColor="outlineVariant" w="full">
          <Stack gap="3" pt="3" maxW="contentMax" mx="auto">
            {links.map((link) => (
              <RouterLink key={link.href} to={link.href} onClick={() => setMenuOpen(false)}>
                <Box textStyle="labelMd" fontWeight="600" py="1">
                  {link.label}
                </Box>
              </RouterLink>
            ))}
            <HStack
              gap="0"
              p="0.5"
              borderRadius="md"
              borderWidth="1px"
              borderColor="outlineVariant"
              bg="surfaceContainerLow"
              w="fit-content"
              className="notranslate"
              translate="no"
            >
              {['fr', 'en'].map((code) => (
                <Button
                  key={code}
                  type="button"
                  size="xs"
                  minW="2.5rem"
                  borderRadius="sm"
                  variant={locale === code ? 'solid' : 'ghost'}
                  bg={locale === code ? 'surface' : 'transparent'}
                  color={locale === code ? 'onSurface' : 'onSurfaceVariant'}
                  fontWeight="700"
                  fontSize="xs"
                  onClick={() => {
                    setLocale(code)
                    setMenuOpen(false)
                  }}
                  aria-pressed={locale === code}
                >
                  {code.toUpperCase()}
                </Button>
              ))}
            </HStack>
            <RouterLink to="/login" onClick={() => setMenuOpen(false)}>
              <Box textStyle="labelMd" fontWeight="600" py="1">
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
