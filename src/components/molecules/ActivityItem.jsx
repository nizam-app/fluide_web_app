import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { StatusBadge } from './StatusBadge'

export function ActivityItem({ activity }) {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align={{ md: 'center' }}
      justify="space-between"
      gap="4"
      bg="surfaceContainerLowest"
      borderWidth="1px"
      borderColor="outlineVariant"
      borderRadius="fluide3xl"
      p="6"
      shadow="level1"
      opacity={activity.opacity}
      transition="box-shadow 0.2s"
      _hover={{ shadow: 'level2' }}
    >
      <Flex align="center" gap="4">
        <Flex
          w="12"
          h="12"
          borderRadius="fluide"
          bg="surfaceVariant"
          color={activity.status === 'rejected' ? 'onSurfaceVariant' : 'primary'}
          align="center"
          justify="center"
          flexShrink={0}
        >
          <MaterialIcon name={activity.icon} filled size={24} />
        </Flex>
        <Box>
          <Text textStyle="headlineSm" color="onBackground">
            {activity.title}
          </Text>
          <Text textStyle="bodySm" color="onSurfaceVariant">
            {activity.subtitle}
          </Text>
        </Box>
      </Flex>
      <Flex align="center" gap="6">
        <Flex ml="-3">
          {Array.from({ length: activity.avatars }).map((_, i) => (
            <Box
              key={i}
              w="8"
              h="8"
              borderRadius="full"
              bg={i % 2 === 0 ? '#cbd5e1' : '#94a3b8'}
              borderWidth="2px"
              borderColor="white"
              ml={i > 0 ? '-3' : 0}
            />
          ))}
          {activity.extraAvatars && (
            <Flex
              w="8"
              h="8"
              borderRadius="full"
              bg="surfaceVariant"
              borderWidth="2px"
              borderColor="white"
              ml="-3"
              align="center"
              justify="center"
              textStyle="labelSm"
              color="primary"
            >
              +{activity.extraAvatars}
            </Flex>
          )}
        </Flex>
        <StatusBadge status={activity.status} />
        <IconButton variant="ghost" size="sm" borderRadius="full" aria-label="More options">
          <MaterialIcon name="more_vert" size={20} color="onSurfaceVariant" />
        </IconButton>
      </Flex>
    </Flex>
  )
}
