import { useCallback } from 'react'
import { Box, Flex, Spinner, Table, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { formatDateShort } from '../lib/format'

export function AdminTripsPage() {
  const fetcher = useCallback(() => api.admin.listTrips(), [])
  const { data, loading, error } = useApiResource(fetcher)
  const trips = data?.trips || []

  return (
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="admin" />
        <Text textStyle="headlineMd" mb="2">
          All platform trips
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
          Monitor every outing created by organizers. Admins do not create trips here.
        </Text>

        {loading ? (
          <Flex justify="center" py="20">
            <Spinner color="primary" />
          </Flex>
        ) : error ? (
          <Text color="error" textStyle="bodySm">
            Could not load trips: {error.message}
          </Text>
        ) : (
          <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
            <Table.Root>
              <Table.Header bg="navy">
                <Table.Row>
                  {['Trip', 'Location', 'Date', 'Status', 'Organizer'].map((col) => (
                    <Table.ColumnHeader key={col} py="3" px="5" textStyle="labelSm" color="onNavy">
                      {col}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {trips.map((trip) => (
                  <Table.Row key={trip._id}>
                    <Table.Cell py="4" px="5" textStyle="labelMd">
                      <RouterLink to={`/trips/${trip._id}`}>{trip.title}</RouterLink>
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      {trip.location}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      {formatDateShort(trip.startDate)}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      <StatusBadge status={trip.status} />
                    </Table.Cell>
                    <Table.Cell py="4" px="5" textStyle="bodySm" color="onSurfaceVariant">
                      {trip.organizer?.name || '—'}
                      {trip.organizer?.organizationType ? ` • ${trip.organizer.organizationType}` : ''}
                    </Table.Cell>
                  </Table.Row>
                ))}
                {trips.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={5} py="10" textAlign="center" color="onSurfaceVariant">
                      No trips yet on the platform.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Box>
  )
}
