import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { ItineraryTimeline } from '../components/molecules/ItineraryTimeline'
import { TripSnapshotSidebar } from '../components/molecules/TripSnapshotSidebar'
import { FavoriteProviderButton } from '../components/molecules/FavoriteProviderButton'
import { RequestHistoryPanel } from '../components/molecules/RequestHistoryPanel'
import { RequestMessagesPanel } from '../components/molecules/RequestMessagesPanel'
import { buildRequestSummaryRows, RequestSummaryModal } from '../components/molecules/RequestSummaryModal'
import { TripCover } from '../components/molecules/TripCover'
import { NeedTypePicker } from '../components/molecules/NeedTypePicker'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { NEED_TYPE_OPTIONS } from '../data/mockData'
import api from '../lib/api'
import { BOOKING_MODES, bundledRequestMessage } from '../lib/itinerary'
import { normalizeRequest, normalizeTrip, toApiNeedType } from '../lib/needTypes'
import { getRequestDisplayStatus } from '../lib/requestStatus'
import {
  formatPrice,
  getNeedTypeIcon,
} from '../lib/format'
import { fluideInputStyles, stitchBlackButton, stitchGreenButton } from '../theme/fluide-theme'
import { cacheProviderProfile } from './ProviderProfilePage'

function useTripDetail(id) {
  const [trip, setTrip] = useState(null)
  const [requests, setRequests] = useState([])
  const [offersByRequest, setOffersByRequest] = useState({})
  const [recommendedProviders, setRecommendedProviders] = useState([])
  const [favoriteProviderIds, setFavoriteProviderIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const activeRef = useRef(true)

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!id) return
    if (!silent) {
      setLoading(true)
      setError(null)
    }
    try {
      const [tripResult, requestsResult, providersResult, favoritesResult] = await Promise.all([
        api.trips.get(id),
        api.requests.list({ trip: id }),
        api.trips.recommendedProviders(id).catch(() => ({ providers: [] })),
        api.favorites.list().catch(() => ({ providers: [] })),
      ])
      if (!activeRef.current) return
      setTrip(normalizeTrip(tripResult.trip))
      const reqs = (requestsResult.requests || []).map(normalizeRequest)
      setRequests(reqs)

      const offerResults = await Promise.all(
        reqs.map((r) => api.requests.listOffers(r._id).catch(() => ({ offers: [] }))),
      )
      if (!activeRef.current) return
      const map = {}
      reqs.forEach((req, idx) => {
        map[req._id] = offerResults[idx].offers || []
      })
      setOffersByRequest(map)
      setRecommendedProviders(providersResult.providers || [])
      setFavoriteProviderIds((favoritesResult.providers || []).map((p) => String(p._id)))
    } catch (err) {
      if (activeRef.current) setError(err)
    } finally {
      if (!silent && activeRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    activeRef.current = true
    const promise = Promise.resolve().then(() => load())
    return () => {
      activeRef.current = false
      promise.catch(() => {})
    }
  }, [load])

  return { trip, requests, offersByRequest, recommendedProviders, favoriteProviderIds, loading, error, reload: load }
}

