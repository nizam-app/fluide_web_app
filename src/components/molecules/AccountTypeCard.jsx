import { Box, Flex, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'

const accents = {
  info: {
    border: 'infoFg',
    bg: 'infoBg',
    badgeBg: '#E3F2FD',
    badgeColor: '#1565C0',
  },
  provider: {
    border: 'primary',
    bg: 'secondaryContainer',
    badgeBg: '#E8F5E9',
    badgeColor: '#2D6A4F',
  },
}

export function AccountTypeCard({ value, label, emoji, shortLabel, description, icon, accent = 'info', checked, onChange }) {
  const theme = accents[accent] ?? accents.info

  return (
    <Box
      as="label"
      cursor="pointer"
      display="flex"
      flexDirection="column"
      p={{ base: 4, sm: 5 }}
      borderRadius="fluide3xl"
      borderWidth="2px"
      borderColor={checked ? theme.border : 'outlineVariant'}
      bg={checked ? theme.bg : 'surface'}
      transition="all 0.2s"
      shadow={checked ? 'level1' : 'none'}
      _hover={{ borderColor: theme.border }}
    >
      <input
        type="radio"
        name="account_type"
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <Flex align="center" gap="2" mb="3">
        <Text fontSize="lg" lineHeight="1" aria-hidden>
          {emoji}
        </Text>
        <Text textStyle="headlineSm" color="onSurface" fontWeight="700">
          {label}
        </Text>
      </Flex>
      <Box
        px="3"
        py="1"
        borderRadius="pill"
        bg={theme.badgeBg}
        color={theme.badgeColor}
        textStyle="labelSm"
        fontWeight="600"
        w="fit-content"
        mb="3"
      >
        {shortLabel}
      </Box>
      <Flex align="flex-start" gap="2">
        <MaterialIcon name={icon} size={20} color={checked ? theme.border : 'onSurfaceVariant'} />
        <Text textStyle="bodySm" color="onSurfaceVariant">
          {description}
        </Text>
      </Flex>
    </Box>
  )
}
