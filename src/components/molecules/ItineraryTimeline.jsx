import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { formatLegDateTime, getFilledLegs, normalizeItinerary } from '../../lib/itinerary'

function LegIcon({ type }) {
  return (
    <Flex
      w="10"
      h="10"
      borderRadius="full"
      bg={type === 'transfer' ? 'primaryContainer' : 'secondaryContainer'}
      color={type === 'transfer' ? 'primary' : 'onSecondaryContainer'}
      align="center"
      justify="center"
      flexShrink={0}
    >
      <MaterialIcon name={type === 'transfer' ? 'directions_bus' : 'hotel'} size={20} />
    </Flex>
  )
}

function TransferLeg({ leg, locale }) {
  const when = formatLegDateTime(leg.date, leg.time, locale)
  return (
    <Box flex="1">
      <Text textStyle="labelMd" mb="1">
        Transfer
      </Text>
      {when && (
        <Text textStyle="bodySm" color="primary" fontWeight="600" mb="2">
          {when}
        </Text>
      )}
      <Stack gap="1">
        {leg.pickup && (
          <Flex gap="2" align="flex-start">
            <MaterialIcon name="trip_origin" size={16} color="onSurfaceVariant" />
            <Text textStyle="bodySm" color="onSurfaceVariant">
              Pick-up: {leg.pickup}
            </Text>
          </Flex>
        )}
        {leg.destination && (
          <Flex gap="2" align="flex-start">
            <MaterialIcon name="location_on" size={16} color="onSurfaceVariant" />
            <Text textStyle="bodySm" color="onSurfaceVariant">
              Destination: {leg.destination}
            </Text>
          </Flex>
        )}
      </Stack>
    </Box>
  )
}

function StayLeg({ leg }) {
  const days = Number(leg.durationDays)
  const duration =
    Number.isFinite(days) && days > 0 ? `${days} day${days === 1 ? '' : 's'}` : null
  return (
    <Box flex="1">
      <Text textStyle="labelMd" mb="1">
        Stay
      </Text>
      {duration && (
        <Text textStyle="bodySm" color="primary" fontWeight="600" mb="2">
          {duration}
        </Text>
      )}
      {leg.location && (
        <Flex gap="2" align="flex-start" mb={leg.detail ? 2 : 0}>
          <MaterialIcon name="hotel" size={16} color="onSurfaceVariant" />
          <Text textStyle="bodySm" color="onSurfaceVariant">
            {leg.location}
          </Text>
        </Flex>
      )}
      {leg.detail && (
        <Text textStyle="bodySm" color="onSurfaceVariant">
          {leg.detail}
        </Text>
      )}
    </Box>
  )
}

export function ItineraryTimeline({ itinerary, locale, compact = false }) {
  const legs = getFilledLegs(normalizeItinerary(itinerary))

  if (!legs.length) {
    return (
      <Text textStyle="bodySm" color="onSurfaceVariant">
        Itinerary not specified yet.
      </Text>
    )
  }

  return (
    <Stack gap={compact ? '3' : '4'}>
      {legs.map((leg, idx) => (
        <Flex key={leg.id || idx} gap="4" align="flex-start">
          <Stack align="center" gap="1" flexShrink={0}>
            <LegIcon type={leg.type} />
            {idx < legs.length - 1 && (
              <Box w="2px" flex="1" minH="6" bg="outlineVariant" borderRadius="full" />
            )}
          </Stack>
          {leg.type === 'stay' ? <StayLeg leg={leg} /> : <TransferLeg leg={leg} locale={locale} />}
        </Flex>
      ))}
    </Stack>
  )
}
