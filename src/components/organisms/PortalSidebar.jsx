import { Box, Button, Flex, Stack } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getNavItemsForRole } from '../../data/mockData'
import { ROLES } from '../../lib/roles'
import { MaterialIcon } from '../atoms/MaterialIcon'

function NavLink({ item, active, onNavigate }) {
  const isHash = item.href.includes('#')
  const to = isHash ? item.href.replace(/#.*$/, '') : item.href

  return (
    <RouterLink to={item.href} onClick={onNavigate}>
      <Flex
        align="center"
        gap="3"
        px="4"
        py="3"
        borderRadius="fluide"
        bg={active ? 'accentMint' : 'transparent'}
        color={active ? 'primary' : 'onSurfaceVariant'}
        textStyle="labelMd"
        fontWeight={active ? '700' : '600'}
        _hover={{ bg: active ? 'accentMint' : 'surfaceContainer' }}
      >
        <MaterialIcon name={item.icon} filled={active} size={22} />
        {item.label}
      </Flex>
    </RouterLink>
  )
}

function useNavActive(pathname, hash) {
  return (href) => {
    if (href.includes('#users')) return pathname === '/admin' && hash === '#users'
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/admin') return pathname === '/admin' && !hash
    if (href === '/create-trip') return pathname === '/create-trip'
    if (href === '/trips') return pathname === '/trips'
    if (href.startsWith('/admin/')) return pathname === href
    return pathname === href
  }
}

export function PortalSidebar({ mobileOpen, onClose }) {
  const { pathname, hash } = useLocation()
  const { user } = useAuth()
  const navItems = getNavItemsForRole(user?.role ?? ROLES.ORGANIZER)
  const isActive = useNavActive(pathname, hash)

  const content = (
    <Stack gap="1" flex="1">
      {navItems.map((item) => (
        <NavLink key={`${item.href}-${item.label}`} item={item} active={isActive(item.href)} onNavigate={onClose} />
      ))}
    </Stack>
  )

  return (
    <>
      <Box
        as="nav"
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        w="sidebar"
        bg="sidebar"
        borderRightWidth="1px"
        borderColor="outlineVariant"
        p="5"
        flexShrink={0}
      >
        {content}
      </Box>

      {mobileOpen && (
        <Box
          display={{ base: 'block', md: 'none' }}
          position="fixed"
          inset="0"
          zIndex={100}
          bg="blackAlpha.500"
          onClick={onClose}
        >
          <Box
            as="nav"
            w="72"
            maxW="85vw"
            h="full"
            bg="sidebar"
            borderRightWidth="1px"
            borderColor="outlineVariant"
            p="5"
            pt="20"
            onClick={(e) => e.stopPropagation()}
            display="flex"
            flexDirection="column"
          >
            {content}
          </Box>
        </Box>
      )}
    </>
  )
}
