import { useCallback } from 'react'
import { Box, Flex, Grid, Image, Spinner, Text } from '@chakra-ui/react'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { FavoriteProviderButton } from '../components/molecules/FavoriteProviderButton'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'

export function OrganizerFavoritesPage() {
  const fetcher = useCallback(() => api.favorites.list(), [])
  const { data, loading, error, reload } = useApiResource(fetcher)
  const providers = data?.providers || []

  return (
    <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
      <RolePageHeader role="organizer" />
      <Text textStyle="headlineMd" mb="2">
        Favorite suppliers
      </Text>
      <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
        Quickly access suppliers you work with most often.
      </Text>

      {loading ? (
        <Flex justify="center" py="20">
          <Spinner color="primary" />
        </Flex>
      ) : error ? (
        <Text color="error" textStyle="bodySm">
          Could not load favorites: {error.message}
        </Text>
      ) : providers.length === 0 ? (
        <Box bg="surface" borderRadius="xl" borderWidth="1px" borderColor="outlineVariant" p="8" textAlign="center">
          <Text textStyle="bodyMd" color="onSurfaceVariant">
            No favorite suppliers yet. Open a trip and favorite providers from the recommended list.
          </Text>
        </Box>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
          {providers.map((provider) => (
            <Flex
              key={provider._id}
              bg="surface"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="outlineVariant"
              p="4"
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
                <Text textStyle="labelMd">{provider.name}</Text>
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  {provider.providerType}
                  {provider.companyName ? ` · ${provider.companyName}` : ''}
                </Text>
              </Box>
              <FavoriteProviderButton
                providerId={provider._id}
                initialFavorite
                onChange={(isFavorite) => {
                  if (!isFavorite) reload()
                }}
              />
            </Flex>
          ))}
        </Grid>
      )}
    </Box>
  )
}
