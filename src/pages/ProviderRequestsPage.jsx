import { useState } from 'react'
import { Box, Button, Flex, HStack, Table, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FilterChip } from '../components/molecules/FilterChip'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { PortalLayout } from '../components/templates/PortalLayout'
import { serviceRequests } from '../data/mockData'
import { stitchGreenButton } from '../theme/fluide-theme'

const filters = ['All', 'Pending', 'Accepted', 'Completed']

export function ProviderRequestsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const filtered =
    activeFilter === 'All' ? serviceRequests : serviceRequests.filter((r) => r.status === activeFilter.toLowerCase())

  return (
    <PortalLayout>
      <Box p={{ base: 'marginMobile', lg: 'marginDesktop' }}>
        <RolePageHeader role="provider" />
        <Text textStyle="headlineMd" mb="2">
          Requests / Responses
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
          Track trips you responded to — update proposals or mark bookings completed.
        </Text>
        <HStack gap="2" mb="6" flexWrap="wrap">
          {filters.map((f) => (
            <FilterChip key={f} active={activeFilter === f} onClick={() => setActiveFilter(f)}>
              {f}
            </FilterChip>
          ))}
        </HStack>
        <Box bg="surface" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" overflow="auto">
          <Table.Root minW="800px">
            <Table.Header bg="secondaryContainer">
              <Table.Row>
                {['Trip name', 'Organizer', 'Need type', 'Date', 'Status', 'Actions'].map((col) => (
                  <Table.ColumnHeader key={col} py="3" px="5" textStyle="labelSm" color="onSecondaryContainer">
                    {col}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((row) => (
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
                  <Table.Cell py="4" px="5" textStyle="bodySm" color="onSurfaceVariant">
                    {row.date}
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    <StatusBadge status={row.status} />
                  </Table.Cell>
                  <Table.Cell py="4" px="5">
                    <HStack gap="2" flexWrap="wrap">
                      <RouterLink to={`/trips/${row.id}`}>
                        <Button size="sm" {...stitchGreenButton}>
                          View Details
                        </Button>
                      </RouterLink>
                      <Button size="sm" variant="outline" borderRadius="pill">
                        Update Response
                      </Button>
                      {row.status === 'accepted' && (
                        <Button size="sm" variant="ghost" color="primary">
                          Mark Completed
                        </Button>
                      )}
                    </HStack>
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
