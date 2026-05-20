import { Box, Table, Text } from '@chakra-ui/react'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { PortalLayout } from '../components/templates/PortalLayout'
import { trips } from '../data/mockData'

/** Admin: read-only view of all platform trips */
export function AdminTripsPage() {
  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="admin" />
        <Text textStyle="headlineMd" mb="2">
          All platform trips
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
          Monitor every outing created by organizers. Admins do not create trips here.
        </Text>
        <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
          <Table.Root>
            <Table.Header bg="navy">
              <Table.Row>
                {['Trip', 'Location', 'Dates', 'Status', 'Organizer type'].map((col) => (
                  <Table.ColumnHeader key={col} py="3" px="5" textStyle="labelSm" color="onNavy">
                    {col}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {trips.map((trip) => (
                <Table.Row key={trip.id}>
                  <Table.Cell py="4" px="5" textStyle="labelMd">
                    {trip.title}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    {trip.location}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    {trip.dates}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    <StatusBadge status={trip.status} />
                  </Table.Cell>
                  <Table.Cell py="4" px="5" textStyle="bodySm" color="onSurfaceVariant">
                    {trip.tags?.[0]?.label ?? '—'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </PortalLayout>
  )
}
