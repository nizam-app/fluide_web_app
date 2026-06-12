import { Box, Flex } from '@chakra-ui/react'

const OPTIONS = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
]

export function EmailLanguagePicker({ value = 'fr', onChange, disabled }) {
  return (
    <Flex
      p="1"
      gap="1"
      bg="surfaceContainerLow"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="outlineVariant"
      role="radiogroup"
      aria-label="Preferred language for email"
    >
      {OPTIONS.map((option) => {
        const selected = value === option.value
        return (
          <Box
            key={option.value}
            as="button"
            type="button"
            disabled={disabled}
            flex="1"
            minH="3rem"
            px="4"
            borderRadius="md"
            fontSize="16px"
            fontWeight="600"
            lineHeight="1.2"
            color={selected ? 'onSurface' : 'onSurfaceVariant'}
            bg={selected ? 'surface' : 'transparent'}
            boxShadow={selected ? 'level1' : 'none'}
            borderWidth={selected ? '1px' : '0'}
            borderColor="outlineVariant"
            onClick={() => onChange?.(option.value)}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            opacity={disabled ? 0.6 : 1}
            transition="background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease"
            _hover={disabled || selected ? undefined : { color: 'onSurface', bg: 'surfaceContainer' }}
          >
            {option.label}
          </Box>
        )
      })}
    </Flex>
  )
}
