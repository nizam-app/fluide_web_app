import { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Flex,
  Grid,
  Input,
  NativeSelect,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { TripListingCard } from '../components/molecules/TripListingCard'
import { PortalLayout } from '../components/templates/PortalLayout'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { tripToCard } from '../lib/format'
import { NEED_TYPE_OPTIONS } from '../data/mockData'

const STATUS_FILTERS = [
  { value: '', label: 'All Open' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
]

export function ProviderTripsPage() {
  const [filters, setFilters] = useState({ q: '', needType: '', status: '' })

  const fetcher = useCallback(
    () =>
      api.trips.list({
        q: filters.q || undefined,
        needType: filters.needType || undefined,
        status: filters.status || undefined,
      }),
    [filters.q, filters.needType, filters.status],
  )
  const { data, loading, error } = useApiResource(fetcher)
  const cards = useMemo(() => (data?.trips || []).map(tripToCard).filter(Boolean), [data])

  const update = (field) => (event) => setFilters((prev) => ({ ...prev, [field]: event.target.value }))

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
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr 1fr' }} gap="4" alignItems="end">
            <Box position="relative">
              <Text textStyle="labelSm" color="onSecondaryContainer" mb="2">
                Search
              </Text>
              <MaterialIcon name="search" size={20} color="onSecondaryContainer" position="absolute" left="3" bottom="3" zIndex={1} />
              <Input
                pl="10"
                placeholder="Search opportunities..."
                bg="surface"
                borderRadius="fluide"
                borderColor="outlineVariant"
                value={filters.q}
                onChange={update('q')}
              />
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSecondaryContainer" mb="2">
                Need Type
              </Text>
              <NativeSelect.Root>
                <NativeSelect.Field
                  bg="surface"
                  borderRadius="fluide"
                  borderColor="outlineVariant"
                  value={filters.needType}
                  onChange={update('needType')}
                >
                  <option value="">All Types</option>
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
                <NativeSelect.Field
                  bg="surface"
                  borderRadius="fluide"
                  borderColor="outlineVariant"
                  value={filters.status}
                  onChange={update('status')}
                >
                  {STATUS_FILTERS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
          </Grid>
        </Box>

        {loading ? (
          <Flex justify="center" py="20">
            <Spinner color="primary" />
          </Flex>
        ) : error ? (
          <Text color="error" textStyle="bodySm">
            Could not load trips: {error.message}
          </Text>
        ) : cards.length === 0 ? (
          <Box bg="surface" borderRadius="fluide3xl" p="10" textAlign="center" borderWidth="1px" borderColor="outlineVariant">
            <Text textStyle="headlineSm" mb="2">
              No open trips right now
            </Text>
            <Text textStyle="bodyMd" color="onSurfaceVariant">
              Check back soon — organizers regularly publish new outings.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="6">
            {cards.map((trip) => (
              <TripListingCard key={trip.id} trip={trip} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </PortalLayout>
  )
}
