import { Box, Flex, Grid, Link, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { BrandInlineText } from '../atoms/BrandInlineText'
import { FluideLogo } from '../atoms/FluideLogo'
import { ContactEmailLink } from '../atoms/ContactEmailLink'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { FOOTER } from '../../content/homeMarketing'
import { CONTACT_EMAIL, FOOTER_CONTACT, getWhatsAppUrl, LINKEDIN_URL } from '../../content/siteContact'
import { useLocale } from '../../context/LocaleContext'

const linkSx = {
  fontSize: 'sm',
  color: 'onSurfaceVariant',
  fontWeight: '500',
  lineHeight: '1.5',
  py: '0.5',
  _hover: { color: 'primary' },
  transition: 'color 0.15s',
}

function FooterColumnTitle({ children }) {
  return (
    <Flex align="center" gap="2" mb="2">
      <Box w="3px" h="3.5" borderRadius="full" bg="primary" flexShrink={0} />
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

function FooterNavLink({ to, children, external = false }) {
  if (external) {
    return (
      <Link href={to} target="_blank" rel="noopener noreferrer" display="block" {...linkSx}>
        {children}
      </Link>
    )
  }

  return (
    <RouterLink to={to}>
      <Text as="span" display="block" {...linkSx}>
        {children}
      </Text>
    </RouterLink>
  )
}

function FooterColumn({ children, align = 'flex-start', textAlign = 'left' }) {
  return (
    <Stack
      gap="0"
      align={{ base: 'center', md: align }}
      textAlign={{ base: 'center', md: textAlign }}
    >
      {children}
    </Stack>
  )
}

function FooterSocialRow({ locale, whatsappLabel, linkedinLabel }) {
  const itemSx = {
    fontSize: 'sm',
    color: 'onSurfaceVariant',
    fontWeight: '500',
    lineHeight: '1.5',
    _hover: { color: 'primary' },
    transition: 'color 0.15s',
  }

  return (
    <Flex
      align="center"
      gap="2"
      py="0.5"
      flexWrap="wrap"
      justify={{ base: 'center', md: 'flex-start' }}
    >
      <Link href={getWhatsAppUrl(locale)} target="_blank" rel="noopener noreferrer" {...itemSx}>
        {whatsappLabel}
      </Link>
      <Text as="span" fontSize="sm" color="outlineVariant" aria-hidden>
        ·
      </Text>
      <Link href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" {...itemSx}>
        {linkedinLabel}
      </Link>
    </Flex>
  )
}

export function MarketingFooter({ compact = false }) {
  const { locale } = useLocale()
  const copy = FOOTER[locale]
  const contact = FOOTER_CONTACT[locale]
  const year = new Date().getFullYear()

  return (
    <Box as="footer" w="full" mt="auto" bg="surfaceContainerLow" borderTopWidth="1px" borderColor="outlineVariant">
      <Box h="3px" w="full" bg="primary" />

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 8, md: 9 }}>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: '1.5fr 1fr 1fr' }}
          gap={{ base: 8, md: 6, lg: 10 }}
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
                  lineHeight="1.45"
                  maxW="xs"
                  mt="1.5"
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
                  lineHeight="1.55"
                  maxW="sm"
                  mt="1.5"
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
                  mt="3"
                  px="2.5"
                  py="1.5"
                  borderRadius="pill"
                  bg="primaryContainer"
                  align="center"
                  gap="1.5"
                  alignSelf={{ base: 'center', md: 'flex-start' }}
                  maxW="fit-content"
                >
                  <MaterialIcon name="verified_user" size={14} color="primary" />
                  <Text fontSize="2xs" fontWeight="600" color="onPrimaryContainer" lineHeight="1.35">
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
            <ContactEmailLink display="block" textDecoration="none" {...linkSx}>
              {CONTACT_EMAIL}
            </ContactEmailLink>
            <FooterNavLink to="/contact">{contact.formLink}</FooterNavLink>
            <FooterSocialRow
              locale={locale}
              whatsappLabel={contact.whatsappLabel}
              linkedinLabel={contact.linkedinLabel}
            />
          </FooterColumn>
        </Grid>
      </Box>

      {/* Copyright bar */}
      <Box bg="navy" color="onNavy">
        <Flex
          maxW="contentMax"
          mx="auto"
          px={{ base: 'marginMobile', lg: 'marginDesktop' }}
          py="3"
          direction={{ base: 'column', sm: 'row' }}
          align="center"
          justify="space-between"
          gap="1"
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
