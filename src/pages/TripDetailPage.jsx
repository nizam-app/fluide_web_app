import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Image,
  Input,
  NativeSelect,
  Spinner,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { PortalLayout } from '../components/templates/PortalLayout'
import { useAuth } from '../context/AuthContext'
import { NEED_TYPE_OPTIONS } from '../data/mockData'
import api from '../lib/api'
import {
  formatDateRange,
  formatPrice,
  getNeedTypeIcon,
  getTripImage,
  initialsFromName,
} from '../lib/format'
import { fluideInputStyles, stitchBlackButton, stitchGreenButton } from '../theme/fluide-theme'

function useTripDetail(id) {
  const [trip, setTrip] = useState(null)
  const [requests, setRequests] = useState([])
  const [offersByRequest, setOffersByRequest] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [tripResult, requestsResult] = await Promise.all([
        api.trips.get(id),
        api.requests.list({ trip: id }),
      ])
      setTrip(tripResult.trip)
      const reqs = requestsResult.requests || []
      setRequests(reqs)

      const offerResults = await Promise.all(
        reqs.map((r) => api.requests.listOffers(r._id).catch(() => ({ offers: [] }))),
      )
      const map = {}
      reqs.forEach((req, idx) => {
        map[req._id] = offerResults[idx].offers || []
      })
      setOffersByRequest(map)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const promise = Promise.resolve().then(() => load())
    return () => {
      promise.catch(() => {})
    }
  }, [load])

  return { trip, requests, offersByRequest, loading, error, reload: load }
}

