import { Box, Flex, Table, Text } from '@chakra-ui/react'
import { StatusBadge } from '../molecules/StatusBadge'

export function RequestsTable({ requests }) {
  return (
    <Box
      bg="surfaceContainerLowest"
      borderRadius="fluide3xl"
      borderWidth="1px"
      borderColor="outlineVariant"
      shadow="level1"
      overflow="hidden"
    >
      <Table.Root size="md">
        <Table.Header bg="surfaceContainerLow">
          <Table.Row>
            <Table.ColumnHeader textStyle="labelSm" color="onSurfaceVariant" py="4" px="6">
              Organizer
            </Table.ColumnHeader>
            <Table.ColumnHeader textStyle="labelSm" color="onSurfaceVariant" py="4" px="6">
              Trip
            </Table.ColumnHeader>
            <Table.ColumnHeader textStyle="labelSm" color="onSurfaceVariant" py="4" px="6">
              Date
            </Table.ColumnHeader>
            <Table.ColumnHeader textStyle="labelSm" color="onSurfaceVariant" py="4" px="6" textAlign="end">
              Status
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((row) => (
            <Table.Row key={row.id} _hover={{ bg: 'surfaceContainerLow' }} transition="background 0.15s">
              <Table.Cell py="4" px="6">
                <Flex align="center" gap="3">
                  <Flex
                    w="10"
                    h="10"
                    borderRadius="full"
                    bg="primaryContainer"
                    color="onPrimaryContainer"
                    align="center"
                    justify="center"
                    textStyle="labelMd"
                    fontWeight="bold"
                  >
                    {row.avatar}
                  </Flex>
                  <Text textStyle="labelMd" color="onSurface">
                    {row.organizer}
                  </Text>
                </Flex>
              </Table.Cell>
              <Table.Cell py="4" px="6">
                <Text textStyle="bodyMd" color="onSurface">
                  {row.trip}
                </Text>
              </Table.Cell>
              <Table.Cell py="4" px="6">
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  {row.date}
                </Text>
              </Table.Cell>
              <Table.Cell py="4" px="6" textAlign="end">
                <StatusBadge status={row.status} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
