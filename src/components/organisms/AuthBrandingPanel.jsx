import { Box, Flex, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../atoms/MaterialIcon'

/** Minimal branding for auth — form stays the focus */
export function AuthBrandingPanel() {
  return (
    <Box
      bg="loginPanel"
      color="white"
      display={{ base: 'none', lg: 'flex' }}
      flexDirection="column"
      justifyContent="space-between"
      p="10"
      minH="100vh"
      w="full"
      maxW="xs"
      flexShrink={0}
    >
      <RouterLink to="/">
        <Flex align="center" gap="2">
          <MaterialIcon name="eco" size={24} color="accentMint" />
          <Text fontSize="lg" fontWeight="800" letterSpacing="0.05em">
            FLUNEXIA
          </Text>
        </Flex>
      </RouterLink>
      <Text textStyle="bodySm" color="whiteAlpha.700" lineHeight="1.6" maxW="xs">
        Save time on group outings — one place for transport, activities, and services.
      </Text>
      <Text textStyle="bodySm" color="whiteAlpha.500">
        © 2024 Flunexia
      </Text>
    </Box>
  )
}
