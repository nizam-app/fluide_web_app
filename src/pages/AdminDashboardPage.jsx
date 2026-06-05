import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Flex, Grid, HStack, Spinner, Stack, Table, Text } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatCard } from '../components/molecules/StatCard'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { formatDateShort } from '../lib/format'

const typeColors = { admin: 'infoBg', provider: 'secondaryContainer', organizer: 'surfaceContainer' }

export function AdminDashboardPage() {
  const { hash } = useLocation()
  const [busyUserId, setBusyUserId] = useState(null)

  const fetcher = useCallback(
    () =>
      Promise.all([
        api.admin.stats(),
        api.admin.listUsers(),
        api.admin.listTrips(),
        api.admin.listRequests(),
      ]).then(([statsRes, usersRes, tripsRes, requestsRes]) => ({
        stats: statsRes.stats,
        users: usersRes.users || [],
        trips: tripsRes.trips || [],
        requests: requestsRes.requests || [],
      })),
    [],
  )

  const { data, loading, error, reload } = useApiResource(fetcher)
  const stats = data?.stats
  const users = data?.users || []
  const trips = data?.trips || []
  const requests = data?.requests || []

  useEffect(() => {
    if (hash === '#users' && !loading) {
      document.getElementById('users')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash, loading])

  const toggleUserStatus = async (user) => {
    const next = user.status === 'active' ? 'suspended' : 'active'
    setBusyUserId(user._id)
    try {
      await api.admin.updateUserStatus(user._id, next)
      await reload()
    } catch (err) {
      window.alert(err?.message || 'Could not update the user.')
    } finally {
      setBusyUserId(null)
    }
  }

  const statCards = stats
    ? [
        {
          label: 'Total Users',
          value: stats.users,
          trend: `${stats.organizers} organizers • ${stats.providers} suppliers`,
          icon: 'group',
          iconBg: 'infoBg',
          iconColor: 'infoFg',
        },
        {
          label: 'Total Trips',
          value: stats.trips,
          trend: `${stats.tripsByStatus?.published || 0} published`,
          trendUp: true,
          icon: 'map',
          iconBg: 'secondaryContainer',
          iconColor: 'onSecondaryContainer',
        },
        {
          label: 'Total Requests',
          value: stats.requests,
          trend: `${stats.pendingRequests || 0} pending`,
          urgent: (stats.pendingRequests || 0) > 0,
          icon: 'forum',
          iconBg: 'infoBg',
          iconColor: 'infoFg',
        },
        {
          label: 'Active Providers',
          value: stats.providers,
          trend: `${stats.submittedOffers || 0} live offers`,
          icon: 'storefront',
          iconBg: 'surfaceContainer',
          iconColor: 'onSurfaceVariant',
        },
      ]
    : []

  const tripsQueue = trips
    .filter((t) => t.status === 'published' || t.status === 'scheduled' || t.status === 'in_progress')
    .slice(0, 5)
  const recentRequests = requests.slice(0, 5)

  return (
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="admin" />
        <Flex justify="space-between" align="center" mb="10" flexWrap="wrap" gap="4">
          <Text textStyle="headlineMd">Platform overview</Text>
          <HStack gap="3">
            <Button variant="ghost" aria-label="Refresh" onClick={reload}>
              <MaterialIcon name="refresh" />
            </Button>
          </HStack>
        </Flex>

        {loading ? (
          <Flex justify="center" py="20">
            <Spinner color="primary" />
          </Flex>
        ) : error ? (
          <Text color="error" textStyle="bodySm">
            Could not load the admin dashboard: {error.message}
          </Text>
        ) : (
          <>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap="6" mb="10">
              {statCards.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </Grid>

            <Box
              id="users"
              scrollMarginTop="24"
              bg="surface"
              borderRadius="fluide3xl"
              borderWidth="1px"
              borderColor="outlineVariant"
              overflow="hidden"
              mb="8"
              shadow="level1"
            >
              <Flex justify="space-between" align="center" p="6" borderBottomWidth="1px" borderColor="outlineVariant">
                <Box>
                  <Text textStyle="headlineSm">User management</Text>
                  <Text textStyle="bodySm" color="onSurfaceVariant">
                    Manage platform participants and permissions
                  </Text>
                </Box>
                <Text textStyle="labelMd" color="onSurfaceVariant">
                  {users.length} users
                </Text>
              </Flex>
              <Box overflow="auto">
                <Table.Root minW="900px">
                  <Table.Header bg="surfaceContainerLow">
                    <Table.Row>
                      {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                        <Table.ColumnHeader key={h} py="3" px="6" textStyle="labelSm" color="onSurfaceVariant">
                          {h}
                        </Table.ColumnHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {users.map((u) => (
                      <Table.Row key={u._id}>
                        <Table.Cell py="4" px="6">
                          <HStack gap="3">
                            <Flex
                              w="10"
                              h="10"
                              borderRadius="full"
                              bg="primaryContainer"
                              color="primary"
                              align="center"
                              justify="center"
                              fontWeight="bold"
                              textStyle="labelSm"
                            >
                              {(u.name || '?').slice(0, 2).toUpperCase()}
                            </Flex>
                            <Text textStyle="labelMd">{u.name || '—'}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell py="4" px="6" textStyle="bodySm" color="onSurfaceVariant">
                          {u.email}
                        </Table.Cell>
                        <Table.Cell py="4" px="6">
                          <Box
                            as="span"
                            px="3"
                            py="1"
                            borderRadius="pill"
                            bg={typeColors[u.role] || 'surfaceContainer'}
                            textStyle="labelSm"
                            fontWeight="600"
                            textTransform="capitalize"
                          >
                            {u.role}
                          </Box>
                        </Table.Cell>
                        <Table.Cell py="4" px="6">
                          <HStack gap="2">
                            <Box w="2" h="2" borderRadius="full" bg={u.status === 'active' ? 'primary' : 'outline'} />
                            <Text textStyle="bodySm" textTransform="capitalize">
                              {u.status}
                            </Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell py="4" px="6">
                          <Button
                            variant="outline"
                            size="sm"
                            borderRadius="pill"
                            loading={busyUserId === u._id}
                            onClick={() => toggleUserStatus(u)}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                    {users.length === 0 && (
                      <Table.Row>
                        <Table.Cell colSpan={5} py="10" textAlign="center" color="onSurfaceVariant">
                          No users yet.
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>

            <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden" mb="8">
              <Box px="6" py="4" borderBottomWidth="1px" borderColor="outlineVariant">
                <Text textStyle="headlineSm">Recent requests</Text>
              </Box>
              <Box overflow="auto">
                <Table.Root>
                  <Table.Header bg="surfaceContainerLow">
                    <Table.Row>
                      {['Trip', 'Organizer', 'Provider', 'Need', 'Date', 'Status'].map((h) => (
                        <Table.ColumnHeader key={h} py="3" px="5" textStyle="labelSm" color="onSurfaceVariant">
                          {h}
                        </Table.ColumnHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {requests.slice(0, 10).map((r) => (
                      <Table.Row key={r._id}>
                        <Table.Cell py="4" px="5" textStyle="labelMd">
                          {r.trip?.title || '—'}
                        </Table.Cell>
                        <Table.Cell py="4" px="5">
                          {r.organizer?.name || '—'}
                        </Table.Cell>
                        <Table.Cell py="4" px="5">
                          {r.provider?.name || '—'}
                        </Table.Cell>
                        <Table.Cell py="4" px="5">
                          {r.needType}
                        </Table.Cell>
                        <Table.Cell py="4" px="5">
                          {formatDateShort(r.trip?.startDate)}
                        </Table.Cell>
                        <Table.Cell py="4" px="5">
                          <StatusBadge status={r.status} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>

            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
              <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
                <Box bg="infoBg" px="6" py="4" borderBottomWidth="1px" borderColor="outlineVariant">
                  <Text textStyle="labelMd" color="infoFg">
                    Trips queue
                  </Text>
                </Box>
                <Stack gap="0">
                  {tripsQueue.length === 0 && (
                    <Box p="6">
                      <Text textStyle="bodySm" color="onSurfaceVariant">
                        No active trips right now.
                      </Text>
                    </Box>
                  )}
                  {tripsQueue.map((t) => (
                    <Flex
                      key={t._id}
                      p="5"
                      borderBottomWidth="1px"
                      borderColor="outlineVariant"
                      justify="space-between"
                      align="center"
                      gap="4"
                    >
                      <Box>
                        <Text textStyle="labelMd">{t.title}</Text>
                        <HStack gap="1" textStyle="bodySm" color="onSurfaceVariant" mt="1">
                          <MaterialIcon name="location_on" size={14} />
                          {t.location}
                        </HStack>
                        <HStack gap="1" textStyle="bodySm" color="onSurfaceVariant" mt="0.5">
                          <MaterialIcon name="calendar_today" size={14} />
                          {formatDateShort(t.startDate)}
                        </HStack>
                      </Box>
                      <StatusBadge status={t.status} />
                    </Flex>
                  ))}
                </Stack>
              </Box>

              <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
                <Box bg="infoBg" px="6" py="4" borderBottomWidth="1px" borderColor="outlineVariant">
                  <Text textStyle="labelMd" color="infoFg">
                    Activity stream
                  </Text>
                </Box>
                <Stack gap="0">
                  {recentRequests.length === 0 && (
                    <Box p="6">
                      <Text textStyle="bodySm" color="onSurfaceVariant">
                        No recent activity yet.
                      </Text>
                    </Box>
                  )}
                  {recentRequests.map((r) => (
                    <Flex
                      key={r._id}
                      p="5"
                      borderBottomWidth="1px"
                      borderColor="outlineVariant"
                      align="center"
                      gap="4"
                    >
                      <Flex w="10" h="10" borderRadius="full" bg="surfaceContainer" align="center" justify="center">
                        <MaterialIcon name="forum" color="infoFg" />
                      </Flex>
                      <Box flex="1">
                        <Text textStyle="labelMd">{r.trip?.title || '—'}</Text>
                        <Text textStyle="bodySm" color="onSurfaceVariant">
                          From {r.organizer?.name || '—'} • {r.needType}
                        </Text>
                      </Box>
                      <StatusBadge status={r.status} />
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </>
        )}
      </Box>
  )
}
