import { useCallback } from 'react'
import { Box, Button, Flex, Grid, HStack, Spinner, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatCard } from '../components/molecules/StatCard'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { TripCover } from '../components/molecules/TripCover'
import { formatDateShort, initialsFromName } from '../lib/format'
import { stitchBlackButton } from '../theme/fluide-theme'

function countBy(items, predicate) {
  return items.reduce((acc, item) => (predicate(item) ? acc + 1 : acc), 0)
}

export function OrganizerDashboardPage() {
  const { user } = useAuth()
  const fetcher = useCallback(
    () =>
      Promise.all([api.trips.list(), api.requests.list()]).then(([tripsResult, requestsResult]) => ({
        trips: tripsResult.trips || [],
        requests: requestsResult.requests || [],
      })),
    [],
  )
  const { data, loading, error } = useApiResource(fetcher)
  const trips = data?.trips || []
  const requests = data?.requests || []

  const stats = [
    {
      label: 'Created Trips',
      value: trips.length,
      trend: `${countBy(trips, (t) => t.status === 'published' || t.status === 'scheduled')} active`,
      trendUp: true,
      icon: 'map',
      iconBg: 'infoBg',
      iconColor: 'infoFg',
    },
    {
      label: 'Pending Requests',
      value: countBy(requests, (r) => r.status === 'pending'),
      trend: 'Awaiting suppliers',
      urgent: true,
      icon: 'pending_actions',
      iconBg: 'errorContainer',
      iconColor: 'error',
    },
    {
      label: 'Accepted Requests',
      value: countBy(requests, (r) => r.status === 'accepted'),
      trend: 'Ready to schedule',
      icon: 'verified',
      iconBg: 'secondaryContainer',
      iconColor: 'onSecondaryContainer',
    },
    {
      label: 'Completed Requests',
      value: countBy(requests, (r) => r.status === 'completed'),
      trend: 'Lifetime total',
      icon: 'task_alt',
      iconBg: 'infoBg',
      iconColor: 'infoFg',
    },
  ]

  const recentTrips = trips.slice(0, 4)
  const recentRequests = requests.slice(0, 5)

  return (
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

        {loading ? (
          <Flex justify="center" py="10">
            <Spinner color="primary" />
          </Flex>
        ) : error ? (
          <Text color="error" textStyle="bodySm">
            Could not load your dashboard: {error.message}
          </Text>
        ) : (
          <>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap="6" mb="10">
              {stats.map((stat) => (
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
                {recentTrips.length === 0 ? (
                  <Box bg="surface" p="6" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant">
                    <Text textStyle="bodySm" color="onSurfaceVariant">
                      You have not created any trips yet.
                    </Text>
                  </Box>
                ) : (
                  <Stack gap="3">
                    {recentTrips.map((trip) => (
                      <Flex
                        key={trip._id}
                        bg="surface"
                        borderRadius="fluide"
                        borderWidth="1px"
                        borderColor="outlineVariant"
                        overflow="hidden"
                      >
                        <TripCover
                          trip={trip}
                          alt={trip.title}
                          w="24"
                          h="24"
                          display={{ base: 'none', sm: 'block' }}
                        />
                        <Flex flex="1" p="4" justify="space-between" align="center" gap="3" flexWrap="wrap">
                          <Box>
                            <Text textStyle="labelMd">{trip.title}</Text>
                            <Text textStyle="bodySm" color="onSurfaceVariant">
                              {formatDateShort(trip.startDate)}
                            </Text>
                          </Box>
                          <HStack>
                            <StatusBadge status={trip.status} />
                            <RouterLink to={`/trips/${trip._id}`}>
                              <Button size="sm" variant="outline" borderRadius="pill">
                                Manage
                              </Button>
                            </RouterLink>
                          </HStack>
                        </Flex>
                      </Flex>
                    ))}
                  </Stack>
                )}
              </Box>
              <Box
                bg="surfaceContainerLow"
                borderRadius="fluide3xl"
                p="6"
                borderWidth="1px"
                borderColor="outlineVariant"
              >
                <Text textStyle="headlineSm" mb="4">
                  Provider responses
                </Text>
                {recentRequests.length === 0 ? (
                  <Text textStyle="bodySm" color="onSurfaceVariant">
                    No supplier responses yet.
                  </Text>
                ) : (
                  <Stack gap="3">
                    {recentRequests.map((req) => (
                      <Flex key={req._id} bg="surface" p="3" borderRadius="fluide" align="center" gap="3">
                        <Flex
                          w="9"
                          h="9"
                          borderRadius="full"
                          bg="primaryContainer"
                          color="primary"
                          align="center"
                          justify="center"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {initialsFromName(req.provider?.name || req.organizer?.name || 'New')}
                        </Flex>
                        <Box flex="1">
                          <Text textStyle="labelMd" fontSize="sm">
                            {req.provider?.name || 'Awaiting provider'}
                          </Text>
                          <Text textStyle="bodySm" color="onSurfaceVariant">
                            {req.needType} • {req.trip?.title || ''}
                          </Text>
                        </Box>
                        <StatusBadge status={req.status} />
                      </Flex>
                    ))}
                  </Stack>
                )}
                <RouterLink to="/requests">
                  <Button variant="ghost" w="full" mt="4" color="primary">
                    My booking requests
                  </Button>
                </RouterLink>
              </Box>
            </Grid>
          </>
        )}
      </Box>
  )
}
