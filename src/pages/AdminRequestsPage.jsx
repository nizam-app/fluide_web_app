import { useCallback, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { formatDateShort } from '../lib/format'
import { getRequestDisplayStatus } from '../lib/requestStatus'
import { fluideInputStyles } from '../theme/fluide-theme'

function AdminRequestActions({ request, onChanged }) {
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState(request.message || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      await api.admin.updateRequest(request._id, { message: message.trim() })
      setEditing(false)
      await onChanged()
    } catch (err) {
      setError(err?.message || 'Could not update request.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm('Delete this booking request permanently?')) return
    setBusy(true)
    try {
      await api.admin.deleteRequest(request._id)
      await onChanged()
    } catch (err) {
      window.alert(err?.message || 'Could not delete request.')
    } finally {
      setBusy(false)
    }
  }

  if (editing) {
    return (
      <Box minW="220px">
        <Textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          mb="2"
          borderRadius="lg"
          borderColor="outlineVariant"
        />
        <Flex gap="2">
          <Button size="sm" onClick={save} loading={busy}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
        </Flex>
        {error && <Text textStyle="bodySm" color="error" mt="1">{error}</Text>}
      </Box>
    )
  }

  return (
    <Flex gap="2" flexWrap="wrap">
      <Button size="sm" variant="outline" onClick={() => setEditing(true)} disabled={busy}>
        Edit
      </Button>
      <Button size="sm" variant="outline" color="error" borderColor="error" onClick={remove} loading={busy}>
        Delete
      </Button>
    </Flex>
  )
}

export function AdminRequestsPage() {
  const fetcher = useCallback(() => api.admin.listRequests(), [])
  const { data, loading, error, reload } = useApiResource(fetcher)
  const requests = data?.requests || []

  return (
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="admin" />
        <Text textStyle="headlineMd" mb="2">
          All booking requests
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
          Moderate, correct, or remove requests between organizers and providers.
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
          <Box bg="surface" borderRadius="xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
            <Table.Root>
              <Table.Header bg="surfaceContainerLow">
                <Table.Row>
                  {['Trip', 'Organizer', 'Provider', 'Need', 'Date', 'Status', 'Actions'].map((col) => (
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
                      <StatusBadge status={getRequestDisplayStatus(row)} />
                    </Table.Cell>
                    <Table.Cell py="4" px="5">
                      <AdminRequestActions request={row} onChanged={reload} />
                    </Table.Cell>
                  </Table.Row>
                ))}
                {requests.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={7} py="10" textAlign="center" color="onSurfaceVariant">
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
