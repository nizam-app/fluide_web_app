import { Box, Text } from '@chakra-ui/react'

export function ProfileSection({ title, description, children, isLast = false }) {
  return (
    <Box
      px={{ base: 5, md: 6 }}
      py={{ base: 5, md: 6 }}
      borderBottomWidth={isLast ? 0 : '1px'}
      borderColor="outlineVariant"
    >
      {(title || description) && (
        <Box mb="5">
          {title ? (
            <Text textStyle="labelMd" fontWeight="600" color="onSurface">
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text textStyle="bodySm" color="onSurfaceVariant" mt={title ? '1' : 0}>
              {description}
            </Text>
          ) : null}
        </Box>
      )}
      {children}
    </Box>
  )
}

export function ProfileField({ label, children, hint }) {
  return (
    <Box>
      <Text textStyle="labelSm" color="onSurfaceVariant" mb="2" fontWeight="500">
        {label}
      </Text>
      {children}
      {hint ? (
        <Text textStyle="bodySm" color="onSurfaceVariant" mt="1.5">
          {hint}
        </Text>
      ) : null}
    </Box>
  )
}
