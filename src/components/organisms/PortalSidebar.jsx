import { Box, Button, Flex, Stack } from '@chakra-ui/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getNavItemsForRole } from '../../data/mockData'
import { ROLES } from '../../lib/roles'
import { MaterialIcon } from '../atoms/MaterialIcon'

function SidebarNavItem({ item, active, onNavigate }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleClick = (event) => {
    onNavigate?.()
    if (item.href.includes('#')) return
    if (pathname === item.href) {
      event.preventDefault()
      return
    }
    event.preventDefault()
    navigate(item.href)
  }

  return (
    <Link to={item.href} onClick={handleClick} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        gap="3"
        px="3"
        py="2.5"
        borderRadius="lg"
        borderLeftWidth="3px"
        borderLeftColor={active ? 'primary' : 'transparent'}
        bg={active ? 'surface' : 'transparent'}
        color={active ? 'primary' : 'onSurfaceVariant'}
        textStyle="labelMd"
        fontWeight={active ? '600' : '500'}
        _hover={{ bg: 'surface', color: 'onSurface' }}
      >
        <MaterialIcon name={item.icon} filled={active} size={20} />
        {item.label}
      </Flex>
    </Link>
  )
}

function useNavActive(pathname, hash) {
  return (href) => {
    if (href.includes('#users')) return pathname === '/admin' && hash === '#users'
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/admin') return pathname === '/admin' && !hash
    if (href === '/create-trip') return pathname === '/create-trip'
    if (href === '/trips') return pathname === '/trips' || pathname.startsWith('/trips/')
    if (href === '/requests') return pathname === '/requests'
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
        <SidebarNavItem key={`${item.href}-${item.label}`} item={item} active={isActive(item.href)} onNavigate={onClose} />
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
