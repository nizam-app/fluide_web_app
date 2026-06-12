import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Image,
  Input,
  NativeSelect,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { EmailLanguagePicker } from '../components/molecules/EmailLanguagePicker'
import { NeedTypePicker } from '../components/molecules/NeedTypePicker'
import { ProfileField, ProfileSection } from '../components/molecules/ProfileSection'
import { stableBusyProps } from '../lib/stableButton'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import api from '../lib/api'
import { ORGANIZATION_TYPES, PROVIDER_TYPES } from '../data/mockData'
import { getSelectedProviderTypes, getApprovedProviderTypes, getPendingProviderTypes } from '../lib/providerTypes'
import { getRoleLabel } from '../lib/roles'
import { documentCategoryLabel } from '../lib/format'
import { fluideInputStyles, stitchGreenButton } from '../theme/fluide-theme'

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

function StatusMessage({ status }) {
  if (!status?.message) return null
  return (
    <Text textStyle="bodySm" color={status.type === 'success' ? 'primary' : 'error'}>
      {status.message}
    </Text>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const documentInputRef = useRef(null)
  const { user, isOrganizer, isProvider, isAdmin, updateProfile, updatePassword, logout, refresh } = useAuth()
  const { setLocale } = useLocale()

  const [profile, setProfile] = useState(() => buildProfileStateFromUser(user))
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState({ type: null, message: '' })
  const [profileStatus, setProfileStatus] = useState({ type: null, message: '' })
  const [profileBusy, setProfileBusy] = useState(false)
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

  const handleProfileSubmit = async (event) => {
    event?.preventDefault()
    setProfileStatus({ type: null, message: '' })
    if (!profile.name.trim()) {
      setProfileStatus({ type: 'error', message: 'Name is required.' })
      return
    }
    setProfileBusy(true)
    try {
      const payload = {
        name: profile.name.trim(),
        locale: profile.locale === 'en' ? 'en' : 'fr',
      }
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
        message: result?.message || 'Changes saved.',
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
      setBillingStatus({ type: 'success', message: 'Billing details saved.' })
    } catch (err) {
      setBillingStatus({ type: 'error', message: err?.message || 'Could not save billing details.' })
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
          ? 'Photo upload is not available on this API yet.'
          : err?.status === 503
            ? 'Photo upload is not configured on the server.'
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

  const pageMaxW = isProvider || isAdmin ? '52rem' : '40rem'

  return (
    <Box w="full" maxW={pageMaxW} mx="auto" px={{ base: 4, md: 6 }} py={{ base: 5, md: 8 }}>
      <Box mb="6">
        <Text textStyle="headlineMd" mb="1">
          Profile
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant">
          Manage your account and preferences.
        </Text>
      </Box>

      <Box
        bg="surface"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="outlineVariant"
        overflow="hidden"
        mb="6"
      >
        <ProfileSection>
          <Flex align={{ base: 'flex-start', sm: 'center' }} gap="4" flexWrap="wrap">
            <Box
              w="16"
              h="16"
              borderRadius="full"
              overflow="hidden"
              bg="surfaceContainer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              {user?.avatar ? (
                <Image src={user.avatar} alt="" w="full" h="full" objectFit="cover" />
              ) : (
                <Text textStyle="headlineSm" color="onSurfaceVariant">
                  {(user?.name || '?').slice(0, 1)}
                </Text>
              )}
            </Box>
            <Box flex="1" minW="12rem">
              <Text textStyle="labelMd" fontWeight="600">
                {user?.name || 'Account'}
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mt="0.5">
                {user?.email}
              </Text>
              <Text textStyle="labelSm" color="onSurfaceVariant" mt="0.5">
                {getRoleLabel(user?.role)}
              </Text>
            </Box>
            <Input type="file" accept="image/*" ref={fileInputRef} display="none" onChange={handleAvatarChange} />
            <Button
              type="button"
              size="sm"
              variant="outline"
              borderRadius="lg"
              onClick={() => fileInputRef.current?.click()}
              {...stableBusyProps(avatarBusy)}
            >
              Change photo
            </Button>
          </Flex>
        </ProfileSection>

        <ProfileSection title="General" description="Your account information and notification preferences.">
          <Stack gap="5" as="form" onSubmit={handleProfileSubmit}>
            <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="5">
              <ProfileField label="Name">
                <Input value={profile.name} onChange={updateProfileField('name')} css={fluideInputStyles} />
              </ProfileField>
              <ProfileField label="Email">
                <Input
                  type="email"
                  value={profile.email}
                  onChange={updateProfileField('email')}
                  css={fluideInputStyles}
                  readOnly={isAdmin}
                />
              </ProfileField>
              <ProfileField label="Preferred language for email">
                <EmailLanguagePicker
                  value={profile.locale}
                  onChange={(next) => setProfile((prev) => ({ ...prev, locale: next }))}
                />
              </ProfileField>
              {isOrganizer && (
                <ProfileField label="Organization type">
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
                </ProfileField>
              )}
            </Grid>

            {isProvider && (
              <Stack gap="5">
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
                      New services require administrator approval.
                    </Text>
                  )}
                </Box>
                <ProfileField label="Contact person">
                  <Input
                    value={profile.contactPerson}
                    onChange={updateProfileField('contactPerson')}
                    css={fluideInputStyles}
                  />
                </ProfileField>
              </Stack>
            )}

            <Flex align="center" gap="4" flexWrap="wrap">
              <Button type="submit" {...stitchGreenButton} px="6" {...stableBusyProps(profileBusy)}>
                Save changes
              </Button>
              <StatusMessage status={profileStatus} />
            </Flex>
          </Stack>
        </ProfileSection>

        <ProfileSection title="Password" description="Update your sign-in password." isLast={isAdmin}>
          <Stack gap="4" as="form" onSubmit={handlePasswordSubmit} maxW="24rem">
            <ProfileField label="Current password">
              <Input
                type="password"
                value={password.currentPassword}
                onChange={updatePasswordField('currentPassword')}
                css={fluideInputStyles}
              />
            </ProfileField>
            <ProfileField label="New password">
              <Input
                type="password"
                value={password.newPassword}
                onChange={updatePasswordField('newPassword')}
                css={fluideInputStyles}
              />
            </ProfileField>
            <ProfileField label="Confirm new password">
              <Input
                type="password"
                value={password.confirm}
                onChange={updatePasswordField('confirm')}
                css={fluideInputStyles}
              />
            </ProfileField>
            <Flex align="center" gap="4" flexWrap="wrap">
              <Button type="submit" variant="outline" borderRadius="lg" px="6" {...stableBusyProps(passwordBusy)}>
                Update password
              </Button>
              <StatusMessage status={passwordStatus} />
            </Flex>
          </Stack>
        </ProfileSection>

        {!isAdmin && (
          <ProfileSection title="Delete account" description="Permanently remove your account and associated data." isLast>
            <Stack gap="3" maxW="24rem">
              <Input
                type="password"
                placeholder="Enter your password to confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                css={fluideInputStyles}
              />
              <StatusMessage status={deleteStatus} />
              <Button
                variant="outline"
                color="error"
                borderColor="error"
                borderRadius="lg"
                w="fit-content"
                onClick={handleDeleteAccount}
                {...stableBusyProps(deleteBusy)}
              >
                Delete account
              </Button>
            </Stack>
          </ProfileSection>
        )}
      </Box>

      {isProvider && (
        <Box
          bg="surface"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="outlineVariant"
          overflow="hidden"
          mb="6"
        >
          <ProfileSection
            title="Billing & legal"
            description="Details used for invoices and public-sector compatibility."
          >
            <Stack gap="5" as="form" onSubmit={handleBillingSubmit}>
              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="5">
                <ProfileField label="Company name">
                  <Input value={profile.companyName} onChange={updateProfileField('companyName')} css={fluideInputStyles} />
                </ProfileField>
                <ProfileField label="SIRET">
                  <Input value={profile.siret} onChange={updateProfileField('siret')} css={fluideInputStyles} />
                </ProfileField>
                <ProfileField label="IBAN / RIB">
                  <Input value={profile.iban} onChange={updateProfileField('iban')} css={fluideInputStyles} />
                </ProfileField>
                <ProfileField label="BIC">
                  <Input value={profile.bic} onChange={updateProfileField('bic')} css={fluideInputStyles} />
                </ProfileField>
              </Grid>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="5">
                <ProfileField label="Billing address">
                  <Stack gap="2">
                    <Input placeholder="Street" value={profile.billingAddress.line1} onChange={updateNestedField('billingAddress', 'line1')} css={fluideInputStyles} />
                    <Input placeholder="Additional line" value={profile.billingAddress.line2} onChange={updateNestedField('billingAddress', 'line2')} css={fluideInputStyles} />
                    <Grid templateColumns="1fr 1fr" gap="2">
                      <Input placeholder="Postal code" value={profile.billingAddress.postalCode} onChange={updateNestedField('billingAddress', 'postalCode')} css={fluideInputStyles} />
                      <Input placeholder="City" value={profile.billingAddress.city} onChange={updateNestedField('billingAddress', 'city')} css={fluideInputStyles} />
                    </Grid>
                    <Input placeholder="Country" value={profile.billingAddress.country} onChange={updateNestedField('billingAddress', 'country')} css={fluideInputStyles} />
                  </Stack>
                </ProfileField>
                <ProfileField label="Chorus Pro & billing notes">
                  <Stack gap="2">
                    <Flex align="center" gap="2">
                      <Input type="checkbox" checked={profile.billing.chorusProReady} onChange={updateBillingFlag('chorusProReady')} />
                      <Text textStyle="bodySm">Chorus Pro ready</Text>
                    </Flex>
                    <Input placeholder="Chorus service code" value={profile.billing.chorusServiceCode} onChange={updateNestedField('billing', 'chorusServiceCode')} css={fluideInputStyles} />
                    <Input placeholder="Legal entity ID" value={profile.billing.legalEntityId} onChange={updateNestedField('billing', 'legalEntityId')} css={fluideInputStyles} />
                    <Input placeholder="Payment terms" value={profile.billing.paymentTerms} onChange={updateNestedField('billing', 'paymentTerms')} css={fluideInputStyles} />
                    <Input placeholder="Notes" value={profile.billing.notes} onChange={updateNestedField('billing', 'notes')} css={fluideInputStyles} />
                  </Stack>
                </ProfileField>
              </Grid>
              <Flex align="center" gap="4" flexWrap="wrap">
                <Button type="submit" {...stitchGreenButton} px="6" {...stableBusyProps(billingBusy)}>
                  Save billing details
                </Button>
                <StatusMessage status={billingStatus} />
              </Flex>
            </Stack>
          </ProfileSection>

          <ProfileSection
            title="Trust documents"
            description="Insurance, registration, or certification files. Visible to organizers after admin approval."
            isLast
          >
            <Stack gap="4">
              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4">
                <ProfileField label="Document label">
                  <Input
                    value={documentForm.label}
                    onChange={(event) => setDocumentForm((prev) => ({ ...prev, label: event.target.value }))}
                    placeholder="e.g. Professional liability insurance"
                    css={fluideInputStyles}
                  />
                </ProfileField>
                <ProfileField label="Category">
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={documentForm.category}
                      onChange={(event) => setDocumentForm((prev) => ({ ...prev, category: event.target.value }))}
                      css={fluideInputStyles}
                    >
                      {DOCUMENT_CATEGORIES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </ProfileField>
              </Grid>
              <HStack gap="3" flexWrap="wrap">
                <input ref={documentInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleDocumentUpload} />
                <Button {...stitchGreenButton} px="6" onClick={() => documentInputRef.current?.click()} {...stableBusyProps(documentBusy)}>
                  Upload document
                </Button>
              </HStack>
              <StatusMessage status={documentStatus} />

              {(user?.documents || []).length === 0 ? (
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  No documents uploaded yet.
                </Text>
              ) : (
                <Stack gap="2">
                  {(user.documents || []).map((doc) => (
                    <Flex
                      key={doc._id}
                      py="3"
                      px="4"
                      borderWidth="1px"
                      borderColor="outlineVariant"
                      borderRadius="lg"
                      align="center"
                      justify="space-between"
                      gap="3"
                      flexWrap="wrap"
                    >
                      <Box>
                        <Text textStyle="labelSm" fontWeight="600">
                          {doc.label}
                        </Text>
                        <Text textStyle="bodySm" color="onSurfaceVariant">
                          {documentCategoryLabel(doc.category)} · {doc.status}
                        </Text>
                      </Box>
                      <HStack gap="2">
                        <Button as="a" href={doc.url} target="_blank" rel="noopener noreferrer" size="sm" variant="ghost">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" color="error" {...stableBusyProps(deleteDocBusyId === doc._id)} onClick={() => handleDeleteDocument(doc._id)}>
                          Remove
                        </Button>
                      </HStack>
                    </Flex>
                  ))}
                </Stack>
              )}
            </Stack>
          </ProfileSection>
        </Box>
      )}
    </Box>
  )
}
