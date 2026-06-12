import { Box, Text } from '@chakra-ui/react'

export function ProfileSection({ title, description, children, isLast = false }) {
  return (
    <Box
      px={{ base: 5, md: 8 }}
      py={{ base: 6, md: 7 }}
      borderBottomWidth={isLast ? 0 : '1px'}
      borderColor="outlineVariant"
    >
      {(title || description) && (
        <Box mb="6">
          {title ? (
            <Text fontSize="17px" lineHeight="1.3" fontWeight="600" color="onSurface">
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text textStyle="bodySm" color="onSurfaceVariant" mt="1.5" maxW="40rem">
              {description}
            </Text>
          ) : null}
        </Box>
      )}
      {children}
    </Box>
  )
}

export function ProfileField({ label, children, hint, fullWidth = false }) {
  return (
    <Box gridColumn={fullWidth ? { sm: '1 / -1' } : undefined}>
      <Text fontSize="14px" lineHeight="1.4" fontWeight="600" color="onSurface" mb="2">
        {label}
      </Text>
      {children}
      {hint ? (
        <Text textStyle="bodySm" color="onSurfaceVariant" mt="2">
          {hint}
        </Text>
      ) : null}
    </Box>
  )
}
