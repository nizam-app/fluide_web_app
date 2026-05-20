import { useEffect } from 'react'
import { Box, Button, Flex, Grid, HStack, Stack, Table, Text } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatCard } from '../components/molecules/StatCard'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { PortalLayout } from '../components/templates/PortalLayout'
import { adminRecentRequests, adminStats, adminUsers, serviceRequests, tripsQueue } from '../data/mockData'

const typeColors = { Admin: 'infoBg', Provider: 'secondaryContainer', Manager: 'surfaceContainer' }

export function AdminDashboardPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#users') {
      document.getElementById('users')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash])

  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="admin" />
        <Flex justify="space-between" align="center" mb="10" flexWrap="wrap" gap="4">
          <Text textStyle="headlineMd">Platform overview</Text>
          <HStack gap="3">
            <Box position="relative" display={{ base: 'none', md: 'block' }}>
              <MaterialIcon name="search" size={20} color="outline" position="absolute" left="3" top="50%" transform="translateY(-50%)" />
              <Box as="input" pl="10" w="56" py="2" borderRadius="fluide" borderWidth="1px" borderColor="outlineVariant" bg="surface" placeholder="Search..." />
            </Box>
            <Button variant="ghost" aria-label="Notifications">
              <MaterialIcon name="notifications" />
            </Button>
            <Flex w="10" h="10" borderRadius="full" bg="primary" color="onPrimary" align="center" justify="center" fontWeight="bold">
              A
            </Flex>
          </HStack>
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap="6" mb="10">
          {adminStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </Grid>

        <Box id="users" scrollMarginTop="24" bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden" mb="8" shadow="level1">
          <Flex justify="space-between" align="center" p="6" borderBottomWidth="1px" borderColor="outlineVariant">
            <Box>
              <Text textStyle="headlineSm">User management</Text>
              <Text textStyle="bodySm" color="onSurfaceVariant">
                Manage platform participants and permissions
              </Text>
            </Box>
            <Text textStyle="labelMd" color="primary" cursor="pointer">
              View All Users →
            </Text>
          </Flex>
          <Table.Root>
            <Table.Header bg="surfaceContainerLow">
              <Table.Row>
                {['Name', 'Email', 'Type', 'Status', 'Actions'].map((h) => (
                  <Table.ColumnHeader key={h} py="3" px="6" textStyle="labelSm" color="onSurfaceVariant">
                    {h}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {adminUsers.map((u) => (
                <Table.Row key={u.id}>
                  <Table.Cell py="4" px="6">
                    <HStack gap="3">
                      <Flex w="10" h="10" borderRadius="full" bg="primaryContainer" color="primary" align="center" justify="center" fontWeight="bold" textStyle="labelSm">
                        {u.initials}
                      </Flex>
                      <Text textStyle="labelMd">{u.name}</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell py="4" px="6" textStyle="bodySm" color="onSurfaceVariant">
                    {u.email}
                  </Table.Cell>
                  <Table.Cell py="4" px="6">
                    <Box as="span" px="3" py="1" borderRadius="pill" bg={typeColors[u.type]} textStyle="labelSm" fontWeight="600">
                      {u.type}
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
                    <Button variant="ghost" size="sm" aria-label="Actions">
                      <MaterialIcon name="more_vert" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden" mb="8">
          <Box px="6" py="4" borderBottomWidth="1px" borderColor="outlineVariant">
            <Text textStyle="headlineSm">Request management</Text>
          </Box>
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
              {serviceRequests.map((r) => (
                <Table.Row key={r.id}>
                  <Table.Cell py="4" px="5" textStyle="labelMd">
                    {r.trip}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    {r.organizer}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    {r.provider}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    {r.needType}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    {r.date}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    <StatusBadge status={r.status} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
          <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
            <Box bg="infoBg" px="6" py="4" borderBottomWidth="1px" borderColor="outlineVariant">
              <Text textStyle="labelMd" color="infoFg">
                Trips Queue
              </Text>
            </Box>
            <Stack gap="0">
              {tripsQueue.map((t) => (
                <Flex key={t.title} p="5" borderBottomWidth="1px" borderColor="outlineVariant" justify="space-between" align="center" gap="4">
                  <Box>
                    <Text textStyle="labelMd">{t.title}</Text>
                    <HStack gap="1" textStyle="bodySm" color="onSurfaceVariant" mt="1">
                      <MaterialIcon name="location_on" size={14} />
                      {t.location}
                    </HStack>
                    <HStack gap="1" textStyle="bodySm" color="onSurfaceVariant" mt="0.5">
                      <MaterialIcon name="calendar_today" size={14} />
                      {t.date}
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
                Recent Requests
              </Text>
            </Box>
            <Stack gap="0">
              {adminRecentRequests.map((r) => (
                <Flex key={r.title} p="5" borderBottomWidth="1px" borderColor="outlineVariant" align="center" gap="4">
                  <Flex w="10" h="10" borderRadius="full" bg="surfaceContainer" align="center" justify="center">
                    <MaterialIcon name={r.icon} color={r.iconColor} />
                  </Flex>
                  <Box flex="1">
                    <Text textStyle="labelMd">{r.title}</Text>
                    <Text textStyle="bodySm" color="onSurfaceVariant">
                      From {r.from}
                    </Text>
                  </Box>
                  <StatusBadge status={r.status} />
                </Flex>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Box>
    </PortalLayout>
  )
}
