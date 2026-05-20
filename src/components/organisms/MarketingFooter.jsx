import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FluideLogo } from '../atoms/FluideLogo'

const footerLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Impact Report', href: '#' },
]

export function MarketingFooter({ compact = false }) {
  return (
    <Box as="footer" w="full" py="8" borderTopWidth="1px" borderColor="outlineVariant" bg="surface" mt="auto">
      <Flex
        maxW="contentMax"
        mx="auto"
        px={{ base: 'marginMobile', lg: 'marginDesktop' }}
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        gap="4"
      >
        <HStack gap="4" flexWrap="wrap" justify={{ base: 'center', md: 'flex-start' }}>
          <FluideLogo to="/" />
          {!compact && (
            <Text textStyle="bodySm" color="onSurfaceVariant" display={{ base: 'none', sm: 'block' }}>
              Des sorties, du lien, du sens.
            </Text>
          )}
          <Text textStyle="bodySm" color="onSurfaceVariant">
            © 2024 Fluide Organisation. All rights reserved.
          </Text>
        </HStack>
        <HStack as="nav" gap="6" flexWrap="wrap" justify="center">
          {footerLinks.map((link) => (
            <RouterLink key={link.label} to={link.href}>
              <Text textStyle="bodySm" color="onSurfaceVariant" textDecoration="underline" _hover={{ color: 'primary' }}>
                {link.label}
              </Text>
            </RouterLink>
          ))}
        </HStack>
      </Flex>
    </Box>
  )
}
