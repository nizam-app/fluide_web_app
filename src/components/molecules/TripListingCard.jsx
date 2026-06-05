import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { TripCover } from './TripCover'
import { StatusBadge } from './StatusBadge'

export function TripListingCard({ trip, wide = false }) {
  const content = (
    <>
      <Box
        position="relative"
        w={wide ? { base: 'full', md: '45%' } : 'full'}
        h={wide ? 'auto' : '48'}
        minH={wide ? '220px' : undefined}
        flexShrink={0}
        overflow="hidden"
      >
        <TripCover
          trip={{ _id: trip.id, title: trip.title, location: trip.location, image: trip.image }}
          alt={trip.title}
          w="full"
          h="full"
          minH={wide ? '220px' : '192px'}
        />
        <Box position="absolute" top="4" left="4">
          <StatusBadge status={trip.status} />
        </Box>
      </Box>
      <Box p="6" flex="1" display="flex" flexDirection="column">
        <Text textStyle="headlineSm" color="onSurface" mb="2">
          {trip.title}
        </Text>
        <HStack gap="2" color="onSurfaceVariant" textStyle="bodySm" mb="3">
          <MaterialIcon name="calendar_today" size={16} />
          {trip.dates}
        </HStack>
        <Text textStyle="bodySm" color="onSurfaceVariant" mb="4" lineClamp={3}>
          {trip.description}
        </Text>
        <HStack gap="2" mb="4" flexWrap="wrap">
          {trip.tags?.map((tag) => (
            <Flex key={tag.label} align="center" gap="1" px="2" py="1" bg="tagBlue" color="tagBlueFg" borderRadius="md" textStyle="labelSm" fontSize="11px">
              <MaterialIcon name={tag.icon} size={14} />
              {tag.label}
            </Flex>
          ))}
        </HStack>
        <Flex mt="auto" justify="space-between" align="center" pt="4" borderTopWidth="1px" borderColor="outlineVariant">
          <HStack ml="-2">
            {trip.organizers?.map((o, i) => (
              <Flex
                key={i}
                w="8"
                h="8"
                borderRadius="full"
                bg="primaryContainer"
                color="onPrimaryContainer"
                borderWidth="2px"
                borderColor="surface"
                align="center"
                justify="center"
                textStyle="labelSm"
                fontWeight="bold"
                ml={i > 0 ? '-2' : 0}
              >
                {o}
              </Flex>
            ))}
          </HStack>
          <RouterLink to={`/trips/${trip.id}`}>
            <Button variant="ghost" textStyle="labelMd" color="primary" fontWeight="600" _hover={{ bg: 'viewDetailsBg' }}>
              View Details
              <MaterialIcon name="arrow_forward" size={16} />
            </Button>
          </RouterLink>
        </Flex>
      </Box>
    </>
  )

  return (
    <Box
      bg="surface"
      borderRadius="fluide3xl"
      borderWidth="1px"
      borderColor="outlineVariant"
      overflow="hidden"
      shadow="level1"
      display="flex"
      flexDirection={wide ? { base: 'column', md: 'row' } : 'column'}
      gridColumn={wide ? { xl: 'span 2' } : undefined}
    >
      {content}
    </Box>
  )
}
