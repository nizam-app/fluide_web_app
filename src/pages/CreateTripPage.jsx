import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Flex, Grid, Image, Input, NativeSelect, Stack, Text, Textarea } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { PortalLayout } from '../components/templates/PortalLayout'
import { NEED_TYPE_OPTIONS } from '../data/mockData'
import api from '../lib/api'
import { textWithBrand } from '../lib/textWithBrand'
import { fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ACCEPTED_MIME = 'image/jpeg,image/png,image/webp,image/gif'

function FormField({ label, children }) {
  return (
    <Box>
      <Text textStyle="labelMd" color="onSurfaceVariant" mb="2">
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
    needType: NEED_TYPE_OPTIONS[0],
    description: '',
    accessibility: '',
    budgetEstimate: '',
    budgetCurrency: 'EUR',
  })
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [pendingTripId, setPendingTripId] = useState(null)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ''),
    [imageFile],
  )
  useEffect(() => {
    if (!imagePreview) return undefined
    return () => URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

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
    if (!form.title.trim() || !form.location.trim() || !form.startDate || !form.description.trim()) {
      setError('Title, location, start date, and description are required.')
      return
    }

    setSubmitting(true)
    try {
      let tripId = pendingTripId
      if (!tripId) {
        const payload = {
          title: form.title.trim(),
          description: form.description.trim(),
          location: form.location.trim(),
          startDate: form.startDate,
          participants,
          needTypes: [form.needType],
          status: 'published',
        }
        if (form.endDate) payload.endDate = form.endDate
        if (form.accessibility.trim()) payload.accessibility = form.accessibility.trim()
        const budget = Number(form.budgetEstimate)
        if (form.budgetEstimate !== '' && Number.isFinite(budget) && budget >= 0) {
          payload.budgetEstimate = budget
          payload.budgetCurrency = form.budgetCurrency || 'EUR'
        }

        const result = await api.trips.create(payload, imageFile || undefined)
        tripId = result?.trip?._id || result?.trip?.id
        setPendingTripId(tripId)
      }

      navigate(tripId ? `/trips/${tripId}` : '/trips')
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
    <PortalLayout>
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
            <Stack gap="5" as="form" onSubmit={handleSubmit}>
              <FormField label="Trip Title">
                <Input
                  placeholder="e.g. Summer Youth Camp Transport"
                  value={form.title}
                  onChange={update('title')}
                  css={fluideInputStyles}
                />
              </FormField>
              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4">
                <FormField label="Start date">
                  <Input type="date" value={form.startDate} onChange={update('startDate')} css={fluideInputStyles} />
                </FormField>
                <FormField label="End date (optional)">
                  <Input type="date" value={form.endDate} onChange={update('endDate')} css={fluideInputStyles} />
                </FormField>
              </Grid>
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
              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4">
                <FormField label="Budget Estimate">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 2500"
                    value={form.budgetEstimate}
                    onChange={update('budgetEstimate')}
                    css={fluideInputStyles}
                  />
                </FormField>
                <FormField label="Currency">
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      css={fluideInputStyles}
                      value={form.budgetCurrency}
                      onChange={update('budgetCurrency')}
                    >
                      {['EUR', 'USD', 'GBP', 'CHF'].map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </FormField>
              </Grid>
              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4">
                <FormField label="Number of Participants">
                  <Input
                    type="number"
                    min="1"
                    placeholder="24"
                    value={form.participants}
                    onChange={update('participants')}
                    css={fluideInputStyles}
                  />
                </FormField>
                <FormField label="Primary Need Type">
                  <NativeSelect.Root>
                    <NativeSelect.Field css={fluideInputStyles} value={form.needType} onChange={update('needType')}>
                      {NEED_TYPE_OPTIONS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </FormField>
              </Grid>
              <FormField label="Description">
                <Textarea
                  rows={4}
                  placeholder="Describe requirements for providers..."
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
            <Box bg="infoBg" borderRadius="fluide3xl" p="6">
              <Flex align="center" gap="2" mb="4">
                <MaterialIcon name="info" color="infoFg" />
                <Text textStyle="labelMd" color="infoFg">
                  How it works
                </Text>
              </Flex>
              <Stack gap="3">
                {['Submit your trip details', 'Providers send offers', 'Accept the best match'].map((step, i) => (
                  <Flex key={step} gap="3" align="flex-start">
                    <Text color="primary" fontWeight="700">
                      {i + 1}.
                    </Text>
                    <Text textStyle="bodySm" color="onSurface">
                      {step}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Box>

            <Box
              bg="surface"
              borderRadius="fluide3xl"
              borderWidth="1px"
              borderColor="outlineVariant"
              p="5"
            >
              <Text textStyle="labelMd" mb="2">
                Cover image (optional)
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="4">
                JPG, PNG, WebP, or GIF — up to 5 MB. Stored on Cloudinary.
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
                ) : (
                  <Flex direction="column" align="center" gap="1" color="onSurfaceVariant">
                    <MaterialIcon name="image" size={32} />
                    <Text textStyle="bodySm">No image selected</Text>
                  </Flex>
                )}
              </Box>

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
    </PortalLayout>
  )
}
