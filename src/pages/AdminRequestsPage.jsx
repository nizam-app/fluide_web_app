import { Box, Table, Text } from '@chakra-ui/react'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { PortalLayout } from '../components/templates/PortalLayout'
import { serviceRequests } from '../data/mockData'

/** Admin: platform-wide request moderation */
export function AdminRequestsPage() {
  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="admin" />
        <Text textStyle="headlineMd" mb="2">
          All booking requests
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
          Moderate every request between organizers and providers on the platform.
        </Text>
        <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="hidden">
          <Table.Root>
            <Table.Header bg="navy">
              <Table.Row>
                {['Trip', 'Organizer', 'Need', 'Date', 'Status'].map((col) => (
                  <Table.ColumnHeader key={col} py="3" px="5" textStyle="labelSm" color="onNavy">
                    {col}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {serviceRequests.map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell py="4" px="5" textStyle="labelMd">
                    {row.trip}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    <Text textStyle="labelMd">{row.organizer}</Text>
                    <Text textStyle="bodySm" color="onSurfaceVariant">
                      {row.orgType}
                    </Text>
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    {row.needType}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    {row.date}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    <StatusBadge status={row.status} />
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