function OfferRow({ offer, onAccept, onReject, onWithdraw, canManage, canWithdraw, busy }) {
  return (
    <Flex
      bg="surface"
      p="5"
      borderRadius="fluide3xl"
      borderWidth="1px"
      borderColor="outlineVariant"
      gap="4"
      flexWrap="wrap"
      align="center"
    >
      <Flex w="12" h="12" borderRadius="full" bg="surfaceContainer" align="center" justify="center">
        <MaterialIcon name="local_offer" color="primary" />
      </Flex>
      <Box flex="1" minW="220px">
        <Flex align="center" gap="2" mb="1">
          <Text textStyle="labelMd">{offer.provider?.name || 'Provider'}</Text>
          <StatusBadge status={offer.status} />
        </Flex>
        <Text textStyle="bodySm" color="onSurfaceVariant">
          {offer.description}
        </Text>
        {offer.provider?.providerType && (
          <Text textStyle="labelSm" color="onSurfaceVariant" mt="1">
            {offer.provider.providerType}
          </Text>
        )}
      </Box>
      <Text textStyle="headlineSm" color="primary" fontWeight="700">
        {formatPrice(offer.price, offer.currency)}
      </Text>
      {canManage && offer.status === 'submitted' && (
        <HStack>
          <Button size="sm" {...stitchGreenButton} loading={busy} onClick={() => onAccept(offer)}>
            Accept
          </Button>
          <Button size="sm" variant="outline" borderRadius="pill" loading={busy} onClick={() => onReject(offer)}>
            Reject
          </Button>
        </HStack>
      )}
      {canWithdraw && offer.status === 'submitted' && (
        <Button size="sm" variant="outline" borderRadius="pill" loading={busy} onClick={() => onWithdraw(offer)}>
          Withdraw
        </Button>
      )}
    </Flex>
  )
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ACCEPTED_MIME = 'image/jpeg,image/png,image/webp,image/gif'

function ChangeCoverButton({ tripId, onChanged }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (event) => {
    setError('')
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please pick an image file.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Image is too large. Max size is 5 MB.')
      return
    }
    setBusy(true)
    try {
      await api.trips.uploadImage(tripId, file)
      await onChanged()
    } catch (err) {
      setError(err?.message || 'Could not upload the image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Input type="file" ref={inputRef} accept={ACCEPTED_MIME} onChange={handleFile} display="none" />
      <Button
        size="sm"
        variant="solid"
        bg="surface"
        color="onSurface"
        borderRadius="pill"
        loading={busy}
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        <MaterialIcon name="photo_camera" size={16} />
        Change cover
      </Button>
      {error && (
        <Text mt="2" textStyle="bodySm" color="error">
          {error}
        </Text>
      )}
    </>
  )
}

function OrganizerNewRequestForm({ tripId, existingNeedTypes, onCreated }) {
  const remaining = NEED_TYPE_OPTIONS.filter((n) => !existingNeedTypes.includes(n))
  const [needType, setNeedType] = useState(remaining[0] || NEED_TYPE_OPTIONS[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.requests.create({
        trip: tripId,
        needType,
        message: message.trim() || undefined,
      })
      setMessage('')
      await onCreated()
    } catch (err) {
      setError(err?.message || 'Could not create the service request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg="surface"
      borderRadius="fluide3xl"
      p="6"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="outlineVariant"
    >
      <Text textStyle="labelMd" mb="2">
        Open a new service request
      </Text>
      <Text textStyle="bodySm" color="onSurfaceVariant" mb="4">
        Notify suppliers that you need a specific service for this trip. They will reply with offers.
      </Text>
      <Grid templateColumns={{ base: '1fr', sm: '1fr 2fr auto' }} gap="3" alignItems="end">
        <Box>
          <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
            Need type
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              css={fluideInputStyles}
              value={needType}
              onChange={(e) => setNeedType(e.target.value)}
            >
              {NEED_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Box>
        <Box>
          <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
            Message (optional)
          </Text>
          <Input
            placeholder="Add context for suppliers…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            css={fluideInputStyles}
          />
        </Box>
        <Button type="submit" {...stitchBlackButton} px="6" loading={submitting} disabled={submitting}>
          <MaterialIcon name="add" size={18} />
          Open
        </Button>
      </Grid>
      {error && (
        <Text mt="3" textStyle="bodySm" color="error">
          {error}
        </Text>
      )}
    </Box>
  )
}

function ProviderOfferForm({ requestId, onSubmitted }) {
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const priceValue = Number(price)
    if (!description.trim() || !Number.isFinite(priceValue) || priceValue < 0) {
      setError('Please provide a description and a valid price.')
      return
    }
    setSubmitting(true)
    try {
      await api.requests.createOffer(requestId, {
        description: description.trim(),
        price: priceValue,
        currency: currency.trim().toUpperCase() || 'EUR',
      })
      setDescription('')
      setPrice('')
      await onSubmitted()
    } catch (err) {
      setError(err?.message || 'Could not submit your offer.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit} bg="secondaryContainer" borderRadius="fluide3xl" p="6">
      <Text textStyle="headlineSm" mb="4" color="onSecondaryContainer">
        Submit a proposal
      </Text>
      <Text textStyle="labelMd" mb="2" color="onSecondaryContainer">
        Offer message
      </Text>
      <Textarea
        rows={3}
        borderRadius="fluide"
        borderColor="outlineVariant"
        bg="surface"
        mb="4"
        placeholder="Describe your service and terms…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4" mb="4">
        <Box>
          <Text textStyle="labelMd" mb="2" color="onSecondaryContainer">
            Price
          </Text>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="450.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            css={fluideInputStyles}
          />
        </Box>
        <Box>
          <Text textStyle="labelMd" mb="2" color="onSecondaryContainer">
            Currency
          </Text>
          <Input
            maxLength={3}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            css={fluideInputStyles}
          />
        </Box>
      </Grid>
      {error && (
        <Text textStyle="bodySm" color="error" mb="3">
          {error}
        </Text>
      )}
      <Button type="submit" {...stitchGreenButton} loading={submitting} disabled={submitting}>
        <MaterialIcon name="send" size={18} />
        Send proposal
      </Button>
    </Box>
  )
}

function RequestSection({ request, offers, role, currentUserId, onChange }) {
  const [busyOfferId, setBusyOfferId] = useState(null)

  const accept = async (offer) => {
    setBusyOfferId(offer._id)
    try {
      await api.offers.updateStatus(offer._id, 'accepted')
      await onChange()
    } catch (err) {
      window.alert(err?.message || 'Could not accept the offer.')
    } finally {
      setBusyOfferId(null)
    }
  }
  const reject = async (offer) => {
    setBusyOfferId(offer._id)
    try {
      await api.offers.updateStatus(offer._id, 'rejected')
      await onChange()
    } catch (err) {
      window.alert(err?.message || 'Could not reject the offer.')
    } finally {
      setBusyOfferId(null)
    }
  }
  const withdraw = async (offer) => {
    setBusyOfferId(offer._id)
    try {
      await api.offers.updateStatus(offer._id, 'withdrawn')
      await onChange()
    } catch (err) {
      window.alert(err?.message || 'Could not withdraw the offer.')
    } finally {
      setBusyOfferId(null)
    }
  }

  const providerAlreadyOffered = useMemo(
    () =>
      role === 'provider' &&
      offers.some(
        (o) => String(o.provider?._id || o.provider) === String(currentUserId) && o.status !== 'withdrawn',
      ),
    [offers, role, currentUserId],
  )

  return (
    <Box
      bg="surface"
      borderRadius="fluide3xl"
      borderWidth="1px"
      borderColor="outlineVariant"
      p="6"
      shadow="level1"
    >
      <Flex justify="space-between" align="flex-start" mb="4" flexWrap="wrap" gap="3">
        <HStack gap="3" align="center">
          <Flex w="11" h="11" borderRadius="full" bg="primaryContainer" align="center" justify="center">
            <MaterialIcon name={getNeedTypeIcon(request.needType)} color="primary" />
          </Flex>
          <Box>
            <Text textStyle="labelMd">{request.needType}</Text>
            <Text textStyle="bodySm" color="onSurfaceVariant">
              {request.message || 'No additional message.'}
            </Text>
          </Box>
        </HStack>
        <StatusBadge status={request.status} />
      </Flex>

      {offers.length > 0 && (
        <Stack gap="3" mb={role === 'provider' && !providerAlreadyOffered && request.status === 'pending' ? '6' : '0'}>
          {offers.map((offer) => (
            <OfferRow
              key={offer._id}
              offer={offer}
              busy={busyOfferId === offer._id}
              canManage={role === 'organizer' && request.status === 'pending'}
              canWithdraw={
                role === 'provider' &&
                String(offer.provider?._id || offer.provider) === String(currentUserId) &&
                request.status === 'pending'
              }
              onAccept={accept}
              onReject={reject}
              onWithdraw={withdraw}
            />
          ))}
        </Stack>
      )}

      {role === 'provider' && request.status === 'pending' && !providerAlreadyOffered && (
        <ProviderOfferForm requestId={request._id} onSubmitted={onChange} />
      )}
      {role === 'provider' && providerAlreadyOffered && (
        <Text textStyle="bodySm" color="onSurfaceVariant" mt="2">
          You have already submitted an offer for this request.
        </Text>
      )}
      {offers.length === 0 && role !== 'provider' && (
        <Text textStyle="bodySm" color="onSurfaceVariant">
          No offers yet for this request.
        </Text>
      )}
    </Box>
  )
}

export function TripDetailPage() {
  const { isOrganizer, isProvider, isAdmin, user } = useAuth()
  const { id } = useParams()
  const { trip, requests, offersByRequest, loading, error, reload } = useTripDetail(id)

  const role = isAdmin ? 'admin' : isProvider ? 'provider' : 'organizer'
  const backTo = isAdmin ? '/admin/trips' : '/trips'
  const backLabel = isAdmin ? 'Back to All Trips' : isProvider ? 'Back to Available Trips' : 'Back to My Trips'

  if (loading) {
    return (
      <PortalLayout>
        <Flex p="20" justify="center">
          <Spinner color="primary" />
        </Flex>
      </PortalLayout>
    )
  }

  if (error || !trip) {
    return (
      <PortalLayout>
        <Box p="10" textAlign="center">
          <Text textStyle="bodyMd" color="error" mb="4">
            {error?.message || 'Trip not found.'}
          </Text>
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
        <RolePageHeader role={role} />
        <RouterLink to={backTo}>
          <Flex
            align="center"
            gap="1"
            textStyle="labelMd"
            color="onSurfaceVariant"
            mb="6"
            w="fit-content"
            _hover={{ color: 'primary' }}
          >
            <MaterialIcon name="arrow_back" size={18} />
            {backLabel}
          </Flex>
        </RouterLink>

        <Flex justify="space-between" align="flex-start" mb="8" flexWrap="wrap" gap="4">
          <Box>
            <HStack gap="3" mb="3">
              <StatusBadge status={trip.status} />
              <Text textStyle="labelSm" color="onSurfaceVariant">
                ID: #{String(trip._id).slice(-6).toUpperCase()}
              </Text>
            </HStack>
            <Text textStyle="headlineLg">{trip.title}</Text>
          </Box>
          {isAdmin && (
            <Text textStyle="bodySm" color="onSurfaceVariant">
              Read-only platform view
            </Text>
          )}
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="8">
          <Stack gap="6">
            <Box bg="surface" borderRadius="fluide3xl" overflow="hidden" borderWidth="1px" borderColor="outlineVariant">
              <Box position="relative" h="56">
                <Image src={getTripImage(trip)} alt={trip.title} w="full" h="full" objectFit="cover" />
                <HStack position="absolute" bottom="4" left="4" gap="2">
                  <Flex align="center" gap="1" bg="surface" px="3" py="1" borderRadius="pill" textStyle="labelSm">
                    <MaterialIcon name="calendar_today" size={14} />
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </Flex>
                  <Flex align="center" gap="1" bg="surface" px="3" py="1" borderRadius="pill" textStyle="labelSm">
                    <MaterialIcon name="location_on" size={14} />
                    {trip.location}
                  </Flex>
                </HStack>
                {isOrganizer && String(trip.organizer?._id || trip.organizer) === String(user?._id) && (
                  <Box position="absolute" top="4" right="4">
                    <ChangeCoverButton tripId={trip._id} onChanged={reload} />
                  </Box>
                )}
              </Box>
              <Box p="6">
                <Text textStyle="headlineSm" mb="3">
                  Trip Description
                </Text>
                <Text textStyle="bodyMd" color="onSurfaceVariant" mb="6">
                  {trip.description}
                </Text>
                <Grid templateColumns={{ base: '1fr 1fr', sm: 'repeat(2, 1fr)' }} gap="3">
                  {[
                    { label: 'Participants', value: trip.participants },
                    { label: 'Need types', value: (trip.needTypes || []).join(', ') || '—', green: true },
                    {
                      label: 'Budget estimate',
                      value:
                        trip.budgetEstimate != null
                          ? formatPrice(trip.budgetEstimate, trip.budgetCurrency || 'EUR')
                          : '—',
                    },
                    { label: 'Accessibility', value: trip.accessibility || '—' },
                    { label: 'Status', value: trip.status },
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

            <Box>
              <Flex align="center" gap="3" mb="4">
                <Text textStyle="headlineSm">Service requests</Text>
                <Box bg="infoBg" color="infoFg" px="3" py="1" borderRadius="pill" textStyle="labelSm" fontWeight="600">
                  {requests.length} {requests.length === 1 ? 'request' : 'requests'}
                </Box>
              </Flex>

              <Stack gap="5">
                {requests.map((req) => (
                  <RequestSection
                    key={req._id}
                    request={req}
                    offers={offersByRequest[req._id] || []}
                    role={role}
                    currentUserId={user?._id}
                    onChange={reload}
                  />
                ))}
                {requests.length === 0 && !isOrganizer && (
                  <Box bg="surface" p="6" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant">
                    <Text textStyle="bodySm" color="onSurfaceVariant">
                      No service requests yet for this trip.
                    </Text>
                  </Box>
                )}
                {isOrganizer && String(trip.organizer?._id || trip.organizer) === String(user?._id) && (
                  <OrganizerNewRequestForm
                    tripId={trip._id}
                    existingNeedTypes={requests.map((r) => r.needType)}
                    onCreated={reload}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          <Stack gap="4">
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
                {initialsFromName(trip.organizer?.name) || '—'}
              </Flex>
              <Text textStyle="labelMd">{trip.organizer?.name || 'Organizer'}</Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="3">
                {trip.organizer?.organizationType || ''}
              </Text>
            </Box>

            <Box bg="surface" borderRadius="fluide3xl" p="6" borderWidth="1px" borderColor="outlineVariant">
              <Text textStyle="labelMd" mb="4">
                Itinerary
              </Text>
              {(trip.itinerary || []).length > 0 ? (
                <Stack gap="3">
                  {(trip.itinerary || []).map((item, idx) => (
                    <Flex key={`${item.label}-${idx}`} gap="3" align="flex-start">
                      <Box
                        w="3"
                        h="3"
                        borderRadius="full"
                        bg={item.type === 'pickup' ? 'primary' : 'error'}
                        mt="1.5"
                        flexShrink={0}
                      />
                      <Box>
                        <Text textStyle="labelMd">{item.label}</Text>
                        <Text textStyle="bodySm" color="onSurfaceVariant">
                          {item.detail}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              ) : (
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  Itinerary not specified yet.
                </Text>
              )}
            </Box>
          </Stack>
        </Grid>
      </Box>
    </PortalLayout>
  )
}
