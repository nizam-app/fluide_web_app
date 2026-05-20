import { Box, Button, Flex, Grid, HStack, Input, NativeSelect, SimpleGrid, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { TripListingCard } from '../components/molecules/TripListingCard'
import { PortalLayout } from '../components/templates/PortalLayout'
import { NEED_TYPE_OPTIONS, trips } from '../data/mockData'
import { stitchGreenButton } from '../theme/fluide-theme'

export function OrganizerTripsPage() {
  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="organizer" />
        <Flex justify="space-between" align="flex-end" mb="8" flexWrap="wrap" gap="4">
          <Box>
            <Text textStyle="headlineMd" mb="1">
              My Trips
            </Text>
            <Text textStyle="bodyMd" color="onSurfaceVariant">
              Trips you created — search, filter, and open details to review provider responses.
            </Text>
          </Box>
          <RouterLink to="/create-trip">
            <Button {...stitchGreenButton} px="6" py="2.5">
              <MaterialIcon name="add" size={18} />
              Create New Trip
            </Button>
          </RouterLink>
        </Flex>

        <Box bg="infoBg" borderRadius="fluide3xl" p="6" mb="8" borderWidth="1px" borderColor="outlineVariant">
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr 1fr 1fr' }} gap="4" alignItems="end">
            <Box position="relative">
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Search
              </Text>
              <MaterialIcon name="search" size={20} color="outline" position="absolute" left="3" bottom="3" zIndex={1} />
              <Input pl="10" placeholder="Search trips, locations..." bg="surface" borderRadius="fluide" borderColor="outlineVariant" />
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Date
              </Text>
              <Input type="date" bg="surface" borderRadius="fluide" borderColor="outlineVariant" />
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
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
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Status
              </Text>
              <NativeSelect.Root>
                <NativeSelect.Field bg="surface" borderRadius="fluide" borderColor="outlineVariant">
                  {['All Status', 'Scheduled', 'In Progress', 'Completed'].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
          </Grid>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="6">
          {trips.map((trip) => (
            <TripListingCard key={trip.id} trip={trip} wide={trip.wide} />
          ))}
        </SimpleGrid>
      </Box>
    </PortalLayout>
  )
}