function OfferRow({ offer, onAccept, onReject, onWithdraw, canManage, canWithdraw, busy }) {
  const providerId = offer.provider?._id || offer.provider

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
          {providerId ? (
            <RouterLink
              to={`/providers/${providerId}`}
              state={{ provider: offer.provider }}
              onClick={() => cacheProviderProfile(offer.provider)}
            >
              <Text textStyle="labelMd" color="primary" fontWeight="600" _hover={{ textDecoration: 'underline' }}>
                {offer.provider?.name || 'Provider'}
              </Text>
            </RouterLink>
          ) : (
            <Text textStyle="labelMd">{offer.provider?.name || 'Provider'}</Text>
          )}
          <StatusBadge status={offer.status} />
          {offer.tier === 'recommended' && (
            <Text textStyle="labelSm" color="primary" fontWeight="700">
              Recommended
            </Text>
          )}
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

function TripBackLink({ to, label }) {
  return (
    <Flex
      as="button"
      type="button"
      onClick={() => {
        // Client router can leave trip detail mounted while the URL is already /trips.
        window.location.assign(to)
      }}
      align="center"
      gap="1"
      textStyle="labelMd"
      color="onSurfaceVariant"
      mb="6"
      w="fit-content"
      cursor="pointer"
      bg="transparent"
      border="none"
      p="0"
      _hover={{ color: 'primary' }}
    >
      <MaterialIcon name="arrow_back" size={18} />
      {label}
    </Flex>
  )
}

function DeleteTripButton({ tripId, tripTitle, requestCount, offerCount, backTo }) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const hasActivity = requestCount > 0 || offerCount > 0

  const handleDelete = async () => {
    if (!tripId) {
      setError('Trip ID is missing — refresh the page and try again.')
      return
    }

    setDeleting(true)
    setError('')
    try {
      await api.trips.delete(tripId)
      // Full page navigation — client router can leave the deleted trip view mounted.
      window.location.replace(backTo)
    } catch (err) {
      setError(err?.message || 'Could not delete this trip.')
      setDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        borderColor="error"
        color="error"
        borderRadius="pill"
        px="5"
        py="2"
        size="sm"
        onClick={() => {
          setError('')
          setOpen(true)
        }}
      >
        <MaterialIcon name="delete" size={18} />
        <Box as="span" ml="2">
          Delete trip
        </Box>
      </Button>

      {open && (
        <Box
          position="fixed"
          inset="0"
          zIndex={100}
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px="4"
          onClick={() => !deleting && setOpen(false)}
        >
          <Box
            bg="surface"
            borderRadius="fluide3xl"
            p={{ base: 6, md: 8 }}
            maxW="md"
            w="full"
            shadow="level2"
            borderWidth="1px"
            borderColor="outlineVariant"
            onClick={(e) => e.stopPropagation()}
          >
            <Text textStyle="headlineSm" mb="2">
              Delete this trip?
            </Text>
            <Text textStyle="bodyMd" color="onSurfaceVariant" mb="4" lineHeight="1.6">
              <strong>{tripTitle}</strong> will be permanently removed. This cannot be undone.
            </Text>
            {hasActivity && (
              <Box
                bg="amberBg"
                borderWidth="1px"
                borderColor="amberBorder"
                borderRadius="fluide"
                p="3"
                mb="4"
              >
                <Text textStyle="bodySm" color="amberFg" lineHeight="1.5">
                  This trip has {requestCount} service {requestCount === 1 ? 'request' : 'requests'}
                  {offerCount > 0 && ` and ${offerCount} supplier ${offerCount === 1 ? 'offer' : 'offers'}`}.
                  Deleting will remove them as well.
                </Text>
              </Box>
            )}
            {error && (
              <Text textStyle="bodySm" color="error" mb="4">
                {error}
              </Text>
            )}
            <Flex gap="3" justify="flex-end" flexWrap="wrap">
              <Button
                type="button"
                variant="outline"
                borderRadius="pill"
                px="6"
                onClick={() => setOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                bg="error"
                color="white"
                borderRadius="pill"
                px="6"
                onClick={handleDelete}
                loading={deleting}
                disabled={deleting}
                _hover={{ opacity: 0.9 }}
              >
                Delete permanently
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  )
}

function OrganizerNewRequestForm({ tripId, trip, tripNeedTypes = [], existingNeedTypes, requestCount = 0, onCreated }) {
  const isBundled = trip?.bookingMode === BOOKING_MODES.BUNDLED
  const allowedTypes = tripNeedTypes.length > 0 ? tripNeedTypes : NEED_TYPE_OPTIONS
  const remaining = allowedTypes.filter((n) => !existingNeedTypes.includes(n))
  const [selectedTypes, setSelectedTypes] = useState(remaining)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => {
    setSelectedTypes((prev) => {
      const valid = prev.filter((t) => remaining.includes(t))
      return valid.length ? valid : [...remaining]
    })
  }, [remaining])

  const handleBundledSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (requestCount > 0) {
      setError('The package request for this trip is already open.')
      return
    }
    setPendingAction({ mode: 'bundled' })
    setShowSummary(true)
  }

  const executeBundledSubmit = async () => {
    setSubmitting(true)
    try {
      const allowedTypes = tripNeedTypes.length > 0 ? tripNeedTypes : NEED_TYPE_OPTIONS
      const primaryType = allowedTypes.includes('Accommodation') ? 'Accommodation' : allowedTypes[0]
      await api.requests.create({
        trip: tripId,
        needType: toApiNeedType(primaryType),
        message: [bundledRequestMessage(trip), message.trim()].filter(Boolean).join('\n\n'),
      })
      setMessage('')
      setShowSummary(false)
      setPendingAction(null)
      await onCreated()
    } catch (err) {
      setError(err?.message || 'Could not create the package request.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!remaining.length) {
      setError('All need types for this trip already have an open request.')
      return
    }
    if (!selectedTypes.length) {
      setError('Select at least one need type.')
      return
    }
    const invalid = selectedTypes.filter((t) => !remaining.includes(t))
    if (invalid.length) {
      setError(`Choose need types listed on this trip: ${allowedTypes.join(', ')}.`)
      return
    }

    setPendingAction({ mode: 'multi', types: [...selectedTypes] })
    setShowSummary(true)
  }

  const executeMultiSubmit = async () => {
    const types = pendingAction?.types || selectedTypes
    setSubmitting(true)
    try {
      const trimmedMessage = message.trim() || undefined
      const results = await Promise.allSettled(
        types.map((type) =>
          api.requests.create({
            trip: tripId,
            needType: toApiNeedType(type),
            message: trimmedMessage,
          }),
        ),
      )
      const failed = results.filter((r) => r.status === 'rejected')
      if (failed.length === results.length) {
        const reason = failed[0].reason
        setError(reason?.message || 'Could not create the service request.')
        return
      }
      if (failed.length) {
        setError(
          `${failed.length} of ${results.length} requests could not be opened. The rest were created.`,
        )
      } else {
        setMessage('')
      }
      setShowSummary(false)
      setPendingAction(null)
      await onCreated()
    } catch (err) {
      setError(err?.message || 'Could not create the service request.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isBundled) {
    return (
      <Box
        as="form"
        onSubmit={handleBundledSubmit}
        bg="surface"
        borderRadius="fluide3xl"
        p="6"
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="outlineVariant"
      >
        <Text textStyle="labelMd" mb="2">
          Open package request
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="4">
          This is a full-package group booking. One provider (typically the hotel) handles transport,
          stay, and transfers — you only need a single request.
          {(tripNeedTypes || []).length > 0 && (
            <> Services included: {tripNeedTypes.join(', ')}.</>
          )}
        </Text>
        {requestCount > 0 ? (
          <Text textStyle="bodySm" color="onSurfaceVariant">
            A package request is already open for this trip.
          </Text>
        ) : (
          <Stack gap="4">
            <Box>
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Message (optional)
              </Text>
              <Input
                placeholder="Add context for the provider…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                css={fluideInputStyles}
              />
            </Box>
            <Flex justify="flex-end">
              <Button type="submit" {...stitchBlackButton} px="6" loading={submitting} disabled={submitting}>
                <MaterialIcon name="inventory_2" size={18} />
                Open package request
              </Button>
            </Flex>
          </Stack>
        )}
        {error && (
          <Text mt="3" textStyle="bodySm" color="error">
            {error}
          </Text>
        )}
        <RequestSummaryModal
          open={showSummary}
          title="Confirm package request"
          trip={trip}
          rows={buildRequestSummaryRows({
            needTypes: tripNeedTypes,
            message: message.trim() || undefined,
            statusLabel: 'Pending',
          })}
          confirmLabel="Confirm request"
          loading={submitting}
          onCancel={() => {
            setShowSummary(false)
            setPendingAction(null)
          }}
          onConfirm={executeBundledSubmit}
        />
      </Box>
    )
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
        Notify suppliers that you need services for this trip. Select one or more need types — each
        opens a separate request so the right suppliers can respond.
        {tripNeedTypes.length > 0 && (
          <>
            {' '}
            Only types defined for this trip are shown ({tripNeedTypes.join(', ')}).
          </>
        )}
      </Text>
      {remaining.length === 0 ? (
        <Text textStyle="bodySm" color="onSurfaceVariant">
          Every need type for this trip already has a service request.
        </Text>
      ) : (
        <Stack gap="4">
          <NeedTypePicker
            label="Need types"
            options={remaining}
            value={selectedTypes}
            onChange={setSelectedTypes}
          />
          <Grid templateColumns={{ base: '1fr', sm: '1fr auto' }} gap="3" alignItems="end">
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
            <Button
              type="submit"
              {...stitchBlackButton}
              px="6"
              loading={submitting}
              disabled={submitting || selectedTypes.length === 0}
            >
              <MaterialIcon name="add" size={18} />
              Open {selectedTypes.length > 1 ? `${selectedTypes.length} requests` : 'request'}
            </Button>
          </Grid>
        </Stack>
      )}
      {error && (
        <Text mt="3" textStyle="bodySm" color="error">
          {error}
        </Text>
      )}
      <RequestSummaryModal
        open={showSummary}
        title="Confirm service requests"
        trip={trip}
        rows={buildRequestSummaryRows({
          needTypes: pendingAction?.types || selectedTypes,
          message: message.trim() || undefined,
          statusLabel: 'Pending',
        })}
        confirmLabel="Confirm requests"
        loading={submitting}
        onCancel={() => {
          setShowSummary(false)
          setPendingAction(null)
        }}
        onConfirm={executeMultiSubmit}
      />
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

function RequestSection({ request, offers, role, currentUserId, trip, onChange }) {
  const [busyOfferId, setBusyOfferId] = useState(null)
  const [pendingAcceptOffer, setPendingAcceptOffer] = useState(null)
  const displayStatus = getRequestDisplayStatus(request)

  const accept = async (offer) => {
    setPendingAcceptOffer(offer)
  }

  const confirmAccept = async () => {
    if (!pendingAcceptOffer) return
    setBusyOfferId(pendingAcceptOffer._id)
    try {
      await api.offers.updateStatus(pendingAcceptOffer._id, 'accepted')
      await onChange()
      setPendingAcceptOffer(null)
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

  const isAssignedProvider =
    role === 'provider' &&
    request.provider &&
    String(request.provider._id || request.provider) === String(currentUserId)

  const providerHasActiveOffer =
    role === 'provider' &&
    offers.some(
      (o) =>
        String(o.provider?._id || o.provider) === String(currentUserId) &&
        ['submitted', 'accepted'].includes(o.status),
    )

  const canPostMessages =
    role === 'admin' ||
    (role === 'organizer' && request.status !== 'cancelled') ||
    (role === 'provider' &&
      request.status !== 'cancelled' &&
      (isAssignedProvider || providerHasActiveOffer))

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
        <StatusBadge status={displayStatus} />
      </Flex>

      <RequestHistoryPanel requestId={request._id} />

      {offers.length > 0 && (
        <Box mt="4" pt="4" borderTopWidth="1px" borderColor="outlineVariant">
          <Text textStyle="labelMd" mb="3" fontWeight="600">
            Offers
          </Text>
          <Stack gap="3">
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
        </Box>
      )}

      <RequestMessagesPanel
        requestId={request._id}
        messages={request.messages || []}
        canPost={canPostMessages}
        currentUserId={currentUserId}
        onPosted={onChange}
      />

      {role === 'provider' && request.status === 'pending' && !providerAlreadyOffered && (
        <Box mt="6">
          <ProviderOfferForm requestId={request._id} onSubmitted={onChange} />
        </Box>
      )}
      {role === 'provider' && providerAlreadyOffered && (
        <Text textStyle="bodySm" color="onSurfaceVariant" mt="4">
          You have already submitted an offer for this request.
        </Text>
      )}
      {offers.length === 0 && role !== 'provider' && (
        <Text textStyle="bodySm" color="onSurfaceVariant" mt="4">
          No offers yet for this request.
        </Text>
      )}

      <RequestSummaryModal
        open={Boolean(pendingAcceptOffer)}
        title="Confirm accepted offer"
        trip={trip}
        rows={buildRequestSummaryRows({
          needTypes: [request.needType],
          message: request.message,
          offer: pendingAcceptOffer,
          statusLabel: 'Confirmed',
        })}
        confirmLabel="Accept offer"
        loading={busyOfferId === pendingAcceptOffer?._id}
        onCancel={() => setPendingAcceptOffer(null)}
        onConfirm={confirmAccept}
      />
    </Box>
  )
}

export function TripDetailPage() {
  const { isOrganizer, isProvider, isAdmin, user } = useAuth()
  const { id } = useParams()
  const { trip, requests, offersByRequest, recommendedProviders, favoriteProviderIds, loading, error, reload } =
    useTripDetail(id)

  const role = isAdmin ? 'admin' : isProvider ? 'provider' : 'organizer'
  const backTo = isAdmin ? '/admin/trips' : '/trips'
  const backLabel = isAdmin ? 'Back to All Trips' : isProvider ? 'Back to Available Trips' : 'Back to My Trips'

  if (loading) {
    return (
        <Flex p="20" justify="center">
          <Spinner color="primary" />
        </Flex>
    )
  }

  if (error || !trip) {
    return (
        <Box p="10" textAlign="center">
          <Text textStyle="bodyMd" color="error" mb="4">
            {error?.message || 'Trip not found.'}
          </Text>
          <Button {...stitchGreenButton} onClick={() => window.location.assign(backTo)}>
            {backLabel}
          </Button>
        </Box>
    )
  }

  const isTripOwner =
    isOrganizer && String(trip.organizer?._id || trip.organizer) === String(user?._id)
  const canDeleteTrip = isTripOwner || isAdmin
  const totalOffers = Object.values(offersByRequest || {}).reduce(
    (sum, list) => sum + list.length,
    0,
  )

  return (
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role={role} />
        <TripBackLink to={backTo} label={backLabel} />

        <Flex justify="space-between" align="flex-start" mb="8" flexWrap="wrap" gap="4">
          <Box>
            <HStack gap="3" mb="3" flexWrap="wrap">
              <StatusBadge status={trip.status} />
              {trip.bookingMode === BOOKING_MODES.BUNDLED && (
                <Flex
                  align="center"
                  gap="1"
                  px="3"
                  py="1"
                  borderRadius="pill"
                  bg="secondaryContainer"
                  color="onSecondaryContainer"
                  textStyle="labelSm"
                  fontWeight="600"
                >
                  <MaterialIcon name="inventory_2" size={14} />
                  Full package
                </Flex>
              )}
              <Text textStyle="labelSm" color="onSurfaceVariant">
                ID: #{String(trip._id).slice(-6).toUpperCase()}
              </Text>
            </HStack>
            <Text textStyle="headlineLg">{trip.title}</Text>
          </Box>
          <Flex direction="column" align={{ base: 'stretch', sm: 'flex-end' }} gap="2">
          {isAdmin && (
              <Text textStyle="bodySm" color="onSurfaceVariant" textAlign={{ base: 'left', sm: 'right' }}>
                Platform admin view
            </Text>
          )}
            {canDeleteTrip && (
              <DeleteTripButton
                tripId={trip._id}
                tripTitle={trip.title}
                requestCount={requests.length}
                offerCount={totalOffers}
                backTo={backTo}
              />
            )}
          </Flex>
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="8">
          <Stack gap="6">
            <Box bg="surface" borderRadius="fluide3xl" overflow="hidden" borderWidth="1px" borderColor="outlineVariant">
              <Box position="relative" h="56">
                <TripCover trip={trip} alt={trip.title} w="full" h="full" />
                {isOrganizer && String(trip.organizer?._id || trip.organizer) === String(user?._id) && (
                  <Box position="absolute" top="4" right="4">
                    <ChangeCoverButton tripId={trip._id} onChanged={() => reload({ silent: true })} />
                  </Box>
                )}
              </Box>
              <Box p="6">
                {(trip.itinerary || []).length > 0 && (
                  <Box mb={trip.description ? '8' : '0'}>
                    <Text textStyle="headlineSm" mb="4">
                      Itinerary
                    </Text>
                    <ItineraryTimeline itinerary={trip.itinerary} />
                  </Box>
                )}
                {trip.description ? (
                  <Box>
                <Text textStyle="headlineSm" mb="3">
                      About this trip
                </Text>
                    <Text textStyle="bodyMd" color="onSurfaceVariant" whiteSpace="pre-wrap" lineHeight="1.7">
                  {trip.description}
                      </Text>
                    </Box>
                ) : null}
              </Box>
            </Box>

            {recommendedProviders.length > 0 && (
              <Box mb="8">
                <Text textStyle="headlineSm" mb="1">
                  Recommended providers
                </Text>
                <Text textStyle="bodySm" color="onSurfaceVariant" mb="4">
                  Expert services tailored to your trip details
                </Text>
                <Stack gap="3">
                  {recommendedProviders.map((provider) => (
                    <Flex
                      key={provider._id}
                      bg="surface"
                      p="4"
                      borderRadius="fluide3xl"
                      borderWidth="1px"
                      borderColor="outlineVariant"
                      align="center"
                      gap="4"
                    >
                      <Flex
                        w="12"
                        h="12"
                        borderRadius="full"
                        bg="surfaceContainer"
                        align="center"
                        justify="center"
                        overflow="hidden"
                      >
                        {provider.avatar ? (
                          <Image src={provider.avatar} alt="" w="full" h="full" objectFit="cover" />
                        ) : (
                          <MaterialIcon name="person" color="primary" />
                        )}
                      </Flex>
                      <Box flex="1">
                        <Flex align="center" gap="2">
                          <RouterLink
                            to={`/providers/${provider._id}`}
                            state={{ provider }}
                            onClick={() => cacheProviderProfile(provider)}
                          >
                            <Text textStyle="labelMd" color="primary" _hover={{ textDecoration: 'underline' }}>
                              {provider.name}
                            </Text>
                          </RouterLink>
                          {provider.badge && (
                            <Text textStyle="labelSm" color="primary" fontWeight="700">
                              {provider.badge}
                            </Text>
                          )}
                        </Flex>
                        <Text textStyle="bodySm" color="onSurfaceVariant">
                          {provider.providerType}
                          {provider.rating != null ? ` · ${provider.rating} ★` : ''}
                        </Text>
                      </Box>
                      {isOrganizer && (
                        <FavoriteProviderButton
                          providerId={provider._id}
                          initialFavorite={favoriteProviderIds.includes(String(provider._id))}
                        />
                      )}
                    </Flex>
                  ))}
                </Stack>
              </Box>
            )}

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
                    trip={trip}
                    onChange={() => reload({ silent: true })}
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
                    trip={trip}
                    tripNeedTypes={trip.needTypes || []}
                    existingNeedTypes={requests.map((r) => r.needType)}
                    requestCount={requests.length}
                    onCreated={() => reload({ silent: true })}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          <TripSnapshotSidebar trip={trip} requests={requests} totalOffers={totalOffers} />
        </Grid>
      </Box>
  )
}
