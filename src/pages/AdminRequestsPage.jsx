import { useCallback } from 'react'
import { Box, Flex, Spinner, Table, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { formatDateShort } from '../lib/format'

export function AdminRequestsPage() {
  const fetcher = useCallback(() => api.admin.listRequests(), [])
  const { data, loading, error } = useApiResource(fetcher)
  const requests = data?.requests || []

  return (
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="admin" />
        <Text textStyle="headlineMd" mb="2">
          All booking requests
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
          Moderate every request between organizers and providers on the platform.
        </Text>

        {loading ? (
          <Flex justify="center" py="20">
            <Spinner color="primary" />
          </Flex>
        ) : error ? (
          <Text color="error" textStyle="bodySm">
            Could not load requests: {error.message}
          </Text>
        ) : (
          <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
            <Table.Root>
              <Table.Header bg="navy">
                <Table.Row>
                  {['Trip', 'Organizer', 'Provider', 'Need', 'Date', 'Status'].map((col) => (
                    <Table.ColumnHeader key={col} py="3" px="5" textStyle="labelSm" color="onNavy">
                      {col}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {requests.map((row) => (
                  <Table.Row key={row._id}>
                    <Table.Cell py="4" px="5" textStyle="labelMd">
                      {row.trip?._id ? (
                        <RouterLink to={`/trips/${row.trip._id}`}>{row.trip.title}</RouterLink>
                      ) : (
                        row.trip?.title || '—'
                      )}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      <Text textStyle="labelMd">{row.organizer?.name || '—'}</Text>
                      <Text textStyle="bodySm" color="onSurfaceVariant">
                        {row.organizer?.organizationType || ''}
                      </Text>
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      {row.provider?.name || <Text color="onSurfaceVariant">—</Text>}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      {row.needType}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      {formatDateShort(row.trip?.startDate)}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      <StatusBadge status={row.status} />
                    </Table.Cell>
                  </Table.Row>
                ))}
                {requests.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={6} py="10" textAlign="center" color="onSurfaceVariant">
                      No requests yet on the platform.
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
