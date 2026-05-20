import { Box, Flex, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'

export function StatCard({ label, value, trend, trendUp, urgent, icon, iconBg, iconColor }) {
  return (
    <Box
      bg="surface"
      borderWidth="1px"
      borderColor="outlineVariant"
      borderRadius="fluide3xl"
      p="6"
      shadow="level1"
    >
      <Flex justify="space-between" align="flex-start" mb="4">
        <Text textStyle="labelSm" color="onSurfaceVariant" textTransform="uppercase">
          {label}
        </Text>
        <Flex w="10" h="10" borderRadius="lg" bg={iconBg} color={iconColor} align="center" justify="center">
          <MaterialIcon name={icon} size={22} />
        </Flex>
      </Flex>
      <Text textStyle="headlineLg" color="onBackground" fontWeight="700">
        {value}
      </Text>
      {trend && (
        <Flex align="center" gap="1" mt="2">
          {trendUp !== undefined && (
            <MaterialIcon
              name={trendUp ? 'trending_up' : urgent ? 'warning' : 'schedule'}
              size={14}
              color={urgent ? 'error' : trendUp ? 'primary' : 'onSurfaceVariant'}
            />
          )}
          <Text textStyle="bodySm" color={urgent ? 'error' : trendUp ? 'primary' : 'onSurfaceVariant'} fontWeight={urgent ? '600' : '400'}>
            {trend}
          </Text>
        </Flex>
      )}
    </Box>
  )
}
