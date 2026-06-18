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

function FooterNavLink({ to, children, external = false }) {
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
      <Link href={to} {...textProps}>
        {children}
      </Link>
    )
  }

  return (
    <RouterLink to={to}>
      <Text {...textProps}>{children}</Text>
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

function FooterQuickAction({ href, icon, title, hint, variant }) {
  const isWhatsApp = variant === 'whatsapp'
  const iconBg = isWhatsApp ? 'whiteAlpha.300' : '#0A66C2'

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display="flex"
      alignItems="center"
      gap="3"
      w="full"
      maxW="xs"
      px="3.5"
      py="3"
      borderRadius="fluide"
      bg={isWhatsApp ? 'linear-gradient(135deg, #128C7E 0%, #25D366 100%)' : 'surface'}
      borderWidth={isWhatsApp ? '0' : '1px'}
      borderColor={isWhatsApp ? undefined : 'outlineVariant'}
      boxShadow={isWhatsApp ? '0 4px 14px rgba(37, 211, 102, 0.28)' : 'level1'}
      textDecoration="none"
      transition="transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease"
      _hover={{
        transform: 'translateY(-1px)',
        boxShadow: isWhatsApp ? '0 6px 18px rgba(37, 211, 102, 0.35)' : 'level2',
        borderColor: isWhatsApp ? undefined : '#0A66C2',
      }}
    >
      <Flex
        w="9"
        h="9"
        borderRadius="lg"
        bg={iconBg}
        align="center"
        justify="center"
        flexShrink={0}
      >
        {icon}
      </Flex>
      <Box minW={0} textAlign="left">
        <Text
          fontSize="sm"
          fontWeight="700"
          color={isWhatsApp ? 'white' : 'onSurface'}
          lineHeight="1.3"
        >
          {title}
        </Text>
        <Text
          fontSize="2xs"
          color={isWhatsApp ? 'whiteAlpha.900' : 'onSurfaceVariant'}
          lineHeight="1.4"
          mt="0.5"
        >
          {hint}
        </Text>
      </Box>
      <MaterialIcon
        name="arrow_outward"
        size={16}
        color={isWhatsApp ? 'whiteAlpha.900' : 'onSurfaceVariant'}
        ml="auto"
        flexShrink={0}
      />
    </Link>
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
            <Text fontSize="sm" color="onSurfaceVariant" lineHeight="1.7" maxW="xs" mb="3">
              {contact.emailIntro}
            </Text>

            <Stack gap="3" w="full" maxW="xs" align={{ base: 'center', md: 'flex-start' }}>
              <Box
                w="full"
                px="3.5"
                py="3"
                borderRadius="fluide"
                bg="surface"
                borderWidth="1px"
                borderColor="outlineVariant"
                boxShadow="level1"
              >
                <ContactEmailLink
                  display="inline-flex"
                  alignItems="center"
                  gap="2"
                  fontSize="sm"
                  color="primary"
                  fontWeight="600"
                  textDecoration="none"
                  _hover={{ color: 'secondary' }}
                  transition="color 0.15s"
                >
                  <MaterialIcon name="mail" size={17} color="primary" />
                  {CONTACT_EMAIL}
                </ContactEmailLink>
                <Text fontSize="2xs" color="onSurfaceVariant" lineHeight="1.5" mt="1.5">
                  {contact.emailClickHint}
                </Text>
              </Box>

              <Box w="full">
                <Text
                  fontSize="2xs"
                  fontWeight="700"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color="onSurfaceVariant"
                  mb="2"
                  textAlign={{ base: 'center', md: 'left' }}
                >
                  {contact.quickContactTitle}
                </Text>
                <Stack gap="2" w="full">
                  <FooterQuickAction
                    href={getWhatsAppUrl(locale)}
                    variant="whatsapp"
                    title={contact.whatsappLabel}
                    hint={contact.whatsappHint}
                    icon={<WhatsAppIcon size={18} color="white" />}
                  />
                  <FooterQuickAction
                    href={LINKEDIN_URL}
                    variant="linkedin"
                    title={contact.linkedinLabel}
                    hint={contact.linkedinHint}
                    icon={<LinkedInIcon size={18} color="white" />}
                  />
                </Stack>
              </Box>

              <FooterNavLink to="/contact">{contact.formLink} →</FooterNavLink>

              {!compact && (
                <Text fontSize="xs" color="onSurfaceVariant" lineHeight="1.55" maxW="xs">
                  {contact.hint}
                </Text>
              )}
            </Stack>
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
