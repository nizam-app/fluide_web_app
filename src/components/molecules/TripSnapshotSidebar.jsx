import { Box, Flex, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { formatDateRange, formatPrice, getNeedTypeIcon, initialsFromName } from '../../lib/format'
import { BOOKING_MODES, getFilledLegs, normalizeItinerary } from '../../lib/itinerary'
import { fromApiNeedTypes } from '../../lib/needTypes'
import { SERVICE_NEED_CONFIG } from '../../lib/servicePlan'

function SnapshotRow({ icon, label, value }) {
  if (value == null || value === '' || value === '—') return null
  return (
    <Flex gap="3" align="flex-start">
      <Flex
        w="9"
        h="9"
        borderRadius="lg"
        bg="surfaceContainerLow"
        align="center"
        justify="center"
        flexShrink={0}
      >
        <MaterialIcon name={icon} size={18} color="primary" />
      </Flex>
      <Box minW="0" flex="1">
        <Text textStyle="labelSm" color="onSurfaceVariant" mb="0.5">
          {label}
        </Text>
        <Text textStyle="labelMd" fontWeight="600">
          {value}
        </Text>
      </Box>
    </Flex>
  )
}

function StatTile({ label, value, accent }) {
  return (
    <Box bg="surfaceContainerLow" borderRadius="lg" p="3" textAlign="center">
      <Text textStyle="headlineSm" color={accent ? 'primary' : 'onSurface'} fontWeight="700">
        {value}
      </Text>
      <Text textStyle="labelSm" color="onSurfaceVariant" mt="0.5">
        {label}
      </Text>
    </Box>
  )
}

export function TripOrganizerCard({ organizer }) {
  return (
    <Box
      bg="surface"
      borderRadius="fluide3xl"
      p="6"
      borderWidth="1px"
      borderColor="outlineVariant"
      textAlign="center"
    >
      <Flex
        w="16"
        h="16"
        borderRadius="full"
        bg="primaryContainer"
        mx="auto"
        mb="3"
        align="center"
        justify="center"
        textStyle="headlineMd"
        color="primary"
        fontWeight="700"
      >
        {initialsFromName(organizer?.name) || '—'}
      </Flex>
      <Text textStyle="labelMd">{organizer?.name || 'Organizer'}</Text>
      {organizer?.organizationType ? (
        <Text textStyle="bodySm" color="onSurfaceVariant" mt="1">
          {organizer.organizationType}
        </Text>
      ) : null}
    </Box>
  )
}

export function TripSnapshotSidebar({ trip, requests = [], totalOffers = 0 }) {
  const legs = getFilledLegs(normalizeItinerary(trip.itinerary || []))
  const transferCount = legs.filter((leg) => leg.type === 'transfer').length
  const stayCount = legs.filter((leg) => leg.type === 'stay').length
  const pendingRequests = requests.filter((req) => req.status === 'pending').length
  const needTypes = fromApiNeedTypes(trip.needTypes || [])
  const showActivity = requests.length > 0 || totalOffers > 0

  const budgetLabel =
    trip.budgetEstimate != null
      ? formatPrice(trip.budgetEstimate, trip.budgetCurrency || 'EUR')
      : null
  const costLabel =
    trip.costPerParticipant != null
      ? formatPrice(trip.costPerParticipant, trip.budgetCurrency || 'EUR')
      : null

  return (
    <Stack gap="4">
      <TripOrganizerCard organizer={trip.organizer} />

      <Box bg="surface" borderRadius="fluide3xl" p="6" borderWidth="1px" borderColor="outlineVariant">
        <Text
          textStyle="labelSm"
          color="onSurfaceVariant"
          textTransform="uppercase"
          letterSpacing="wider"
          mb="4"
          fontWeight="600"
        >
          Trip overview
        </Text>
        <Stack gap="3">
          <SnapshotRow icon="calendar_today" label="Dates" value={formatDateRange(trip.startDate, trip.endDate)} />
          <SnapshotRow icon="location_on" label="Location" value={trip.location} />
          <SnapshotRow
            icon="groups"
            label="Participants"
            value={
              trip.joinedCount != null
                ? `${trip.joinedCount} joined · ${trip.participants} total`
                : String(trip.participants ?? '')
            }
          />
          <SnapshotRow
            icon="inventory_2"
            label="Booking"
            value={trip.bookingMode === BOOKING_MODES.BUNDLED ? 'Full package' : 'Multiple providers'}
          />
          {budgetLabel ? <SnapshotRow icon="payments" label="Budget estimate" value={budgetLabel} /> : null}
          {costLabel ? <SnapshotRow icon="person" label="Cost per participant" value={costLabel} /> : null}
          {trip.accessibility ? (
            <SnapshotRow icon="accessible" label="Accessibility" value={trip.accessibility} />
          ) : null}
        </Stack>

        {needTypes.length > 0 ? (
          <Box mt="4" pt="4" borderTopWidth="1px" borderColor="outlineVariant">
            <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
              Services needed
            </Text>
            <HStack gap="2" flexWrap="wrap">
              {needTypes.map((type) => (
                <Flex
                  key={type}
                  align="center"
                  gap="1"
                  px="2.5"
                  py="1"
                  bg="primaryContainer"
                  color="onPrimaryContainer"
                  borderRadius="md"
                  textStyle="labelSm"
                  fontWeight="600"
                >
                  <MaterialIcon name={getNeedTypeIcon(type)} size={14} />
                  {type}
                </Flex>
              ))}
            </HStack>
          </Box>
        ) : null}

        {trip.servicePlan?.needs?.length > 0 ? (
          <Box mt="4" pt="4" borderTopWidth="1px" borderColor="outlineVariant">
            <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
              Service details
            </Text>
            {(trip.servicePlan.serviceDate || trip.servicePlan.timeFrom || trip.servicePlan.timeTo) && (
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="2">
                {[
                  trip.servicePlan.serviceDate,
                  trip.servicePlan.timeFrom && trip.servicePlan.timeTo
                    ? `${trip.servicePlan.timeFrom} – ${trip.servicePlan.timeTo}`
                    : trip.servicePlan.timeFrom || trip.servicePlan.timeTo,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            )}
            <Stack gap="2">
              {trip.servicePlan.needs.map((need) => {
                const uiType = fromApiNeedType(need.needType) || need.needType
                const config = SERVICE_NEED_CONFIG[uiType]
                const detail = [
                  need.pickup && need.destination
                    ? `${need.pickup} → ${need.destination}`
                    : need.pickup || need.destination,
                  need.venueName,
                  need.details,
                ]
                  .filter(Boolean)
                  .join(' · ')
                if (!detail) return null
                return (
                  <Text key={`${uiType}-${detail}`} textStyle="bodySm">
                    <Text as="span" fontWeight="600" color="primary">
                      {config?.label || uiType}:
                    </Text>{' '}
                    {detail}
                  </Text>
                )
              })}
            </Stack>
          </Box>
        ) : null}
      </Box>

      {showActivity ? (
        <Box bg="surface" borderRadius="fluide3xl" p="6" borderWidth="1px" borderColor="outlineVariant">
          <Text textStyle="labelMd" mb="4" fontWeight="600">
            Activity
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap="2">
            <StatTile label="Requests" value={requests.length} />
            <StatTile label="Offers" value={totalOffers} accent />
            <StatTile label="Pending" value={pendingRequests} />
          </Grid>
        </Box>
      ) : null}

      {legs.length > 0 ? (
        <Box bg="surface" borderRadius="fluide3xl" p="6" borderWidth="1px" borderColor="outlineVariant">
          <Text textStyle="labelMd" mb="2" fontWeight="600">
            Itinerary
          </Text>
          <Text textStyle="bodySm" color="onSurfaceVariant">
            {legs.length} step{legs.length === 1 ? '' : 's'}
            {transferCount > 0 || stayCount > 0
              ? ` · ${transferCount} transfer${transferCount === 1 ? '' : 's'}, ${stayCount} stay${stayCount === 1 ? '' : 's'}`
              : ''}
          </Text>
        </Box>
      ) : null}
    </Stack>
  )
}
