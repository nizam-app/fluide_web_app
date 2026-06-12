import { useCallback, useMemo, useState } from 'react'
import { Box, Button, Flex, HStack, Spinner, Table, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { FilterChip } from '../components/molecules/FilterChip'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { formatDateShort } from '../lib/format'
import { getRequestDisplayStatus } from '../lib/requestStatus'
import { stableBusyProps } from '../lib/stableButton'
import { stitchGreenButton } from '../theme/fluide-theme'

const FILTERS = [
  { id: 'all', label: 'All', status: undefined },
  { id: 'pending', label: 'Pending', status: 'pending' },
  { id: 'accepted', label: 'Accepted', status: 'accepted' },
  { id: 'completed', label: 'Completed', status: 'completed' },
  { id: 'rejected', label: 'Rejected', status: 'rejected' },
]

export function OrganizerRequestsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const status = useMemo(() => FILTERS.find((f) => f.id === activeFilter)?.status, [activeFilter])
  const fetcher = useCallback(() => api.requests.list({ status }), [status])
  const { data, loading, error, reload } = useApiResource(fetcher)
  const requests = data?.requests || []
  const [busyId, setBusyId] = useState(null)

  const handleStatusChange = async (id, nextStatus) => {
    setBusyId(id)
    try {
      await api.requests.updateStatus(id, nextStatus)
      await reload()
    } catch (err) {
      window.alert(err?.message || 'Could not update the request status.')
    } finally {
      setBusyId(null)
    }
  }

  return (
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="organizer" />
        <Flex justify="space-between" align="flex-end" mb="6" flexWrap="wrap" gap="4">
          <Box>
            <Text textStyle="headlineMd" mb="1">
              Requests / Bookings
            </Text>
            <Text textStyle="bodySm" color="onSurfaceVariant">
              Manage provider responses for your trips — accept, reject, or mark completed.
            </Text>
          </Box>
          <RouterLink to="/create-trip">
            <Button {...stitchGreenButton}>
              <MaterialIcon name="add" size={18} />
              Create a Trip
            </Button>
          </RouterLink>
        </Flex>
        <HStack gap="2" mb="6" flexWrap="wrap">
          {FILTERS.map((f) => (
            <FilterChip key={f.id} active={activeFilter === f.id} onClick={() => setActiveFilter(f.id)}>
              {f.label}
            </FilterChip>
          ))}
        </HStack>

        {loading ? (
          <Flex justify="center" py="20">
            <Spinner color="primary" />
          </Flex>
        ) : error ? (
          <Text color="error" textStyle="bodySm">
            Could not load requests: {error.message}
          </Text>
        ) : (
          <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="auto">
            <Table.Root minW="800px">
              <Table.Header bg="surfaceContainerLow">
                <Table.Row>
                  {['Trip name', 'Provider', 'Need type', 'Date', 'Status', 'Actions'].map((col) => (
                    <Table.ColumnHeader key={col} py="3" px="5" textStyle="labelSm" color="onSurfaceVariant">
                      {col}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {requests.map((row) => (
                  <Table.Row key={row._id}>
                    <Table.Cell py="4" px="5" textStyle="labelMd">
                      {row.trip?.title || '—'}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      {row.provider?.name || <Text color="onSurfaceVariant">Unassigned</Text>}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      {row.needType}
                    </Table.Cell>
                    <Table.Cell py="4" px="5" textStyle="bodySm" color="onSurfaceVariant">
                      {formatDateShort(row.trip?.startDate)}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      <StatusBadge status={getRequestDisplayStatus(row)} />
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      <HStack gap="2" flexWrap="wrap">
                        {row.status === 'accepted' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            color="primary"
                            {...stableBusyProps(busyId === row._id)}
                            onClick={() => handleStatusChange(row._id, 'completed')}
                          >
                            Mark Completed
                          </Button>
                        )}
                        {row.status !== 'rejected' && row.status !== 'completed' && row.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            borderRadius="pill"
                            {...stableBusyProps(busyId === row._id)}
                            onClick={() => handleStatusChange(row._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        )}
                        {row.trip?._id && (
                          <RouterLink to={`/trips/${row.trip._id}`}>
                            <Button size="sm" variant="ghost" color="primary">
                              Details
                            </Button>
                          </RouterLink>
                        )}
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {requests.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={6} py="10" textAlign="center" color="onSurfaceVariant">
                      No requests in this view.
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
