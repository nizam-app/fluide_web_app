import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Flex, Grid, Image, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { BookingModePicker } from '../components/molecules/BookingModePicker'
import { CurrencyPicker } from '../components/molecules/CurrencyPicker'
import { ItineraryBuilder } from '../components/molecules/ItineraryBuilder'
import { NeedTypePicker } from '../components/molecules/NeedTypePicker'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { NEED_TYPE_OPTIONS } from '../data/mockData'
import api from '../lib/api'
import {
  BOOKING_MODES,
  createLeg,
  getFilledLegs,
  serializeLegsForApi,
} from '../lib/itinerary'
import { toApiNeedTypes } from '../lib/needTypes'
import { formatPrice } from '../lib/format'
import { computeCostPerParticipant } from '../lib/requestStatus'
import { textWithBrand } from '../lib/textWithBrand'
import { fluideCompactInputStyles, fluideDateInputStyles, fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ACCEPTED_MIME = 'image/jpeg,image/png,image/webp,image/gif'

function FormField({ label, children, compact = false }) {
  return (
    <Box>
      <Text textStyle={compact ? 'labelSm' : 'labelMd'} color="onSurfaceVariant" mb={compact ? '1' : '2'}>
        {label}
      </Text>
      {children}
    </Box>
  )
}

export function CreateTripPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    participants: '',
    needTypes: [NEED_TYPE_OPTIONS[0]],
    bookingMode: BOOKING_MODES.MULTI,
    description: '',
    accessibility: '',
    budgetEstimate: '',
    budgetCurrency: 'EUR',
  })
  const [itinerary, setItinerary] = useState([createLeg('transfer'), createLeg('stay'), createLeg('transfer')])
  const [imageFile, setImageFile] = useState(null)
  const [autoImageUrl, setAutoImageUrl] = useState('')
  const [autoImageAttribution, setAutoImageAttribution] = useState('')
  const [imageLookupBusy, setImageLookupBusy] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [pendingTripId, setPendingTripId] = useState(null)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleBookingModeChange = (bookingMode) => {
    setForm((prev) => {
      const next = { ...prev, bookingMode }
      if (bookingMode === BOOKING_MODES.BUNDLED) {
        const bundledTypes = ['Transport', 'Accommodation']
        const merged = [...new Set([...prev.needTypes, ...bundledTypes])]
        next.needTypes = merged.filter((t) => NEED_TYPE_OPTIONS.includes(t))
      }
      return next
    })
  }

  const imagePreview = useMemo(
    () =>
      imageFile
        ? URL.createObjectURL(imageFile)
        : form.location.trim()
          ? api.utils.destinationImageProxyUrl(form.location.trim())
          : autoImageUrl || '',
    [imageFile, form.location, autoImageUrl],
  )
  useEffect(() => {
    if (!imagePreview || !imageFile) return undefined
    return () => URL.revokeObjectURL(imagePreview)
  }, [imagePreview, imageFile])

  const costPerParticipant = useMemo(
    () => computeCostPerParticipant(form.budgetEstimate, form.participants),
    [form.budgetEstimate, form.participants],
  )

  useEffect(() => {
    const query = form.location.trim()
    if (query.length < 3) {
      setAutoImageUrl('')
      setAutoImageAttribution('')
      return undefined
    }

    const timer = window.setTimeout(async () => {
      setImageLookupBusy(true)
      try {
        const result = await api.utils.destinationImage(query)
        const url = result?.image?.url || result?.image?.thumbUrl || ''
        setAutoImageUrl(url)
        setAutoImageAttribution(result?.image?.attribution || '')
      } catch {
        setAutoImageUrl('')
        setAutoImageAttribution('')
      } finally {
        setImageLookupBusy(false)
      }
    }, 500)

    return () => window.clearTimeout(timer)
  }, [form.location])

  const handleFile = (event) => {
    setError('')
    const file = event.target.files?.[0]
    if (!file) {
      setImageFile(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Please pick an image file (JPG, PNG, WebP, or GIF).')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Image is too large. Max size is 5 MB.')
      return
    }
    setImageFile(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const participants = Number(form.participants)
    if (!Number.isInteger(participants) || participants < 1) {
      setError('Please provide a valid number of participants.')
      return
    }
    if (!form.title.trim() || !form.location.trim() || !form.startDate) {
      setError('Title, location, and start date are required.')
      return
    }
    const filledItinerary = getFilledLegs(itinerary)
    if (!form.description.trim() && filledItinerary.length === 0) {
      setError('Add a short trip summary or at least one itinerary step.')
      return
    }
    if (!form.needTypes.length) {
      setError('Select at least one need type for this trip.')
      return
    }

    setSubmitting(true)
    let itineraryWarning = ''
    try {
      let tripId = pendingTripId
      if (!tripId) {
        const payload = {
          title: form.title.trim(),
          description: form.description.trim() || form.title.trim(),
          location: form.location.trim(),
          startDate: form.startDate,
          participants,
          needTypes: toApiNeedTypes(form.needTypes),
          bookingMode: form.bookingMode,
          status: 'published',
        }
        const apiItinerary = serializeLegsForApi(itinerary)
        if (apiItinerary.length) payload.itinerary = apiItinerary
        if (form.endDate) payload.endDate = form.endDate
        if (form.accessibility.trim()) payload.accessibility = form.accessibility.trim()
        const budget = Number(form.budgetEstimate)
        if (form.budgetEstimate !== '' && Number.isFinite(budget) && budget >= 0) {
          payload.budgetEstimate = budget
          payload.budgetCurrency = form.budgetCurrency || 'EUR'
        }

        let result
        try {
          result = await api.trips.create(payload)
        } catch (createErr) {
          const msg = String(createErr?.message || '').toLowerCase()
          const maybeUnknownFields =
            createErr?.status === 400 &&
            (msg.includes('itinerary') || msg.includes('bookingmode') || msg.includes('booking'))
          if (!maybeUnknownFields) throw createErr
          const { itinerary: _i, bookingMode: _b, ...fallbackPayload } = payload
          result = await api.trips.create(fallbackPayload)
          itineraryWarning =
            'Trip saved, but the server does not store itinerary yet — ask your admin to update the API.'
        }
        tripId = result?.trip?._id || result?.trip?.id
        setPendingTripId(tripId)
      }

      if (tripId && imageFile) {
        try {
          await api.trips.uploadImage(tripId, imageFile)
        } catch (uploadErr) {
          const isConfigError = uploadErr?.status === 503
          setError(
            isConfigError
              ? 'The trip was created, but image upload is not configured on the server (missing CLOUDINARY_* env vars). Retry once the server is ready, or continue without an image.'
              : `Trip created, but image upload failed: ${uploadErr?.message || 'unknown error'}. Retry or continue without an image.`,
          )
          return
        }
      }

      if (itineraryWarning) setError(itineraryWarning)
      navigate(tripId ? `/trips/${tripId}` : '/trips', { replace: true })
    } catch (err) {
      setError(err?.message || 'Could not create the trip.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleContinueWithoutImage = () => {
    if (pendingTripId) navigate(`/trips/${pendingTripId}`)
  }

  return (
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py="10">
        <RolePageHeader role="organizer" />
        <Box mb="10">
          <Text textStyle="headlineMd" mb="2">
            Create a Trip
          </Text>
          <Text textStyle="bodyMd" color="onSurfaceVariant">
            {textWithBrand('Publish a new outing request to the Flunexia supplier network.')}
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="8">
          <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant" shadow="level1">
            <Stack gap="4" as="form" onSubmit={handleSubmit}>
              <FormField label="Trip Title">
                <Input
                  placeholder="e.g. Summer Youth Camp Transport"
                  value={form.title}
                  onChange={update('title')}
                  css={fluideInputStyles}
                />
              </FormField>

              <Grid
                templateColumns={{
                  base: '1fr 1fr',
                  md: 'minmax(0, 1.1fr) minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 0.85fr) minmax(0, 0.75fr)',
                }}
                gap="3"
                alignItems="end"
              >
                <FormField label="Start date" compact>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={update('startDate')}
                    css={fluideDateInputStyles}
                  />
                </FormField>
                <FormField label="End date (optional)" compact>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={update('endDate')}
                    css={fluideDateInputStyles}
                  />
                </FormField>
                <FormField label="Budget estimate" compact>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2500"
                    value={form.budgetEstimate}
                    onChange={update('budgetEstimate')}
                    css={fluideCompactInputStyles}
                  />
                </FormField>
                <FormField label="Currency" compact>
                  <CurrencyPicker
                    value={form.budgetCurrency}
                    onChange={(code) => setForm((prev) => ({ ...prev, budgetCurrency: code }))}
                  />
                </FormField>
                <FormField label="Participants" compact>
                  <Input
                    type="number"
                    min="1"
                    placeholder="24"
                    value={form.participants}
                    onChange={update('participants')}
                    css={fluideCompactInputStyles}
                  />
                </FormField>
              </Grid>

              {costPerParticipant != null && (
                <Box bg="infoBg" borderRadius="lg" px="4" py="3">
                  <Text textStyle="labelSm" color="onSurfaceVariant">
                    Cost per participant
                  </Text>
                  <Text textStyle="labelMd" fontWeight="700" color="primary">
                    {formatPrice(costPerParticipant, form.budgetCurrency || 'EUR')}
                  </Text>
                </Box>
              )}

              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4">
                <FormField label="Location">
                  <Input
                    placeholder="City, Region"
                    value={form.location}
                    onChange={update('location')}
                    css={fluideInputStyles}
                  />
                </FormField>
                <FormField label="Accessibility (optional)">
                  <Input
                    placeholder="e.g. High, ramp access"
                    value={form.accessibility}
                    onChange={update('accessibility')}
                    css={fluideInputStyles}
                  />
                </FormField>
              </Grid>
              <BookingModePicker value={form.bookingMode} onChange={handleBookingModeChange} />
              <NeedTypePicker
                value={form.needTypes}
                onChange={(needTypes) => setForm((prev) => ({ ...prev, needTypes }))}
              />
              <ItineraryBuilder value={itinerary} onChange={setItinerary} />
              <FormField label="Trip summary (optional)">
                <Textarea
                  rows={3}
                  placeholder="Short overview — e.g. Family group stay in Marseille, hotel + transfers included. Use the itinerary above for dates and locations."
                  value={form.description}
                  onChange={update('description')}
                  borderRadius="fluide"
                  borderColor="outlineVariant"
                  bg="surfaceContainerLow"
                />
              </FormField>

              {error && (
                <Box
                  bg="errorContainer"
                  borderRadius="fluide"
                  borderWidth="1px"
                  borderColor="error"
                  p="3"
                >
                  <Text textStyle="bodySm" color="error">
                    {error}
                  </Text>
                </Box>
              )}

              <Flex justify="flex-end" gap="3" flexWrap="wrap">
                {pendingTripId && (
                  <Button variant="outline" borderRadius="pill" onClick={handleContinueWithoutImage}>
                    Continue without image
                  </Button>
                )}
                <Button {...stitchBlackButton} px="10" py="3" type="submit" loading={submitting} disabled={submitting}>
                  {pendingTripId ? 'Retry image upload' : 'Publish Request'}
                </Button>
              </Flex>
            </Stack>
          </Box>

          <Stack gap="4">
            <Box
              bg="surface"
              borderRadius="fluide3xl"
              borderWidth="1px"
              borderColor="outlineVariant"
              p="5"
            >
              <Text textStyle="labelMd" mb="2">
                Cover image
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="4">
                A destination image is suggested automatically from your location. Upload your own to replace it.
              </Text>

              <Box
                borderRadius="fluide3xl"
                overflow="hidden"
                position="relative"
                h="40"
                bg="surfaceContainer"
                mb="3"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Selected cover" w="full" h="full" objectFit="cover" />
                ) : imageLookupBusy ? (
                  <Flex direction="column" align="center" gap="1" color="onSurfaceVariant">
                    <MaterialIcon name="travel_explore" size={32} />
                    <Text textStyle="bodySm">Finding destination image…</Text>
                  </Flex>
                ) : (
                  <Flex direction="column" align="center" gap="1" color="onSurfaceVariant">
                    <MaterialIcon name="image" size={32} />
                    <Text textStyle="bodySm">Enter a location to preview an image</Text>
                  </Flex>
                )}
              </Box>

              {autoImageAttribution && !imageFile && (
                <Text textStyle="bodySm" color="onSurfaceVariant" mb="2">
                  {autoImageAttribution}
                </Text>
              )}

              <Input
                type="file"
                ref={fileInputRef}
                accept={ACCEPTED_MIME}
                onChange={handleFile}
                display="none"
              />
              <Flex gap="2" flexWrap="wrap">
                <Button
                  type="button"
                  variant="outline"
                  borderRadius="pill"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <MaterialIcon name="upload" size={16} />
                  {imageFile ? 'Change image' : 'Choose image'}
                </Button>
                {imageFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    color="onSurfaceVariant"
                    onClick={() => {
                      setImageFile(null)
                      setAutoImageUrl('')
                      setAutoImageAttribution('')
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                  >
                    Remove
                  </Button>
                )}
              </Flex>
              {imageFile && (
                <Text mt="2" textStyle="bodySm" color="onSurfaceVariant" lineClamp={1}>
                  {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                </Text>
              )}
            </Box>
          </Stack>
        </Grid>
      </Box>
  )
}
