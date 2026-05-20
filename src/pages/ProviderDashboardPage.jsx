import { Box, Button, Flex, Grid, HStack, Image, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatCard } from '../components/molecules/StatCard'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { PortalLayout } from '../components/templates/PortalLayout'
import { useAuth } from '../context/AuthContext'
import { providerDashboardStats, serviceRequests } from '../data/mockData'
import { stitchGreenButton } from '../theme/fluide-theme'

export function ProviderDashboardPage() {
  const { user } = useAuth()
  const incoming = serviceRequests.filter((r) => r.status === 'pending' || r.status === 'accepted')

  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="provider" />
        <Flex justify="space-between" align="center" mb="8" flexWrap="wrap" gap="4">
          <Text textStyle="headlineMd">Hello, {user?.name}</Text>
          <RouterLink to="/requests">
            <Button {...stitchGreenButton} px="6">
              <MaterialIcon name="inbox" size={18} />
              Open request inbox
            </Button>
          </RouterLink>
        </Flex>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap="6" mb="10">
          {providerDashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </Grid>
        <Box bg="infoBg" borderRadius="fluide3xl" p="6" mb="6" borderWidth="1px" borderColor="outlineVariant">
          <Flex align="center" gap="3" mb="2">
            <MaterialIcon name="lightbulb" color="infoFg" />
            <Text textStyle="labelMd" color="infoFg">
              Provider workflow
            </Text>
          </Flex>
          <Text textStyle="bodySm" color="onSurface">
            You do not create trips. Organizers send requests — you review details, submit a price proposal, and track acceptance here.
          </Text>
        </Box>
        <Flex justify="space-between" align="center" mb="4" flexWrap="wrap" gap="3">
          <Text textStyle="headlineSm">Recent available trips</Text>
          <RouterLink to="/trips">
            <Text textStyle="labelMd" color="primary">
              Browse all trips →
            </Text>
          </RouterLink>
        </Flex>
        <Text textStyle="headlineSm" mb="4" mt="8">
          Requests waiting for your response
        </Text>
        <Stack gap="4">
          {incoming.map((req) => (
            <Flex
              key={req.id}
              bg="surface"
              borderRadius="fluide3xl"
              borderWidth="2px"
              borderColor="secondaryContainer"
              p="6"
              gap="5"
              align={{ base: 'stretch', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
            >
              <Image src={req.image} alt="" w="20" h="20" borderRadius="xl" objectFit="cover" />
              <Box flex="1">
                <Text textStyle="headlineSm" mb="1">
                  {req.trip}
                </Text>
                <Text textStyle="bodyMd" color="onSurfaceVariant" mb="2">
                  From <strong>{req.organizer}</strong> ({req.orgType})
                </Text>
                <HStack gap="2" flexWrap="wrap">
                  <Flex align="center" gap="1" px="2" py="1" bg="tagBlue" borderRadius="pill" fontSize="xs" fontWeight="600" color="tagBlueFg">
                    <MaterialIcon name={req.needIcon} size={14} />
                    {req.needType}
                  </Flex>
                  <Text textStyle="bodySm" color="onSurfaceVariant">
                    {req.date}
                  </Text>
                </HStack>
              </Box>
              <Stack align={{ base: 'stretch', md: 'flex-end' }} gap="2">
                <StatusBadge status={req.status} />
                <RouterLink to={`/trips/${req.id}`}>
                  <Button {...stitchGreenButton} w={{ base: 'full', md: 'auto' }}>
                    Submit proposal
                  </Button>
                </RouterLink>
              </Stack>
            </Flex>
          ))}
        </Stack>
      </Box>
    </PortalLayout>
  )
}
