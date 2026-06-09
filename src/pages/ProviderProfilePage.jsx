import { useCallback } from 'react'
import { Box, Button, Flex, Grid, Image, Spinner, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { FavoriteProviderButton } from '../components/molecules/FavoriteProviderButton'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { useAuth } from '../context/AuthContext'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { formatProviderTypesLabel } from '../lib/providerTypes'
import { stitchGreenButton } from '../theme/fluide-theme'

export function ProviderProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isOrganizer, isAdmin, isProvider } = useAuth()
  const headerRole = isAdmin ? 'admin' : isProvider ? 'provider' : 'organizer'

  const fetcher = useCallback(() => api.users.getProvider(id), [id])
  const { data, loading, error } = useApiResource(fetcher)
  const provider = data?.provider

  return (
    <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
      <RolePageHeader role={headerRole} />
      <Button
        variant="ghost"
        color="primary"
        mb="6"
        px="0"
        onClick={() => navigate(-1)}
      >
        <MaterialIcon name="arrow_back" size={18} />
        Back
      </Button>

      {loading ? (
        <Flex justify="center" py="20">
          <Spinner color="primary" />
        </Flex>
      ) : error || !provider ? (
        <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" p="8" textAlign="center">
          <Text textStyle="bodyMd" color="error" mb="4">
            {error?.message || 'Supplier not found.'}
          </Text>
          <RouterLink to="/trips">
            <Button {...stitchGreenButton}>Back to trips</Button>
          </RouterLink>
        </Box>
      ) : (
        <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" p={{ base: '6', md: '8' }}>
          <Flex justify="space-between" align="flex-start" gap="4" flexWrap="wrap" mb="8">
            <Flex align="center" gap="4">
              <Flex
                w="20"
                h="20"
                borderRadius="full"
                bg="surfaceContainer"
                align="center"
                justify="center"
                overflow="hidden"
              >
                {provider.avatar ? (
                  <Image src={provider.avatar} alt="" w="full" h="full" objectFit="cover" />
                ) : (
                  <MaterialIcon name="person" size={36} color="primary" />
                )}
              </Flex>
              <Box>
                <Text textStyle="headlineMd">{provider.name}</Text>
                <Text textStyle="bodySm" color="onSurfaceVariant" mt="1">
                  {formatProviderTypesLabel(provider)}
                </Text>
                {provider.rating != null && (
                  <Text textStyle="labelSm" color="primary" mt="1">
                    {provider.rating} ★ · {provider.reviewCount || 0} reviews
                  </Text>
                )}
              </Box>
            </Flex>
            {isOrganizer && (
              <FavoriteProviderButton providerId={provider._id} initialFavorite={false} />
            )}
          </Flex>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
            <Stack gap="4">
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Company
                </Text>
                <Text textStyle="bodyMd">{provider.companyName || '—'}</Text>
              </Box>
              <Box>
                <Text textStyle="labelMd" mb="2">
                  Contact person
                </Text>
                <Text textStyle="bodyMd">{provider.contactPerson || '—'}</Text>
              </Box>
            </Stack>
            <Box>
              <Text textStyle="labelMd" mb="2">
                About
              </Text>
              <Text textStyle="bodyMd" color="onSurfaceVariant" whiteSpace="pre-wrap">
                {provider.companyDescription || 'No company description provided yet.'}
              </Text>
            </Box>
          </Grid>
        </Box>
      )}
    </Box>
  )
}
