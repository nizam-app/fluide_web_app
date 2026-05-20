import { Box, Button, Flex, Grid, HStack, Image, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatCard } from '../components/molecules/StatCard'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { PortalLayout } from '../components/templates/PortalLayout'
import { useAuth } from '../context/AuthContext'
import { dashboardStats, portalRequests, recentTripsDashboard } from '../data/mockData'
import { stitchBlackButton } from '../theme/fluide-theme'

export function OrganizerDashboardPage() {
  const { user } = useAuth()

  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="organizer" />
        <Flex justify="space-between" align="center" mb="8" flexWrap="wrap" gap="4">
          <Text textStyle="headlineMd">Hello, {user?.name}</Text>
          <RouterLink to="/create-trip">
            <Button {...stitchBlackButton} px="6">
              <MaterialIcon name="add" size={18} />
              Create a Trip
            </Button>
          </RouterLink>
        </Flex>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap="6" mb="10">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </Grid>
        <Grid templateColumns={{ base: '1fr', xl: '2fr 1fr' }} gap="8">
          <Box>
            <Flex justify="space-between" mb="4">
              <Text textStyle="headlineSm">Your recent trips</Text>
              <RouterLink to="/trips">
                <Text textStyle="labelMd" color="primary">
                  All trips →
                </Text>
              </RouterLink>
            </Flex>
            <Stack gap="3">
              {recentTripsDashboard.map((trip) => (
                <Flex key={trip.id} bg="surface" borderRadius="fluide" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
                  <Image src={trip.image} alt="" w="24" h="24" objectFit="cover" display={{ base: 'none', sm: 'block' }} />
                  <Flex flex="1" p="4" justify="space-between" align="center" gap="3" flexWrap="wrap">
                    <Box>
                      <Text textStyle="labelMd">{trip.title}</Text>
                      <Text textStyle="bodySm" color="onSurfaceVariant">
                        {trip.date}
                      </Text>
                    </Box>
                    <HStack>
                      <StatusBadge status={trip.status} />
                      <RouterLink to={`/trips/${trip.id}`}>
                        <Button size="sm" variant="outline" borderRadius="pill">
                          Manage
                        </Button>
                      </RouterLink>
                    </HStack>
                  </Flex>
                </Flex>
              ))}
            </Stack>
          </Box>
          <Box bg="surfaceContainerLow" borderRadius="fluide3xl" p="6" borderWidth="1px" borderColor="outlineVariant">
            <Text textStyle="headlineSm" mb="4">
              Provider responses
            </Text>
            <Stack gap="3">
              {portalRequests.map((req) => (
                <Flex key={req.id} bg="surface" p="3" borderRadius="fluide" align="center" gap="3">
                  <Flex w="9" h="9" borderRadius="full" bg="primaryContainer" color="primary" align="center" justify="center" fontSize="xs" fontWeight="bold">
                    {req.initials}
                  </Flex>
                  <Box flex="1">
                    <Text textStyle="labelMd" fontSize="sm">
                      {req.name}
                    </Text>
                    <Text textStyle="bodySm" color="onSurfaceVariant">
                      {req.detail}
                    </Text>
                  </Box>
                  <StatusBadge status={req.status} />
                </Flex>
              ))}
            </Stack>
            <RouterLink to="/requests">
              <Button variant="ghost" w="full" mt="4" color="primary">
                My booking requests
              </Button>
            </RouterLink>
          </Box>
        </Grid>
      </Box>
    </PortalLayout>
  )
}
