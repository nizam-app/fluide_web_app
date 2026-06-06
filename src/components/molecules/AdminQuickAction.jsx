import { Box, Flex, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../atoms/MaterialIcon'

const accentStyles = {
  primary: {
    iconBg: 'primaryContainer',
    iconColor: 'primary',
    badgeBg: 'primaryContainer',
    badgeColor: 'primary',
    hoverBorder: 'primary',
  },
  secondary: {
    iconBg: 'secondaryContainer',
    iconColor: 'secondary',
    badgeBg: 'secondaryContainer',
    badgeColor: 'secondary',
    hoverBorder: 'secondary',
  },
  error: {
    iconBg: 'errorContainer',
    iconColor: 'error',
    badgeBg: 'errorContainer',
    badgeColor: 'error',
    hoverBorder: 'error',
  },
}

export function AdminQuickAction({ icon, label, description, to, onClick, badge, accent = 'primary' }) {
  const tone = accentStyles[accent] || accentStyles.primary

  const shared = {
    direction: 'row',
    align: 'flex-start',
    gap: '3',
    p: '4',
    bg: 'surface',
    borderRadius: 'xl',
    borderWidth: '1px',
    borderColor: 'outlineVariant',
    minH: '5.5rem',
    h: 'full',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    _hover: {
      borderColor: tone.hoverBorder,
      boxShadow: 'level1',
    },
    textAlign: 'left',
    w: 'full',
    cursor: 'pointer',
  }

  const inner = (
    <>
      <Flex
        w="10"
        h="10"
        borderRadius="lg"
        bg={tone.iconBg}
        color={tone.iconColor}
        align="center"
        justify="center"
        flexShrink={0}
      >
        <MaterialIcon name={icon} size={20} />
      </Flex>
      <Box flex="1" minW="0">
        <Flex align="center" justify="space-between" gap="2" mb="1">
          <Text textStyle="labelMd" fontWeight="600" lineHeight="short">
            {label}
          </Text>
          {badge != null && badge !== '' ? (
            <Box
              as="span"
              px="2"
              py="0.5"
              borderRadius="pill"
              bg={tone.badgeBg}
              color={tone.badgeColor}
              textStyle="labelSm"
              fontWeight="700"
              flexShrink={0}
            >
              {badge}
            </Box>
          ) : null}
        </Flex>
        {description ? (
          <Text textStyle="bodySm" color="onSurfaceVariant" lineClamp={2} lineHeight="1.45">
            {description}
          </Text>
        ) : null}
      </Box>
    </>
  )

  if (to) {
    return (
      <Flex as={RouterLink} to={to} {...shared}>
        {inner}
      </Flex>
    )
  }

  return (
    <Flex as="button" type="button" onClick={onClick} {...shared}>
      {inner}
    </Flex>
  )
}
