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
    <Box bg={t.bg} color={t.color} borderRadius="xl" p={{ base: 6, md: 7 }} mb="8">
      <Flex align="flex-start" gap="4">
        <Flex w="12" h="12" borderRadius="lg" bg="whiteAlpha.200" align="center" justify="center" flexShrink={0}>
          <MaterialIcon name={t.icon} size={28} color={t.color} filled />
        </Flex>
        <Box>
          <Text textStyle="labelSm" opacity={0.8} mb="1">
            {role === 'provider' ? 'Supplier' : role} workspace
          </Text>
          <Text textStyle="headlineMd" mb="1.5" fontWeight="600">
            {t.title}
          </Text>
          <Text textStyle="bodySm" opacity={0.88} maxW="2xl">
            {t.subtitle}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
