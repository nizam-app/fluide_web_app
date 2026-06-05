import { useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, Grid, Image, Input, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { ORGANIZATION_TYPES, PROVIDER_TYPES } from '../data/mockData'
import { getRoleLabel } from '../lib/roles'
import { fluideInputStyles, stitchBlackButton, stitchGreenButton } from '../theme/fluide-theme'

export function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { user, isOrganizer, isProvider, isAdmin, updateProfile, updatePassword, logout, refresh } = useAuth()
  const headerRole = isAdmin ? 'admin' : isProvider ? 'provider' : 'organizer'

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organizationType: user?.organizationType || 'Municipality',
    providerType: user?.providerType || 'Transport',
  })
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState({ type: null, message: '' })
  const [profileStatus, setProfileStatus] = useState({ type: null, message: '' })
  const [profileBusy, setProfileBusy] = useState(false)

  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [passwordStatus, setPasswordStatus] = useState({ type: null, message: '' })
  const [passwordBusy, setPasswordBusy] = useState(false)

  useEffect(() => {
    const handle = Promise.resolve().then(() =>
      setProfile({
        name: user?.name || '',
        email: user?.email || '',
        organizationType: user?.organizationType || 'Municipality',
        providerType: user?.providerType || 'Transport',
      }),
    )
    return () => {
      handle.catch(() => {})
    }
  }, [user])

  const updateProfileField = (field) => (event) =>
    setProfile((prev) => ({ ...prev, [field]: event.target.value }))
  const updatePasswordField = (field) => (event) =>
    setPassword((prev) => ({ ...prev, [field]: event.target.value }))

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
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
      if (isProvider) payload.providerType = profile.providerType
      await updateProfile(payload)
      setProfileStatus({ type: 'success', message: 'Profile updated.' })
    } catch (err) {
      setProfileStatus({ type: 'error', message: err?.message || 'Could not update your profile.' })
    } finally {
      setProfileBusy(false)
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

  return (
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }} maxW="4xl">
        {!isAdmin && <RolePageHeader role={headerRole} />}
        <Text textStyle="headlineMd" mb="1">
          Profile
        </Text>
        <Text textStyle="bodyMd" color="onSurfaceVariant" mb="8">
          {isOrganizer && 'Your organizer account for municipalities, associations, schools, and institutions.'}
          {isProvider && 'Your supplier account for transport, activities, catering, hotels, and services.'}
          {isAdmin && 'Internal admin account settings.'}
        </Text>

        <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant" mb="6">
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
            {isProvider && (
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Supplier type
                </Text>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    css={fluideInputStyles}
                    value={profile.providerType}
                    onChange={updateProfileField('providerType')}
                  >
                    {PROVIDER_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>
            )}
            {profileStatus.message && (
              <Text textStyle="bodySm" color={profileStatus.type === 'success' ? 'primary' : 'error'}>
                {profileStatus.message}
              </Text>
            )}
            <Button type="submit" w="fit-content" {...stitchGreenButton} px="8" loading={profileBusy} disabled={profileBusy}>
              Save changes
            </Button>
          </Stack>
        </Box>

        <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant">
          <Text textStyle="headlineSm" mb="4">
            Change password
          </Text>
          <Stack gap="5" as="form" onSubmit={handlePasswordSubmit}>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="5">
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
              <Box />
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
            </Grid>
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
