import { Box, Flex, Grid, Link, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { BrandInlineText } from '../atoms/BrandInlineText'
import { FluideLogo } from '../atoms/FluideLogo'
import { ContactEmailLink } from '../atoms/ContactEmailLink'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { FOOTER } from '../../content/homeMarketing'
import { CONTACT_EMAIL, FOOTER_CONTACT, getWhatsAppUrl, LINKEDIN_URL } from '../../content/siteContact'
import { WhatsAppIcon, LinkedInIcon } from '../atoms/SocialBrandIcon'
import { useLocale } from '../../context/LocaleContext'

function FooterColumnTitle({ children }) {
  return (
    <Flex align="center" gap="2" mb="3">
      <Box w="3px" h="4" borderRadius="full" bg="primary" flexShrink={0} />
      <Text
        fontSize="xs"
        fontWeight="700"
        letterSpacing="0.12em"
        textTransform="uppercase"
        color="onSurface"
      >
        {children}
      </Text>
    </Flex>
  )
}

function FooterNavLink({ to, children, external = false, icon = null }) {
  const textProps = {
    fontSize: 'sm',
    color: 'onSurfaceVariant',
    fontWeight: '500',
    lineHeight: '2',
    _hover: { color: 'primary' },
    transition: 'color 0.15s',
  }

  if (external) {
    return (
      <Link
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        display="inline-flex"
        alignItems="center"
        gap="2"
        {...textProps}
      >
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <RouterLink to={to}>
      <Text as="span" display="inline-flex" alignItems="center" gap="2" {...textProps}>
        {icon}
        {children}
      </Text>
    </RouterLink>
  )
}

function FooterColumn({ children, align = 'flex-start', textAlign = 'left' }) {
  return (
    <Stack
      gap="1"
      align={{ base: 'center', md: align }}
      textAlign={{ base: 'center', md: textAlign }}
      h="full"
    >
      {children}
    </Stack>
  )
}

export function MarketingFooter({ compact = false }) {
  const { locale } = useLocale()
  const copy = FOOTER[locale]
  const contact = FOOTER_CONTACT[locale]
  const year = new Date().getFullYear()

  return (
    <Box as="footer" w="full" mt="auto" bg="surfaceContainerLow" borderTopWidth="1px" borderColor="outlineVariant">
      <Box h="4px" w="full" bg="primary" />

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 12, md: 14 }}>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: '1.5fr 1fr 1.15fr' }}
          gap={{ base: 10, md: 8, lg: 12 }}
          alignItems="start"
        >
          {/* Brand */}
          <FooterColumn align="flex-start" textAlign="left">
            <Box alignSelf={{ base: 'center', md: 'flex-start' }}>
              <FluideLogo to="/" />
            </Box>
            {!compact && (
              <>
                <Text
                  fontSize="sm"
                  color="primary"
                  fontWeight="600"
                  lineHeight="1.5"
                  maxW="xs"
                  mt="2"
                  fontStyle="italic"
                  className="notranslate"
                  translate="no"
                  lang={locale}
                >
                  {copy.tagline}
                </Text>
                <Text
                  fontSize="sm"
                  color="onSurfaceVariant"
                  lineHeight="1.7"
                  maxW="sm"
                  mt="2"
                  className="notranslate"
                  translate="no"
                  lang={locale}
                >
                  <Box as="span" color="primary" fontWeight="700">
                    {copy.missionLead}
                  </Box>
                  {' '}
                  <Box as="span">{copy.missionRest}</Box>
                </Text>
                <Flex
                  mt="4"
                  px="3"
                  py="2"
                  borderRadius="pill"
                  bg="primaryContainer"
                  align="center"
                  gap="2"
                  alignSelf={{ base: 'center', md: 'flex-start' }}
                  maxW="fit-content"
                >
                  <MaterialIcon name="verified_user" size={16} color="primary" />
                  <Text fontSize="xs" fontWeight="600" color="onPrimaryContainer" lineHeight="1.4">
                    {copy.trustLine}
                  </Text>
                </Flex>
              </>
            )}
          </FooterColumn>

          {/* Legal */}
          <FooterColumn>
            <FooterColumnTitle>{copy.infoTitle}</FooterColumnTitle>
            {copy.links.map((link) => (
              <FooterNavLink key={link.href} to={link.href}>
                {link.label}
              </FooterNavLink>
            ))}
          </FooterColumn>

          {/* Contact */}
          <FooterColumn>
            <FooterColumnTitle>{contact.sectionTitle}</FooterColumnTitle>
            <Text fontSize="sm" color="onSurfaceVariant" lineHeight="1.7" maxW="xs" mb="1">
              {contact.emailIntro}
            </Text>
            <ContactEmailLink
              display="inline-flex"
              fontSize="sm"
              color="onSurfaceVariant"
              fontWeight="500"
              lineHeight="2"
              textDecoration="none"
              _hover={{ color: 'primary' }}
              transition="color 0.15s"
            >
              {CONTACT_EMAIL}
            </ContactEmailLink>
            <FooterNavLink to="/contact">{contact.formLink}</FooterNavLink>
            <FooterNavLink
              to={getWhatsAppUrl(locale)}
              external
              icon={<WhatsAppIcon size={14} color="currentColor" />}
            >
              {contact.whatsappLabel}
            </FooterNavLink>
            <FooterNavLink
              to={LINKEDIN_URL}
              external
              icon={<LinkedInIcon size={14} color="currentColor" />}
            >
              {contact.linkedinLabel}
            </FooterNavLink>
            {!compact && (
              <Text fontSize="xs" color="onSurfaceVariant" lineHeight="1.55" mt="2" maxW="xs" opacity={0.85}>
                {contact.hint}
              </Text>
            )}
          </FooterColumn>
        </Grid>
      </Box>

      {/* Copyright bar */}
      <Box bg="navy" color="onNavy">
        <Flex
          maxW="contentMax"
          mx="auto"
          px={{ base: 'marginMobile', lg: 'marginDesktop' }}
          py="4"
          direction={{ base: 'column', sm: 'row' }}
          align="center"
          justify="space-between"
          gap="2"
        >
          <Text fontSize="xs" color="whiteAlpha.800" textAlign="center">
            <BrandInlineText before={`© ${year}`} after={copy.copyrightAfter} />
          </Text>
          <Text fontSize="xs" color="whiteAlpha.600" textAlign="center">
            {locale === 'fr' ? 'Coordination de sorties de groupe' : 'Group outing coordination'}
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}
