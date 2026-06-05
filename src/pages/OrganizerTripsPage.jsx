import { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  NativeSelect,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { TripListingCard } from '../components/molecules/TripListingCard'
import { useApiResource } from '../hooks/useApiResource'
import api from '../lib/api'
import { tripToCard } from '../lib/format'
import { toApiNeedType } from '../lib/needTypes'
import { NEED_TYPE_OPTIONS } from '../data/mockData'
import { stitchGreenButton } from '../theme/fluide-theme'

const STATUS_FILTERS = [
  { value: '', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function OrganizerTripsPage() {
  const [filters, setFilters] = useState({ q: '', needType: '', status: '' })
  const fetcher = useCallback(
    () =>
      api.trips.list({
        q: filters.q || undefined,
        needType: filters.needType ? toApiNeedType(filters.needType) : undefined,
        status: filters.status || undefined,
      }),
    [filters.q, filters.needType, filters.status],
  )
  const { data, loading, error } = useApiResource(fetcher)

  const cards = useMemo(() => (data?.trips || []).map(tripToCard).filter(Boolean), [data])

  const update = (field) => (event) => setFilters((prev) => ({ ...prev, [field]: event.target.value }))

  return (
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
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr 1fr' }} gap="4" alignItems="end">
            <Box position="relative">
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Search
              </Text>
              <MaterialIcon name="search" size={20} color="outline" position="absolute" left="3" bottom="3" zIndex={1} />
              <Input
                pl="10"
                placeholder="Search trips, locations..."
                bg="surface"
                borderRadius="fluide"
                borderColor="outlineVariant"
                value={filters.q}
                onChange={update('q')}
              />
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
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
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
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
              No trips yet
            </Text>
            <Text textStyle="bodyMd" color="onSurfaceVariant" mb="6">
              Create your first trip to start collecting supplier offers.
            </Text>
            <RouterLink to="/create-trip">
              <Button {...stitchGreenButton}>
                <MaterialIcon name="add" size={18} />
                Create a Trip
              </Button>
            </RouterLink>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="6">
            {cards.map((trip) => (
              <TripListingCard key={trip.id} trip={trip} />
            ))}
          </SimpleGrid>
        )}
      </Box>
  )
}
