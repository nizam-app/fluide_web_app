import { Box, Flex, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'

const themes = {
  admin: {
    bg: 'navy',
    color: 'onNavy',
    icon: 'admin_panel_settings',
    title: 'Platform Administration',
    subtitle: 'Manage users, trips, and bookings across the entire platform.',
  },
  organizer: {
    bg: 'primary',
    color: 'onPrimary',
    icon: 'groups',
    title: 'Organizer Portal',
    subtitle: 'Create group outings and coordinate with transport, activity, and service providers.',
  },
  provider: {
    bg: 'secondary',
    color: 'onSecondary',
    icon: 'storefront',
    title: 'Supplier Portal',
    subtitle: 'Receive trip requests and propose your transport, catering, or activity services.',
  },
}

export function RolePageHeader({ role }) {
  const t = themes[role] ?? themes.organizer
  return (
    <Box bg={t.bg} color={t.color} borderRadius="fluide3xl" p={{ base: 6, md: 8 }} mb="8">
      <Flex align="flex-start" gap="4">
        <Flex w="14" h="14" borderRadius="xl" bg="whiteAlpha.200" align="center" justify="center" flexShrink={0}>
          <MaterialIcon name={t.icon} size={32} color={t.color} filled />
        </Flex>
        <Box>
          <Text textStyle="labelSm" opacity={0.85} mb="1" textTransform="uppercase" letterSpacing="wider">
            {role === 'provider' ? 'Supplier' : role} workspace
          </Text>
          <Text textStyle="headlineLg" mb="2">
            {t.title}
          </Text>
          <Text textStyle="bodyMd" opacity={0.9} maxW="2xl">
            {t.subtitle}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
