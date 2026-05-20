import { Box, Flex, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'

export function AccountTypeCard({ value, label, description, icon, checked, onChange }) {
  return (
    <Box
      as="label"
      cursor="pointer"
      display="flex"
      flexDirection="column"
      p="4"
      borderRadius="fluide"
      borderWidth="2px"
      borderColor={checked ? 'primary' : 'outlineVariant'}
      bg={checked ? 'primaryContainer' : 'surface'}
      transition="all 0.2s"
      _hover={{ borderColor: 'primary' }}
    >
      <input
        type="radio"
        name="account_type"
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <Flex align="center" gap="3" mb="2">
        <MaterialIcon name={icon} filled={checked} size={24} color={checked ? 'primary' : 'onSurfaceVariant'} />
        <Text textStyle="labelMd" color="onSurface">
          {label}
        </Text>
      </Flex>
      <Text textStyle="bodySm" color="onSurfaceVariant" fontSize="xs">
        {description}
      </Text>
    </Box>
  )
}
