import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'

export function SupplierKpiGrid({ items }) {
  return (
    <Grid templateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }} gap="3" mb="10">
      {items.map((item) => (
        <Box
          key={item.label}
          bg="surface"
          borderWidth="1px"
          borderColor="outlineVariant"
          borderRadius="xl"
          p="4"
          shadow="level1"
        >
          <Flex justify="space-between" align="flex-start" gap="2" mb="2">
            <Text textStyle="labelSm" color="onSurfaceVariant" lineHeight="1.3">
              {item.label}
            </Text>
            <Flex
              w="8"
              h="8"
              borderRadius="md"
              bg={item.iconBg || 'surfaceContainer'}
              color={item.iconColor || 'onSurfaceVariant'}
              align="center"
              justify="center"
              flexShrink={0}
            >
              <MaterialIcon name={item.icon} size={18} />
            </Flex>
          </Flex>
          <Text fontSize="xl" fontWeight="700" lineHeight="1.1" color="onBackground">
            {item.value}
          </Text>
          {item.hint ? (
            <Text textStyle="bodySm" color={item.urgent ? 'error' : 'onSurfaceVariant'} mt="1" lineClamp={2}>
              {item.hint}
            </Text>
          ) : null}
        </Box>
      ))}
    </Grid>
  )
}
