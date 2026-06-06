import { Box, Flex, Text } from '@chakra-ui/react'

/** Compact KPI strip — single card, miniaturized metrics. */
export function AdminCompactStats({ title = 'At a glance', items }) {
  return (
    <Box
      bg="surface"
      borderWidth="1px"
      borderColor="outlineVariant"
      borderRadius="xl"
      overflow="hidden"
      h="full"
    >
      {title ? (
        <Box px="4" py="3" borderBottomWidth="1px" borderColor="outlineVariant" bg="surfaceContainerLow">
          <Text textStyle="labelSm" color="onSurfaceVariant" fontWeight="600">
            {title}
          </Text>
        </Box>
      ) : null}
      <Flex direction={{ base: 'column', sm: 'row' }} divideX={{ sm: '1px' }} divideY={{ base: '1px', sm: '0' }}>
        {items.map((item) => (
          <Box key={item.label} flex="1" px="4" py="4" minW="0">
            <Text fontSize="2xl" fontWeight="700" lineHeight="1" color="onBackground">
              {item.value ?? '—'}
            </Text>
            <Text textStyle="labelSm" color="onSurface" fontWeight="600" mt="2">
              {item.label}
            </Text>
            {item.hint ? (
              <Text textStyle="bodySm" color="onSurfaceVariant" mt="1" lineClamp={2}>
                {item.hint}
              </Text>
            ) : null}
          </Box>
        ))}
      </Flex>
    </Box>
  )
}
