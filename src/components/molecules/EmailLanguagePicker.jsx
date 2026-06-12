import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'

const OPTIONS = [
  {
    value: 'fr',
    label: 'Français',
    description: 'E-mails de notification en français',
    flag: '🇫🇷',
  },
  {
    value: 'en',
    label: 'English',
    description: 'Notification emails in English',
    flag: '🇬🇧',
  },
]

export function EmailLanguagePicker({ value = 'fr', onChange, disabled }) {
  return (
    <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="3">
      {OPTIONS.map((option) => {
        const checked = value === option.value
        return (
          <Box
            key={option.value}
            as="button"
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(option.value)}
            textAlign="left"
            w="full"
            p="4"
            borderRadius="xl"
            borderWidth="2px"
            borderColor={checked ? 'primary' : 'outlineVariant'}
            bg={checked ? 'primaryContainer' : 'surface'}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            opacity={disabled ? 0.7 : 1}
            transition="all 0.2s"
            _hover={disabled ? undefined : { borderColor: 'primary' }}
          >
            <Flex align="center" gap="3" mb="2">
              <Text fontSize="xl" lineHeight="1" aria-hidden>
                {option.flag}
              </Text>
              <Text textStyle="labelMd" fontWeight="700" color={checked ? 'onPrimaryContainer' : 'onSurface'}>
                {option.label}
              </Text>
              {checked && (
                <Box ml="auto">
                  <MaterialIcon name="check_circle" size={20} color="primary" />
                </Box>
              )}
            </Flex>
            <Text
              textStyle="bodySm"
              color={checked ? 'onPrimaryContainer' : 'onSurfaceVariant'}
              opacity={checked ? 0.9 : 1}
            >
              {option.description}
            </Text>
          </Box>
        )
      })}
    </Grid>
  )
}
