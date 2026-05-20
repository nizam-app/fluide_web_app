import { Box, Button, Flex, Grid, HStack, Image, Input, NativeSelect, Stack, Text, Textarea } from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { PortalLayout } from '../components/templates/PortalLayout'
import { useAuth } from '../context/AuthContext'
import { TRIP_HERO_IMAGE, tripDetails, trips } from '../data/mockData'
import { fluideInputStyles, stitchGreenButton } from '../theme/fluide-theme'

export function TripDetailPage() {
  const { isOrganizer, isProvider, isAdmin } = useAuth()
  const { id } = useParams()
  const backTo = isAdmin ? '/admin/trips' : isProvider ? '/trips' : '/trips'
  const backLabel = isAdmin ? 'Back to All Trips' : isProvider ? 'Back to Available Trips' : 'Back to My Trips'
  const headerRole = isAdmin ? 'admin' : isProvider ? 'provider' : 'organizer'
  const trip = tripDetails[id] ?? {
    ...trips.find((t) => t.id === id),
    ref: 'FL-2904',
    description: trips.find((t) => t.id === id)?.description ?? '',
    participants: 24,
    needType: 'Private Bus',
    accessibility: 'High',
    duration: '6h',
    organizer: { name: 'Marie Laurent' },
    offers: [],
    itinerary: [],
    timeline: [],
    image: TRIP_HERO_IMAGE,
    status: 'active',
  }

  if (!trip?.title) {
    return (
      <PortalLayout>
        <Box p="10" textAlign="center">
          <RouterLink to={backTo}>
            <Button {...stitchGreenButton}>{backLabel}</Button>
          </RouterLink>
        </Box>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role={headerRole} />
        <RouterLink to={backTo}>
          <Flex align="center" gap="1" textStyle="labelMd" color="onSurfaceVariant" mb="6" w="fit-content" _hover={{ color: 'primary' }}>
            <MaterialIcon name="arrow_back" size={18} />
            {backLabel}
          </Flex>
        </RouterLink>

        <Flex justify="space-between" align="flex-start" mb="8" flexWrap="wrap" gap="4">
          <Box>
            <HStack gap="3" mb="3">
              <StatusBadge status={trip.status} label="Active Request" />
              <Text textStyle="labelSm" color="onSurfaceVariant">
                ID: #{trip.ref ?? 'FL-2904'}
              </Text>
            </HStack>
            <Text textStyle="headlineLg">{trip.title}</Text>
          </Box>
          {isProvider && (
            <Button {...stitchGreenButton} px="6">
              <MaterialIcon name="send" size={18} />
              Respond to Request
            </Button>
          )}
          {isAdmin && (
            <Text textStyle="bodySm" color="onSurfaceVariant">
              Read-only platform view
            </Text>
          )}
          {isOrganizer && trip.offers?.length > 0 && (
            <Text textStyle="bodySm" color="onSurfaceVariant">
              Review provider offers below
            </Text>
          )}
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="8">
          <Stack gap="6">
            <Box bg="surface" borderRadius="fluide3xl" overflow="hidden" borderWidth="1px" borderColor="outlineVariant">
              <Box position="relative" h="56">
                <Image src={trip.image ?? TRIP_HERO_IMAGE} alt={trip.title} w="full" h="full" objectFit="cover" />
                <HStack position="absolute" bottom="4" left="4" gap="2">
                  <Flex align="center" gap="1" bg="surface" px="3" py="1" borderRadius="pill" textStyle="labelSm">
                    <MaterialIcon name="calendar_today" size={14} />
                    {trip.dates}
                  </Flex>
                  <Flex align="center" gap="1" bg="surface" px="3" py="1" borderRadius="pill" textStyle="labelSm">
                    <MaterialIcon name="location_on" size={14} />
                    {trip.location}
                  </Flex>
                </HStack>
              </Box>
              <Box p="6">
                <Text textStyle="headlineSm" mb="3">
                  Trip Description
                </Text>
                <Text textStyle="bodyMd" color="onSurfaceVariant" mb="6">
                  {trip.description}
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap="3">
                  {[
                    { label: 'Participants', value: trip.participants },
                    { label: 'Need Type', value: trip.needType, green: true },
                    { label: 'Accessibility', value: trip.accessibility },
                    { label: 'Duration', value: trip.duration },
                  ].map((d) => (
                    <Box key={d.label} bg="infoBg" p="4" borderRadius="fluide">
                      <Text textStyle="labelSm" color="onSurfaceVariant" mb="1">
                        {d.label}
                      </Text>
                      <Text textStyle="labelMd" color={d.green ? 'primary' : 'onSurface'} fontWeight="700">
                        {d.value}
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
            </Box>

            {isOrganizer && trip.offers?.length > 0 && (
              <Box>
                <Flex align="center" gap="3" mb="4">
                  <Text textStyle="headlineSm">Provider Responses</Text>
                  <Box bg="infoBg" color="infoFg" px="3" py="1" borderRadius="pill" textStyle="labelSm" fontWeight="600">
                    {trip.offers.length} Offers Found
                  </Box>
                </Flex>
                <Stack gap="4">
                  {trip.offers.map((offer) => (
                    <Flex key={offer.provider} bg="surface" p="5" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" gap="4" flexWrap="wrap">
                      <Flex w="12" h="12" borderRadius="full" bg="surfaceContainer" align="center" justify="center">
                        <MaterialIcon name={offer.icon} color="primary" />
                      </Flex>
                      <Box flex="1">
                        <Text textStyle="labelMd">{offer.provider}</Text>
                        <Text textStyle="bodySm" color="onSurfaceVariant">
                          {offer.description}
                        </Text>
                      </Box>
                      <Text textStyle="headlineSm" color="primary" fontWeight="700">
                        {offer.price}
                      </Text>
                      <HStack>
                        <Button {...stitchGreenButton} size="sm">
                          Accept Response
                        </Button>
                        <Button variant="outline" borderRadius="pill" size="sm">
                          Reject Response
                        </Button>
                      </HStack>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            )}

            {isProvider && (
            <Box bg="secondaryContainer" borderRadius="fluide3xl" p="6">
              <Text textStyle="headlineSm" mb="4" color="onSecondaryContainer">
                Provider response form
              </Text>
              <Text textStyle="labelMd" mb="2" color="onSecondaryContainer">
                Offer message
              </Text>
              <Textarea rows={3} borderRadius="fluide" borderColor="outlineVariant" bg="surface" mb="4" placeholder="Describe your service and terms..." />
              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4" mb="4">
                <Box>
                  <Text textStyle="labelMd" mb="2" color="onSecondaryContainer">
                    Estimated price (€)
                  </Text>
                  <Input placeholder="450.00" css={fluideInputStyles} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2" color="onSecondaryContainer">
                    Availability
                  </Text>
                  <Input placeholder="e.g. Oct 12, 08:00–18:00" css={fluideInputStyles} />
                </Box>
              </Grid>
              <Button {...stitchGreenButton} borderRadius="pill">
                <MaterialIcon name="send" size={18} />
                Send Response
              </Button>
            </Box>
            )}
          </Stack>

          <Stack gap="4">
            <Box bg="surface" borderRadius="fluide3xl" p="6" borderWidth="1px" borderColor="outlineVariant" textAlign="center">
              <Flex w="16" h="16" borderRadius="full" bg="primaryContainer" mx="auto" mb="3" align="center" justify="center" textStyle="headlineMd" color="primary" fontWeight="700">
                ML
              </Flex>
              <Text textStyle="labelMd">{trip.organizer?.name ?? 'Marie Laurent'}</Text>
              <Button variant="outline" borderRadius="pill" mt="4" w="full" borderColor="outlineVariant">
                Message Marie
              </Button>
            </Box>

            <Box bg="surface" borderRadius="fluide3xl" p="6" borderWidth="1px" borderColor="outlineVariant">
              <Text textStyle="labelMd" mb="4">
                Itinerary
              </Text>
              <Box h="32" bg="surfaceContainer" borderRadius="fluide" mb="4" display="flex" alignItems="center" justifyContent="center">
                <MaterialIcon name="map" size={40} color="infoFg" />
              </Box>
              <Stack gap="3">
                {(trip.itinerary?.length ? trip.itinerary : [{ label: 'Pickup Point', detail: 'School Gate', type: 'pickup' }, { label: 'Destination', detail: 'Museum', type: 'destination' }]).map((item) => (
                  <Flex key={item.label} gap="3" align="flex-start">
                    <Box w="3" h="3" borderRadius="full" bg={item.type === 'pickup' ? 'primary' : 'error'} mt="1.5" flexShrink={0} />
                    <Box>
                      <Text textStyle="labelMd">{item.label}</Text>
                      <Text textStyle="bodySm" color="onSurfaceVariant">
                        {item.detail}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Box>

            <Box bg="surface" borderRadius="fluide3xl" p="6" borderWidth="1px" borderColor="outlineVariant">
              <Text textStyle="labelMd" mb="4">
                Timeline
              </Text>
              <Stack gap="4">
                {(trip.timeline?.length ? trip.timeline : []).map((step) => (
                  <Flex key={step.label} gap="3" align="center">
                    <MaterialIcon
                      name={step.done ? 'check_circle' : step.current ? 'radio_button_partial' : 'radio_button_unchecked'}
                      color={step.done ? 'primary' : step.current ? 'infoFg' : 'outline'}
                      filled={step.done}
                    />
                    <Text textStyle="bodySm" color={step.done || step.current ? 'onSurface' : 'onSurfaceVariant'} fontWeight={step.current ? '600' : '400'}>
                      {step.label}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Box>
    </PortalLayout>
  )
}
