import { Box, Flex, Grid, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { ContactEmailLink } from '../atoms/ContactEmailLink'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { CONTACT_EMAIL, PORTAL_FOOTER } from '../../content/siteContact'

function PortalFooterLink({ to, children }) {
  return (
    <RouterLink to={to}>
      <Text
        fontSize="xs"
        color="whiteAlpha.700"
        fontWeight="500"
        _hover={{ color: 'accentMint' }}
        transition="color 0.15s"
      >
        {children}
      </Text>
    </RouterLink>
  )
}

/**
 * Footer for organizer and supplier portal pages — English copy, contact email visible.
 */
export function PortalFooter() {
  const year = new Date().getFullYear()
  const copy = PORTAL_FOOTER

  return (
    <Box as="footer" w="full" mt="auto" flexShrink={0} borderTopWidth="1px" borderColor="outlineVariant">
      <Box h="3px" w="full" bg="primary" />
      <Box bg="navy" color="onNavy">
        <Grid
          maxW="contentMax"
          mx="auto"
          px={{ base: 4, md: 8 }}
          py="5"
          templateColumns={{ base: '1fr', md: '1fr auto' }}
          gap="4"
          alignItems={{ md: 'center' }}
        >
          <Stack gap="1.5" align={{ base: 'center', md: 'flex-start' }} textAlign={{ base: 'center', md: 'left' }}>
            <Flex align="center" gap="2">
              <MaterialIcon name="support_agent" size={18} color="accentMint" />
              <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color="whiteAlpha.900">
                {copy.supportHint}
              </Text>
            </Flex>
            <Text fontSize="xs" color="whiteAlpha.700" lineHeight="1.55" maxW="md">
              {copy.emailIntro}
            </Text>
            <ContactEmailLink
              display="inline-flex"
              alignItems="center"
              gap="2"
              fontSize="sm"
              color="accentMint"
              fontWeight="600"
              textDecoration="none"
              _hover={{ textDecoration: 'underline' }}
            >
              <MaterialIcon name="mail" size={16} color="accentMint" />
              {CONTACT_EMAIL}
            </ContactEmailLink>
          </Stack>

          <Flex gap="5" flexWrap="wrap" align="center" justify={{ base: 'center', md: 'flex-end' }}>
            <PortalFooterLink to="/contact">Contact form</PortalFooterLink>
            <PortalFooterLink to="/about">{copy.legalAbout}</PortalFooterLink>
            <PortalFooterLink to="/privacy">{copy.legalPrivacy}</PortalFooterLink>
            <PortalFooterLink to="/terms">{copy.legalTerms}</PortalFooterLink>
            <Text fontSize="xs" color="whiteAlpha.500">
              © {year} Flunexia
            </Text>
          </Flex>
        </Grid>
      </Box>
    </Box>
  )
}
