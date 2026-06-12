import { useCallback, useMemo, useState } from 'react'
import { Box, Button, Flex, HStack, Spinner, Table, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FilterChip } from '../components/molecules/FilterChip'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { formatDateShort } from '../lib/format'
import { stableBusyProps } from '../lib/stableButton'
import { stitchGreenButton } from '../theme/fluide-theme'

const FILTERS = [
  { id: 'all', label: 'All', status: undefined },
  { id: 'pending', label: 'Pending', status: 'pending' },
  { id: 'accepted', label: 'Accepted', status: 'accepted' },
  { id: 'completed', label: 'Completed', status: 'completed' },
]

export function ProviderRequestsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const status = useMemo(() => FILTERS.find((f) => f.id === activeFilter)?.status, [activeFilter])
  const fetcher = useCallback(() => api.requests.list({ status }), [status])
  const { data, loading, error, reload } = useApiResource(fetcher)
  const requests = data?.requests || []
  const [busyId, setBusyId] = useState(null)

  const markCompleted = async (id) => {
    setBusyId(id)
    try {
      await api.requests.updateStatus(id, 'completed')
      await reload()
    } catch (err) {
      window.alert(err?.message || 'Could not update the request status.')
    } finally {
      setBusyId(null)
    }
  }

  return (
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="provider" />
        <Text textStyle="headlineMd" mb="2">
          Requests / Responses
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
          Track trips you responded to — update proposals or mark bookings completed.
        </Text>
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
              <Table.Header bg="secondaryContainer">
                <Table.Row>
                  {['Trip name', 'Organizer', 'Need type', 'Date', 'Status', 'Actions'].map((col) => (
                    <Table.ColumnHeader key={col} py="3" px="5" textStyle="labelSm" color="onSecondaryContainer">
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
                      <Text textStyle="labelMd">{row.organizer?.name || '—'}</Text>
                      <Text textStyle="bodySm" color="onSurfaceVariant">
                        {row.organizer?.organizationType || ''}
                      </Text>
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      {row.needType}
                    </Table.Cell>
                    <Table.Cell py="4" px="5" textStyle="bodySm" color="onSurfaceVariant">
                      {formatDateShort(row.trip?.startDate)}
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      <StatusBadge status={row.status} />
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      <HStack gap="2" flexWrap="wrap">
                        {row.trip?._id && (
                          <RouterLink to={`/trips/${row.trip._id}`}>
                            <Button size="sm" {...stitchGreenButton}>
                              View Details
                            </Button>
                          </RouterLink>
                        )}
                        {row.status === 'accepted' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            color="primary"
                            {...stableBusyProps(busyId === row._id)}
                            onClick={() => markCompleted(row._id)}
                          >
                            Mark Completed
                          </Button>
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
