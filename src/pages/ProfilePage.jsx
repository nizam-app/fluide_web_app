import { useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, Grid, HStack, Image, Input, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { EmailLanguagePicker } from '../components/molecules/EmailLanguagePicker'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { NeedTypePicker } from '../components/molecules/NeedTypePicker'
import { stableBusyProps } from '../lib/stableButton'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import api from '../lib/api'
import { ORGANIZATION_TYPES, PROVIDER_TYPES } from '../data/mockData'
import { getSelectedProviderTypes, getApprovedProviderTypes, getPendingProviderTypes } from '../lib/providerTypes'
import { getRoleLabel } from '../lib/roles'
import { documentCategoryLabel } from '../lib/format'
import { fluideInputStyles, stitchBlackButton, stitchGreenButton } from '../theme/fluide-theme'

const DOCUMENT_CATEGORIES = [
  { value: 'insurance', label: 'Insurance' },
  { value: 'registration', label: 'Registration' },
  { value: 'certification', label: 'Certification' },
  { value: 'other', label: 'Other' },
]

function buildProfileStateFromUser(user) {
  return {
    name: user?.name || '',
    email: user?.email || '',
    organizationType: user?.organizationType || 'Municipality',
    providerTypes: getSelectedProviderTypes(user).length ? getSelectedProviderTypes(user) : ['Transport'],
    contactPerson: user?.contactPerson || '',
    companyDescription: user?.companyDescription || '',
    companyName: user?.companyName || '',
    siret: user?.siret || '',
    iban: user?.iban || '',
    bic: user?.bic || '',
    billingAddress: {
      line1: user?.billingAddress?.line1 || '',
      line2: user?.billingAddress?.line2 || '',
      city: user?.billingAddress?.city || '',
      postalCode: user?.billingAddress?.postalCode || '',
      country: user?.billingAddress?.country || 'France',
    },
    billing: {
      chorusProReady: Boolean(user?.billing?.chorusProReady),
      chorusServiceCode: user?.billing?.chorusServiceCode || '',
      legalEntityId: user?.billing?.legalEntityId || '',
      paymentTerms: user?.billing?.paymentTerms || '',
      notes: user?.billing?.notes || '',
    },
    locale: user?.locale === 'en' ? 'en' : 'fr',
  }
}

function buildBillingPayload(profile) {
  const trimOrNull = (value) => {
    const trimmed = String(value || '').trim()
    return trimmed || null
  }

  return {
    companyName: trimOrNull(profile.companyName),
    siret: trimOrNull(profile.siret),
    iban: trimOrNull(profile.iban),
    bic: trimOrNull(profile.bic),
    billingAddress: {
      line1: trimOrNull(profile.billingAddress.line1),
      line2: trimOrNull(profile.billingAddress.line2),
      city: trimOrNull(profile.billingAddress.city),
      postalCode: trimOrNull(profile.billingAddress.postalCode),
      country: trimOrNull(profile.billingAddress.country) || 'France',
    },
    billing: {
      chorusProReady: Boolean(profile.billing.chorusProReady),
      chorusServiceCode: trimOrNull(profile.billing.chorusServiceCode),
      legalEntityId: trimOrNull(profile.billing.legalEntityId),
      paymentTerms: trimOrNull(profile.billing.paymentTerms),
      notes: trimOrNull(profile.billing.notes),
    },
  }
}

export function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const documentInputRef = useRef(null)
  const { user, isOrganizer, isProvider, isAdmin, updateProfile, updatePassword, logout, refresh } = useAuth()
  const { setLocale } = useLocale()
  const headerRole = isAdmin ? 'admin' : isProvider ? 'provider' : 'organizer'

  const [profile, setProfile] = useState(() => buildProfileStateFromUser(user))
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState({ type: null, message: '' })
  const [profileStatus, setProfileStatus] = useState({ type: null, message: '' })
  const [profileBusy, setProfileBusy] = useState(false)
  const [localeBusy, setLocaleBusy] = useState(false)
  const [localeStatus, setLocaleStatus] = useState({ type: null, message: '' })
  const [billingBusy, setBillingBusy] = useState(false)
  const [billingStatus, setBillingStatus] = useState({ type: null, message: '' })
  const [documentForm, setDocumentForm] = useState({ label: '', category: 'insurance' })
  const [documentBusy, setDocumentBusy] = useState(false)
  const [documentStatus, setDocumentStatus] = useState({ type: null, message: '' })
  const [deleteDocBusyId, setDeleteDocBusyId] = useState(null)

  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [passwordStatus, setPasswordStatus] = useState({ type: null, message: '' })
  const [passwordBusy, setPasswordBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    setProfile(buildProfileStateFromUser(user))
  }, [user?._id, user?.updatedAt])

  const updateProfileField = (field) => (event) =>
    setProfile((prev) => ({ ...prev, [field]: event.target.value }))
  const updateNestedField = (section, field) => (event) =>
    setProfile((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: event.target.value },
    }))
  const updateBillingFlag = (field) => (event) =>
    setProfile((prev) => ({
      ...prev,
      billing: { ...prev.billing, [field]: event.target.checked },
    }))
  const updatePasswordField = (field) => (event) =>
    setPassword((prev) => ({ ...prev, [field]: event.target.value }))

  const handleDocumentUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const label = documentForm.label.trim()
    if (!label) {
      setDocumentStatus({ type: 'error', message: 'Document label is required.' })
      return
    }

    setDocumentBusy(true)
    setDocumentStatus({ type: null, message: '' })
    try {
      await api.users.uploadDocument(file, {
        label,
        category: documentForm.category,
      })
      setDocumentForm({ label: '', category: documentForm.category })
      await refresh()
      setDocumentStatus({
        type: 'success',
        message: 'Document uploaded. It will appear to organizers after admin approval.',
      })
    } catch (err) {
      setDocumentStatus({ type: 'error', message: err?.message || 'Could not upload document.' })
    } finally {
      setDocumentBusy(false)
    }
  }

  const handleDeleteDocument = async (documentId) => {
    setDeleteDocBusyId(documentId)
    setDocumentStatus({ type: null, message: '' })
    try {
      await api.users.deleteDocument(documentId)
      await refresh()
      setDocumentStatus({ type: 'success', message: 'Document removed.' })
    } catch (err) {
      setDocumentStatus({ type: 'error', message: err?.message || 'Could not delete document.' })
    } finally {
      setDeleteDocBusyId(null)
    }
  }

  const handleLocaleChange = async (nextLocale) => {
    if (nextLocale !== 'en' && nextLocale !== 'fr') return
    if (nextLocale === profile.locale || localeBusy) return

    setProfile((prev) => ({ ...prev, locale: nextLocale }))
    setLocale(nextLocale)
    setLocaleBusy(true)
    setLocaleStatus({ type: null, message: '' })
    try {
      const result = await updateProfile({ locale: nextLocale })
      if (result?.user?.locale === 'en' || result?.user?.locale === 'fr') {
        setProfile((prev) => ({ ...prev, locale: result.user.locale }))
        setLocale(result.user.locale)
      }
      setLocaleStatus({ type: 'success', message: 'Saved.' })
    } catch (err) {
      setProfile((prev) => ({ ...prev, locale: user?.locale === 'en' ? 'en' : 'fr' }))
      setLocaleStatus({ type: 'error', message: err?.message || 'Could not update email language.' })
    } finally {
      setLocaleBusy(false)
    }
  }

  const handleProfileSubmit = async (event) => {
    event?.preventDefault()
    setProfileStatus({ type: null, message: '' })
    if (!profile.name.trim()) {
      setProfileStatus({ type: 'error', message: 'Name is required.' })
      return
    }
    setProfileBusy(true)
    try {
      const payload = { name: profile.name.trim() }
      if (profile.email.trim() && profile.email.trim() !== user?.email) {
        payload.email = profile.email.trim()
      }
      if (isOrganizer) payload.organizationType = profile.organizationType
      if (isProvider) {
        payload.providerTypes = profile.providerTypes
        payload.contactPerson = profile.contactPerson.trim() || undefined
        payload.companyDescription = profile.companyDescription.trim() || undefined
      }
      const result = await updateProfile(payload)
      if (result?.user) {
        setProfile(buildProfileStateFromUser(result.user))
        if (result.user.locale === 'en' || result.user.locale === 'fr') {
          setLocale(result.user.locale)
        }
      }
      setProfileStatus({
        type: 'success',
        message: result?.message || 'Profile updated.',
      })
    } catch (err) {
      setProfileStatus({ type: 'error', message: err?.message || 'Could not update your profile.' })
    } finally {
      setProfileBusy(false)
    }
  }

  const handleBillingSubmit = async (event) => {
    event?.preventDefault()
    setBillingStatus({ type: null, message: '' })
    setBillingBusy(true)
    try {
      const result = await updateProfile(buildBillingPayload(profile))
      if (result?.user) {
        setProfile(buildProfileStateFromUser(result.user))
      } else {
        await refresh()
      }
      setBillingStatus({
        type: 'success',
        message: 'Billing details saved.',
      })
    } catch (err) {
      setBillingStatus({
        type: 'error',
        message: err?.message || 'Could not save billing details.',
      })
    } finally {
      setBillingBusy(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setPasswordStatus({ type: null, message: '' })
    if (!password.currentPassword || !password.newPassword) {
      setPasswordStatus({ type: 'error', message: 'Current and new passwords are required.' })
      return
    }
    if (password.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters.' })
      return
    }
    if (password.newPassword !== password.confirm) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' })
      return
    }
    setPasswordBusy(true)
    try {
      await updatePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      })
      setPasswordStatus({ type: 'success', message: 'Password updated.' })
      setPassword({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err?.message || 'Could not change your password.' })
    } finally {
      setPasswordBusy(false)
    }
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAvatarBusy(true)
    setProfileStatus({ type: null, message: '' })
    try {
      await api.users.uploadAvatar(file)
      await refresh()
      setProfileStatus({ type: 'success', message: 'Profile photo updated.' })
    } catch (err) {
      const message =
        err?.status === 404
          ? 'Photo upload is not available on this API yet. Use a local backend or redeploy the server with the latest code.'
          : err?.status === 503
            ? 'Photo upload is not configured on the server (Cloudinary credentials missing).'
            : err?.message || 'Could not upload photo.'
      setProfileStatus({ type: 'error', message })
    } finally {
      setAvatarBusy(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteStatus({ type: 'error', message: 'Enter your password to delete the account.' })
      return
    }
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return
    setDeleteBusy(true)
    setDeleteStatus({ type: null, message: '' })
    try {
      await api.users.deleteAccount(deletePassword)
      await logout()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleteStatus({ type: 'error', message: err?.message || 'Could not delete account.' })
    } finally {
      setDeleteBusy(false)
    }
  }

  const contentMaxW = isProvider || isAdmin ? '56rem' : '42rem'

  return (
      <Box
        w="full"
        maxW={contentMaxW}
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 6, lg: 8 }}
      >
        {!isAdmin && <RolePageHeader role={headerRole} />}
        <Text textStyle="headlineMd" mb="1">
          Profile
        </Text>
        <Text textStyle="bodyMd" color="onSurfaceVariant" mb="8">
          {isOrganizer && 'Your organizer account for municipalities, associations, schools, and institutions.'}
          {isProvider && 'Your supplier account for transport, activities, catering, hotels, and services.'}
          {isAdmin && 'Internal admin account settings.'}
        </Text>

        <Box bg="surface" borderRadius="fluide3xl" p={{ base: 5, md: 6 }} borderWidth="1px" borderColor="outlineVariant" mb="6">
          <Text textStyle="headlineSm" mb="4">
            Account details
          </Text>
          <Stack gap="5" as="form" onSubmit={handleProfileSubmit}>
            <Flex align="center" gap="4">
              <Box
                w="20"
                h="20"
                borderRadius="full"
                overflow="hidden"
                bg="surfaceContainer"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {user?.avatar ? (
                  <Image src={user.avatar} alt="" w="full" h="full" objectFit="cover" />
                ) : (
                  <Text textStyle="headlineSm" color="onSurfaceVariant">
                    {(user?.name || '?').slice(0, 1)}
                  </Text>
                )}
              </Box>
              <Box>
                <Input type="file" accept="image/*" ref={fileInputRef} display="none" onChange={handleAvatarChange} />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  borderRadius="pill"
                  onClick={() => fileInputRef.current?.click()}
                  loading={avatarBusy}
                  disabled={avatarBusy}
                >
                  Change photo
                </Button>
              </Box>
            </Flex>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="5">
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Name
                </Text>
                <Input value={profile.name} onChange={updateProfileField('name')} css={fluideInputStyles} />
              </Box>
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Email
                </Text>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={updateProfileField('email')}
                  css={fluideInputStyles}
                  readOnly={isAdmin}
                />
              </Box>
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Account type
                </Text>
                <Input value={getRoleLabel(user?.role)} readOnly css={fluideInputStyles} opacity={0.85} />
              </Box>
              {isOrganizer && (
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Organization type
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      css={fluideInputStyles}
                      value={profile.organizationType}
                      onChange={updateProfileField('organizationType')}
                    >
                      {ORGANIZATION_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              )}
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Preferred language for email
                </Text>
                <EmailLanguagePicker
                  value={profile.locale}
                  onChange={handleLocaleChange}
                  disabled={localeBusy}
                />
                {localeBusy && (
                  <Text textStyle="bodySm" color="onSurfaceVariant" mt="2">
                    Saving…
                  </Text>
                )}
                {localeStatus.message && (
                  <Text
                    textStyle="bodySm"
                    color={localeStatus.type === 'success' ? 'primary' : 'error'}
                    mt="2"
                  >
                    {localeStatus.message}
                  </Text>
                )}
              </Box>
            </Grid>
            {isProvider && (
              <>
                <Box>
                  <NeedTypePicker
                    label="Services you provide"
                    options={PROVIDER_TYPES}
                    value={profile.providerTypes}
                    onChange={(next) => setProfile((prev) => ({ ...prev, providerTypes: next }))}
                  />
                  {(getPendingProviderTypes(user).length > 0 ||
                    profile.providerTypes.length > getApprovedProviderTypes(user).length) && (
                    <Text textStyle="bodySm" color="onSurfaceVariant" mt="2">
                      New or additional services require platform administrator approval.
                    </Text>
                  )}
                  {getApprovedProviderTypes(user).length > 0 && (
                    <Text textStyle="bodySm" color="primary" mt="2">
                      Approved: {getApprovedProviderTypes(user).join(', ')}
                    </Text>
                  )}
                  {getPendingProviderTypes(user).length > 0 && (
                    <Text textStyle="bodySm" color="onSurfaceVariant" mt="1">
                      Pending approval: {getPendingProviderTypes(user).join(', ')}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Contact person
                  </Text>
                  <Input value={profile.contactPerson} onChange={updateProfileField('contactPerson')} css={fluideInputStyles} />
                </Box>
              </>
            )}
            {profileStatus.message && (
              <Text textStyle="bodySm" color={profileStatus.type === 'success' ? 'primary' : 'error'}>
                {profileStatus.message}
              </Text>
            )}
            <Button type="submit" w="fit-content" {...stitchGreenButton} px="8" {...stableBusyProps(profileBusy)}>
              Save changes
            </Button>
          </Stack>
        </Box>

        {isProvider && (
          <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant" mb="6">
            <Text textStyle="headlineSm" mb="1">
              Administrative information
            </Text>
            <Text textStyle="bodySm" color="onSurfaceVariant" mb="5">
              Legal and billing details used for invoices and public-sector compatibility.
            </Text>
            <Stack gap="4" as="form" onSubmit={handleBillingSubmit}>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
                <Box>
                  <Text textStyle="labelMd" mb="2">Company name</Text>
                  <Input value={profile.companyName} onChange={updateProfileField('companyName')} css={fluideInputStyles} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">SIRET</Text>
                  <Input value={profile.siret} onChange={updateProfileField('siret')} css={fluideInputStyles} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">IBAN / RIB</Text>
                  <Input value={profile.iban} onChange={updateProfileField('iban')} css={fluideInputStyles} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">BIC</Text>
                  <Input value={profile.bic} onChange={updateProfileField('bic')} css={fluideInputStyles} />
                </Box>
              </Grid>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
                <Box>
                  <Text textStyle="labelMd" mb="2">Billing address</Text>
                  <Input placeholder="Street" value={profile.billingAddress.line1} onChange={updateNestedField('billingAddress', 'line1')} css={fluideInputStyles} mb="2" />
                  <Input placeholder="Additional line" value={profile.billingAddress.line2} onChange={updateNestedField('billingAddress', 'line2')} css={fluideInputStyles} mb="2" />
                  <Grid templateColumns="1fr 1fr" gap="2">
                    <Input placeholder="Postal code" value={profile.billingAddress.postalCode} onChange={updateNestedField('billingAddress', 'postalCode')} css={fluideInputStyles} />
                    <Input placeholder="City" value={profile.billingAddress.city} onChange={updateNestedField('billingAddress', 'city')} css={fluideInputStyles} />
                  </Grid>
                  <Input mt="2" placeholder="Country" value={profile.billingAddress.country} onChange={updateNestedField('billingAddress', 'country')} css={fluideInputStyles} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">Billing / Chorus Pro</Text>
                  <Flex align="center" gap="2" mb="3">
                    <Input type="checkbox" checked={profile.billing.chorusProReady} onChange={updateBillingFlag('chorusProReady')} />
                    <Text textStyle="bodySm">Ready for Chorus Pro integration</Text>
                  </Flex>
                  <Input placeholder="Chorus service code" value={profile.billing.chorusServiceCode} onChange={updateNestedField('billing', 'chorusServiceCode')} css={fluideInputStyles} mb="2" />
                  <Input placeholder="Legal entity ID" value={profile.billing.legalEntityId} onChange={updateNestedField('billing', 'legalEntityId')} css={fluideInputStyles} mb="2" />
                  <Input placeholder="Payment terms" value={profile.billing.paymentTerms} onChange={updateNestedField('billing', 'paymentTerms')} css={fluideInputStyles} mb="2" />
                  <Input placeholder="Billing notes" value={profile.billing.notes} onChange={updateNestedField('billing', 'notes')} css={fluideInputStyles} />
                </Box>
              </Grid>
              {billingStatus.message && (
                <Text textStyle="bodySm" color={billingStatus.type === 'success' ? 'primary' : 'error'}>
                  {billingStatus.message}
                </Text>
              )}
              <Button
                type="submit"
                w="fit-content"
                {...stitchGreenButton}
                px="8"
                loading={billingBusy}
                disabled={billingBusy}
              >
                Save billing details
              </Button>
            </Stack>
          </Box>
        )}

        {isProvider && (
          <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant" mb="6">
            <Text textStyle="headlineSm" mb="1">
              Trust documents
            </Text>
            <Text textStyle="bodySm" color="onSurfaceVariant" mb="5">
              Upload insurance, registration, or certification files. Organizers only see documents after admin approval.
            </Text>
            <Stack gap="4" mb="6">
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Document label
                  </Text>
                  <Input
                    value={documentForm.label}
                    onChange={(event) =>
                      setDocumentForm((prev) => ({ ...prev, label: event.target.value }))
                    }
                    placeholder="e.g. Professional liability insurance"
                    css={fluideInputStyles}
                  />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Category
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={documentForm.category}
                      onChange={(event) =>
                        setDocumentForm((prev) => ({ ...prev, category: event.target.value }))
                      }
                      css={fluideInputStyles}
                    >
                      {DOCUMENT_CATEGORIES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </Grid>
              <HStack gap="3" flexWrap="wrap">
                <input
                  ref={documentInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  hidden
                  onChange={handleDocumentUpload}
                />
                <Button
                  {...stitchGreenButton}
                  px="8"
                  loading={documentBusy}
                  onClick={() => documentInputRef.current?.click()}
                >
                  Upload document
                </Button>
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  PDF or image, up to server limit.
                </Text>
              </HStack>
              {documentStatus.message && (
                <Text textStyle="bodySm" color={documentStatus.type === 'success' ? 'primary' : 'error'}>
                  {documentStatus.message}
                </Text>
              )}
            </Stack>

            {(user?.documents || []).length === 0 ? (
              <Text textStyle="bodySm" color="onSurfaceVariant">
                No documents uploaded yet.
              </Text>
            ) : (
              <Stack gap="3">
                {(user.documents || []).map((doc) => (
                  <Flex
                    key={doc._id}
                    p="4"
                    borderWidth="1px"
                    borderColor="outlineVariant"
                    borderRadius="lg"
                    align="center"
                    justify="space-between"
                    gap="4"
                    flexWrap="wrap"
                  >
                    <Box>
                      <Text textStyle="labelMd">{doc.label}</Text>
                      <Text textStyle="bodySm" color="onSurfaceVariant" textTransform="capitalize">
                        {documentCategoryLabel(doc.category)} · {doc.status}
                      </Text>
                    </Box>
                    <HStack gap="2">
                      <Button
                        as="a"
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        variant="outline"
                        borderRadius="pill"
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        borderRadius="pill"
                        loading={deleteDocBusyId === doc._id}
                        onClick={() => handleDeleteDocument(doc._id)}
                      >
                        Remove
                      </Button>
                    </HStack>
                  </Flex>
                ))}
              </Stack>
            )}
          </Box>
        )}

        <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant">
          <Text textStyle="headlineSm" mb="4">
            Change password
          </Text>
          <Stack gap="5" as="form" onSubmit={handlePasswordSubmit}>
            <Stack gap="4" maxW="28rem">
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Current password
                </Text>
                <Input
                  type="password"
                  value={password.currentPassword}
                  onChange={updatePasswordField('currentPassword')}
                  css={fluideInputStyles}
                />
              </Box>
              <Box>
                <Text textStyle="labelMd" mb="2">
                  New password
                </Text>
                <Input
                  type="password"
                  value={password.newPassword}
                  onChange={updatePasswordField('newPassword')}
                  css={fluideInputStyles}
                />
              </Box>
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Confirm new password
                </Text>
                <Input
                  type="password"
                  value={password.confirm}
                  onChange={updatePasswordField('confirm')}
                  css={fluideInputStyles}
                />
              </Box>
            </Stack>
            {passwordStatus.message && (
              <Text textStyle="bodySm" color={passwordStatus.type === 'success' ? 'primary' : 'error'}>
                {passwordStatus.message}
              </Text>
            )}
            <Button
              type="submit"
              w="fit-content"
              {...stitchBlackButton}
              px="8"
              loading={passwordBusy}
              disabled={passwordBusy}
            >
              Update password
            </Button>
          </Stack>
        </Box>

        {!isAdmin && (
          <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant" mt="6">
            <Text textStyle="headlineSm" mb="2" color="error">
              Delete account
            </Text>
            <Text textStyle="bodySm" color="onSurfaceVariant" mb="4">
              Permanently remove your account and associated trips or offers.
            </Text>
            <Stack gap="3" maxW="md">
              <Input
                type="password"
                placeholder="Confirm with your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                css={fluideInputStyles}
              />
              {deleteStatus.message && (
                <Text textStyle="bodySm" color="error">
                  {deleteStatus.message}
                </Text>
              )}
              <Button
                variant="outline"
                color="error"
                borderColor="error"
                borderRadius="pill"
                w="fit-content"
                onClick={handleDeleteAccount}
                loading={deleteBusy}
                disabled={deleteBusy}
              >
                Delete account
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
  )
}
