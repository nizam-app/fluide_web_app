import { Flex } from '@chakra-ui/react'

export const CURRENCY_OPTIONS = ['EUR', 'USD', 'GBP', 'CHF']

export function CurrencyPicker({ value = 'EUR', onChange }) {
  return (
    <Flex gap="2" flexWrap="wrap">
      {CURRENCY_OPTIONS.map((code) => {
        const active = value === code
        return (
          <Flex
            key={code}
            as="button"
            type="button"
            align="center"
            justify="center"
            minW="4.5rem"
            px="4"
            py="3"
            borderRadius="fluide"
            borderWidth="1px"
            borderColor={active ? 'primary' : 'outlineVariant'}
            bg={active ? 'primaryContainer' : 'surfaceContainerLow'}
            color={active ? 'onPrimaryContainer' : 'onSurface'}
            fontWeight="700"
            fontSize="md"
            letterSpacing="0.04em"
            whiteSpace="nowrap"
            cursor="pointer"
            transition="border-color 0.15s, background 0.15s"
            _hover={{ borderColor: 'primary', bg: active ? 'primaryContainer' : 'surface' }}
            onClick={() => onChange(code)}
          >
            {code}
          </Flex>
        )
      })}
    </Flex>
  )
}
