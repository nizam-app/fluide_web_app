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
import { formatDateShort, getNeedTypeIcon } from '../lib/format'
import { stitchGreenButton } from '../theme/fluide-theme'

function countBy(items, predicate) {
  return items.reduce((acc, item) => (predicate(item) ? acc + 1 : acc), 0)
}

export function ProviderDashboardPage() {
  const { user } = useAuth()
  const fetcher = useCallback(async () => {
    const [reqResult, offerResult, tripsResult] = await Promise.all([
      api.requests.list(),
      api.offers.list(),
      api.trips.list(),
    ])
    const tripsById = Object.fromEntries(
      (tripsResult.trips || []).map((trip) => [String(trip._id || trip.id), trip]),
    )
    const requests = (reqResult.requests || []).map((req) => {
      const tripId = String(req.trip?._id || req.trip?.id || req.trip || '')
      const fullTrip = tripsById[tripId]
      if (!fullTrip) return req
      return { ...req, trip: { ...fullTrip, ...(typeof req.trip === 'object' ? req.trip : {}) } }
    })
    return { requests, offers: offerResult.offers || [] }
  }, [])
  const { data, loading, error } = useApiResource(fetcher)
  const requests = data?.requests || []
  const offers = data?.offers || []

  const incoming = requests.filter((r) => r.status === 'pending' || r.status === 'accepted').slice(0, 5)

  const stats = [
    {
      label: 'Open Requests',
      value: countBy(requests, (r) => r.status === 'pending'),
      trend: 'Available to bid on',
      urgent: true,
      icon: 'inbox',
      iconBg: 'amberBg',
      iconColor: 'amberFg',
    },
    {
      label: 'Pending Offers',
      value: countBy(offers, (o) => o.status === 'submitted'),
      trend: 'Awaiting organizer',
      icon: 'pending_actions',
      iconBg: 'infoBg',
      iconColor: 'infoFg',
    },
    {
      label: 'Accepted Offers',
      value: countBy(offers, (o) => o.status === 'accepted'),
      trend: 'Bookings confirmed',
      trendUp: true,
      icon: 'check_circle',
      iconBg: 'secondaryContainer',
      iconColor: 'onSecondaryContainer',
    },
    {
      label: 'Completed Bookings',
      value: countBy(requests, (r) => r.status === 'completed' && r.provider?._id),
      trend: 'Lifetime total',
      icon: 'task_alt',
      iconBg: 'surfaceContainer',
      iconColor: 'onSurfaceVariant',
    },
  ]

  return (
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

            <Box bg="infoBg" borderRadius="fluide3xl" p="6" mb="6" borderWidth="1px" borderColor="outlineVariant">
              <Flex align="center" gap="3" mb="2">
                <MaterialIcon name="lightbulb" color="infoFg" />
                <Text textStyle="labelMd" color="infoFg">
                  Supplier workflow
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
            {incoming.length === 0 ? (
              <Box bg="surface" p="6" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant">
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  No open requests right now — check back soon.
                </Text>
              </Box>
            ) : (
              <Stack gap="4">
                {incoming.map((req) => (
                  <Flex
                    key={req._id}
                    bg="surface"
                    borderRadius="fluide3xl"
                    borderWidth="2px"
                    borderColor="secondaryContainer"
                    p="6"
                    gap="5"
                    align={{ base: 'stretch', md: 'center' }}
                    direction={{ base: 'column', md: 'row' }}
                  >
                    <TripCover
                      trip={req.trip}
                      alt={req.trip?.title || 'Trip'}
                      w="20"
                      h="20"
                      borderRadius="xl"
                      flexShrink={0}
                    />
                    <Box flex="1">
                      <Text textStyle="headlineSm" mb="1">
                        {req.trip?.title || 'Trip'}
                      </Text>
                      <Text textStyle="bodyMd" color="onSurfaceVariant" mb="2">
                        From <strong>{req.organizer?.name || '—'}</strong>
                        {req.organizer?.organizationType ? ` (${req.organizer.organizationType})` : ''}
                      </Text>
                      <HStack gap="2" flexWrap="wrap">
                        <Flex
                          align="center"
                          gap="1"
                          px="2"
                          py="1"
                          bg="tagBlue"
                          borderRadius="pill"
                          fontSize="xs"
                          fontWeight="600"
                          color="tagBlueFg"
                        >
                          <MaterialIcon name={getNeedTypeIcon(req.needType)} size={14} />
                          {req.needType}
                        </Flex>
                        <Text textStyle="bodySm" color="onSurfaceVariant">
                          {formatDateShort(req.trip?.startDate)}
                        </Text>
                      </HStack>
                    </Box>
                    <Stack align={{ base: 'stretch', md: 'flex-end' }} gap="2">
                      <StatusBadge status={req.status} />
                      {req.trip?._id && (
                        <RouterLink to={`/trips/${req.trip._id}`}>
                          <Button {...stitchGreenButton} w={{ base: 'full', md: 'auto' }}>
                            Submit proposal
                          </Button>
                        </RouterLink>
                      )}
                    </Stack>
                  </Flex>
                ))}
              </Stack>
            )}
          </>
        )}
      </Box>
  )
}
