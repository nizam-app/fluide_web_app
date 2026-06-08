import { useCallback, useEffect, useState } from 'react'
import { Box, Spinner, Stack, Text } from '@chakra-ui/react'
import api from '../../lib/api'
import { formatDateTime } from '../../lib/format'

export function RequestHistoryPanel({ requestId }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!requestId) return
    setLoading(true)
    setError('')
    try {
      const result = await api.requests.history(requestId)
      setHistory(result.history || [])
    } catch (err) {
      setError(err?.message || 'Could not load history.')
    } finally {
      setLoading(false)
    }
  }, [requestId])

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  return (
    <Box mt="4" pt="4" borderTopWidth="1px" borderColor="outlineVariant">
      <Text textStyle="labelMd" mb="3" fontWeight="600">
        Change history
      </Text>
      {loading ? (
        <Spinner size="sm" color="primary" />
      ) : error ? (
        <Text textStyle="bodySm" color="error">{error}</Text>
      ) : history.length === 0 ? (
        <Text textStyle="bodySm" color="onSurfaceVariant">No changes recorded yet.</Text>
      ) : (
        <Stack gap="3">
          {history.map((entry) => (
            <Box key={entry._id} bg="surfaceContainerLow" borderRadius="lg" p="3">
              <Text textStyle="labelSm" fontWeight="600">
                {entry.summary || entry.action}
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mt="1">
                {entry.actor?.name || 'System'} · {formatDateTime(entry.createdAt)}
              </Text>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}
