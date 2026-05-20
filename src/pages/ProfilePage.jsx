import { Box, Button, Grid, Input, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { PortalLayout } from '../components/templates/PortalLayout'
import { useAuth } from '../context/AuthContext'
import { ORGANIZATION_TYPES, PROVIDER_TYPES } from '../data/mockData'
import { getRoleLabel } from '../lib/roles'
import { fluideInputStyles, stitchGreenButton } from '../theme/fluide-theme'

export function ProfilePage() {
  const { user, isOrganizer, isProvider, isAdmin } = useAuth()
  const headerRole = isAdmin ? 'admin' : isProvider ? 'provider' : 'organizer'

  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }} maxW="4xl">
        {!isAdmin && <RolePageHeader role={headerRole} />}
        <Text textStyle="headlineMd" mb="1">
          Profile
        </Text>
        <Text textStyle="bodyMd" color="onSurfaceVariant" mb="8">
          {isOrganizer && 'Your organizer account for municipalities, associations, schools, and institutions.'}
          {isProvider && 'Your provider account for transport, activities, catering, hotels, and services.'}
          {isAdmin && 'Internal admin account settings.'}
        </Text>
        <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant">
          <Stack gap="5" as="form">
            <Box>
              <Text textStyle="labelMd" mb="2">
                Name
              </Text>
              <Input defaultValue={user?.name ?? ''} css={fluideInputStyles} />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                Email
              </Text>
              <Input defaultValue={user?.email ?? ''} readOnly css={fluideInputStyles} opacity={0.85} />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                Account type
              </Text>
              <Input defaultValue={getRoleLabel(user?.role)} readOnly css={fluideInputStyles} opacity={0.85} />
            </Box>
            {isOrganizer && (
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Organization type
                </Text>
                <NativeSelect.Root>
                  <NativeSelect.Field css={fluideInputStyles} defaultValue={user?.organizationType ?? 'Municipality'}>
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
                  Provider type
                </Text>
                <NativeSelect.Root>
                  <NativeSelect.Field css={fluideInputStyles} defaultValue={user?.providerType ?? 'Transport'}>
                    {PROVIDER_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>
            )}
            <Button w="fit-content" {...stitchGreenButton} px="8">
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Box>
    </PortalLayout>
  )
}
