import { createPortal } from 'react-dom'
import {
  Box,
  Button,
  Flex,
  Table,
  Text,
} from '@chakra-ui/react'
import { formatDateRange, formatPrice } from '../../lib/format'
import { getRequestDisplayLabel } from '../../lib/requestStatus'
import { stitchBlackButton } from '../../theme/fluide-theme'

export function RequestSummaryModal({ open, title, trip, rows, onConfirm, onCancel, confirmLabel = 'Confirm', loading }) {
  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <Box
      position="fixed"
      inset="0"
      zIndex={200}
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="4"
      onClick={loading ? undefined : onCancel}
    >
      <Box
        bg="surface"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="outlineVariant"
        maxW="720px"
        w="full"
        overflow="hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <Box px="6" py="4" borderBottomWidth="1px" borderColor="outlineVariant" bg="surfaceContainerLow">
          <Text textStyle="headlineSm" fontWeight="600">
            {title}
          </Text>
          <Text textStyle="bodySm" color="onSurfaceVariant" mt="1">
            Review the details below before continuing.
          </Text>
        </Box>

        <Box p="6">
          <Table.Root size="sm">
            <Table.Body>
              <Table.Row>
                <Table.Cell py="2" color="onSurfaceVariant" w="40%">Trip</Table.Cell>
                <Table.Cell py="2" fontWeight="600">{trip?.title || '—'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell py="2" color="onSurfaceVariant">Destination</Table.Cell>
                <Table.Cell py="2">{trip?.location || '—'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell py="2" color="onSurfaceVariant">Dates</Table.Cell>
                <Table.Cell py="2">{formatDateRange(trip?.startDate, trip?.endDate)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell py="2" color="onSurfaceVariant">Participants</Table.Cell>
                <Table.Cell py="2">{trip?.participants ?? '—'}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell py="2" color="onSurfaceVariant">Budget</Table.Cell>
                <Table.Cell py="2">
                  {trip?.budgetEstimate != null
                    ? formatPrice(trip.budgetEstimate, trip.budgetCurrency || 'EUR')
                    : '—'}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell py="2" color="onSurfaceVariant">Cost / participant</Table.Cell>
                <Table.Cell py="2">
                  {trip?.costPerParticipant != null
                    ? formatPrice(trip.costPerParticipant, trip.budgetCurrency || 'EUR')
                    : '—'}
                </Table.Cell>
              </Table.Row>
              {(rows || []).map((row) => (
                <Table.Row key={row.label}>
                  <Table.Cell py="2" color="onSurfaceVariant">{row.label}</Table.Cell>
                  <Table.Cell py="2">{row.value}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        <Flex justify="flex-end" gap="3" px="6" py="4" borderTopWidth="1px" borderColor="outlineVariant">
          <Button variant="outline" borderRadius="lg" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            {...stitchBlackButton}
            borderRadius="lg"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </Button>
        </Flex>
      </Box>
    </Box>,
    document.body,
  )
}

export function buildRequestSummaryRows({ needTypes = [], message, offer, statusLabel }) {
  const rows = []
  if (needTypes.length) {
    rows.push({ label: 'Services requested', value: needTypes.join(', ') })
  }
  if (statusLabel) {
    rows.push({ label: 'Status', value: statusLabel })
  }
  if (message) {
    rows.push({ label: 'Message', value: message })
  }
  if (offer) {
    rows.push({ label: 'Provider', value: offer.provider?.name || '—' })
    rows.push({ label: 'Offer price', value: formatPrice(offer.price, offer.currency || 'EUR') })
    rows.push({ label: 'Offer details', value: offer.description || '—' })
  }
  return rows
}

export { getRequestDisplayLabel }
