import { Box, Flex, Grid, HStack, Input, NativeSelect, SimpleGrid, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { TripListingCard } from '../components/molecules/TripListingCard'
import { PortalLayout } from '../components/templates/PortalLayout'
import { NEED_TYPE_OPTIONS, trips } from '../data/mockData'

export function ProviderTripsPage() {
  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="provider" />
        <Box mb="8">
          <Text textStyle="headlineMd" mb="1">
            Available Trips
          </Text>
          <Text textStyle="bodyMd" color="onSurfaceVariant">
            Browse outing requests from organizers. Open a trip to submit your offer.
          </Text>
        </Box>

        <Box bg="secondaryContainer" borderRadius="fluide3xl" p="6" mb="8" borderWidth="1px" borderColor="outlineVariant">
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr 1fr 1fr' }} gap="4" alignItems="end">
            <Box position="relative">
              <Text textStyle="labelSm" color="onSecondaryContainer" mb="2">
                Search
              </Text>
              <MaterialIcon name="search" size={20} color="onSecondaryContainer" position="absolute" left="3" bottom="3" zIndex={1} />
              <Input pl="10" placeholder="Search opportunities..." bg="surface" borderRadius="fluide" borderColor="outlineVariant" />
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSecondaryContainer" mb="2">
                Date
              </Text>
              <Input type="date" bg="surface" borderRadius="fluide" borderColor="outlineVariant" />
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSecondaryContainer" mb="2">
                Need Type
              </Text>
              <NativeSelect.Root>
                <NativeSelect.Field bg="surface" borderRadius="fluide" borderColor="outlineVariant">
                  <option>All Types</option>
                  {NEED_TYPE_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSecondaryContainer" mb="2">
                Status
              </Text>
              <NativeSelect.Root>
                <NativeSelect.Field bg="surface" borderRadius="fluide" borderColor="outlineVariant">
                  {['Open', 'Pending', 'Accepted', 'Completed'].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
          </Grid>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="6">
          {trips.map((trip) => (
            <TripListingCard key={trip.id} trip={trip} />
          ))}
        </SimpleGrid>
      </Box>
    </PortalLayout>
  )
}
