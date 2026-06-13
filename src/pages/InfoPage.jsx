import { Box, Flex, Grid, Heading, Link, Stack, Text, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { ContactEmailLink } from '../components/atoms/ContactEmailLink'
import {
  MarketingHighlightCards,
  MarketingPageHero,
  MarketingTrustStrip,
} from '../components/organisms/MarketingPageSections'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import {
  INFO_PAGE_META,
  INFO_PAGE_ORDER,
  INFO_PAGE_UI,
  LEGAL_PAGE_PATHS,
  LEGAL_PAGES,
} from '../content/legalPages'
import { MARKETING_PAGE_UI } from '../content/marketingPages'
import { CONTACT_EMAIL } from '../content/siteContact'
import { useLocale } from '../context/LocaleContext'
import { textWithBrand } from '../lib/textWithBrand'

const sectionPx = { base: 'marginMobile', md: 'marginDesktop' }

function slugifyHeading(heading) {
  return heading
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function RichLegalText({ text }) {
  if (!text.includes(CONTACT_EMAIL)) {
    return textWithBrand(text)
  }

  const [before, after] = text.split(CONTACT_EMAIL)

  return (
    <>
      {textWithBrand(before)}
      <ContactEmailLink color="primary" fontWeight="600" textDecoration="underline">
        {CONTACT_EMAIL}
      </ContactEmailLink>
      {textWithBrand(after)}
    </>
  )
}

function InfoSection({ section, index, isLast }) {
  const sectionId = slugifyHeading(section.heading)

  return (
    <Box
      as="section"
      id={sectionId}
      scrollMarginTop="28"
      pt={index === 0 ? 0 : { base: 8, md: 10 }}
      pb={isLast ? 0 : { base: 8, md: 10 }}
      borderBottomWidth={isLast ? 0 : '1px'}
      borderColor="outlineVariant"
    >
      <Flex align="flex-start" gap="4" mb="5">
        <Flex
          w="10"
          h="10"
          borderRadius="lg"
          bg="navy"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Text fontSize="xs" fontWeight="800" color="onNavy" letterSpacing="0.05em">
            {String(index + 1).padStart(2, '0')}
          </Text>
        </Flex>
        <Heading as="h2" size="md" color="onSurface" lineHeight="1.35" fontWeight="700">
          {section.heading}
        </Heading>
      </Flex>

      {section.paragraphs?.map((paragraph) => (
        <Text
          key={paragraph.slice(0, 48)}
          fontSize="md"
          color="onSurfaceVariant"
          lineHeight="1.8"
          mb="4"
          maxW="65ch"
        >
          <RichLegalText text={paragraph} />
        </Text>
      ))}

      {section.bullets?.length > 0 && (
        <Stack gap="3" mt={section.paragraphs?.length ? 2 : 0} maxW="65ch">
          {section.bullets.map((item) => (
            <Flex
              key={item.slice(0, 48)}
              align="flex-start"
              gap="3"
              p="4"
              borderRadius="fluide"
              bg="surfaceContainerLow"
              borderWidth="1px"
              borderColor="outlineVariant"
            >
              <Flex
                w="7"
                h="7"
                borderRadius="full"
                bg="primaryContainer"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <MaterialIcon name="check" size={16} color="primary" />
              </Flex>
              <Text fontSize="md" color="onSurface" lineHeight="1.75" fontWeight="500">
                <RichLegalText text={item} />
              </Text>
            </Flex>
          ))}
        </Stack>
      )}
    </Box>
  )
}

function InfoSidebar({ pageKey, sections, ui, locale }) {
  const marketingUi = MARKETING_PAGE_UI[locale]

  return (
    <Stack gap="5">
      <Box
        bg="surface"
        borderRadius="fluide3xl"
        borderWidth="1px"
        borderColor="outlineVariant"
        overflow="hidden"
        shadow="level2"
      >
        <Box px="5" py="4" bg="navy" color="onNavy">
          <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" opacity={0.85}>
            {ui.onThisPage}
          </Text>
        </Box>
        <Stack as="nav" gap="0" p="2">
          {sections.map((section, index) => {
            const sectionId = slugifyHeading(section.heading)
            return (
              <Link
                key={sectionId}
                href={`#${sectionId}`}
                display="flex"
                alignItems="flex-start"
                gap="3"
                py="3"
                px="3"
                borderRadius="fluide"
                _hover={{ bg: 'surfaceContainerLow' }}
              >
                <Text fontSize="xs" fontWeight="800" color="primary" mt="0.5" minW="5">
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <Text fontSize="sm" color="onSurface" fontWeight="600" lineHeight="1.45">
                  {section.heading}
                </Text>
              </Link>
            )
          })}
        </Stack>
      </Box>

      <Box
        bg="surface"
        borderRadius="fluide3xl"
        borderWidth="1px"
        borderColor="outlineVariant"
        overflow="hidden"
        shadow="level1"
      >
        <Box px="5" py="4" borderBottomWidth="1px" borderColor="outlineVariant">
          <Text fontSize="sm" fontWeight="700" color="onSurface">
            {ui.relatedPages}
          </Text>
        </Box>
        <Stack as="nav" gap="0" p="2">
          {INFO_PAGE_ORDER.map((key) => {
            const item = INFO_PAGE_META[key]
            const active = key === pageKey
            return (
              <RouterLink key={key} to={LEGAL_PAGE_PATHS[key]}>
                <Flex
                  align="center"
                  gap="3"
                  py="3"
                  px="3"
                  borderRadius="fluide"
                  borderLeftWidth="3px"
                  borderColor={active ? 'primary' : 'transparent'}
                  bg={active ? 'primaryContainer' : 'transparent'}
                  _hover={{ bg: active ? 'primaryContainer' : 'surfaceContainerLow' }}
                >
                  <MaterialIcon name={item.icon} size={20} color={active ? 'primary' : 'onSurfaceVariant'} />
                  <Text
                    fontSize="sm"
                    fontWeight={active ? '700' : '600'}
                    color={active ? 'primary' : 'onSurfaceVariant'}
                  >
                    {item.navLabel[locale]}
                  </Text>
                </Flex>
              </RouterLink>
            )
          })}
        </Stack>
      </Box>

      <Box
        p="5"
        borderRadius="fluide3xl"
        style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' }}
        color="onPrimary"
      >
        <Text fontSize="sm" fontWeight="700" mb="2">
          {marketingUi.sidebarContact}
        </Text>
        <Text fontSize="sm" color="whiteAlpha.900" lineHeight="1.6" mb="4">
          {marketingUi.sidebarContactBody}
        </Text>
        <ContactEmailLink
          display="inline-flex"
          alignItems="center"
          gap="2"
          fontSize="sm"
          fontWeight="700"
          color="accentMint"
          textDecoration="underline"
        >
          <MaterialIcon name="mail" size={18} color="accentMint" />
          {marketingUi.sidebarEmail}
        </ContactEmailLink>
      </Box>
    </Stack>
  )
}

export function InfoPage({ pageKey }) {
  const { locale } = useLocale()
  const page = LEGAL_PAGES[pageKey]?.[locale]
  const meta = INFO_PAGE_META[pageKey]
  const ui = INFO_PAGE_UI[locale]

  if (!page || !meta) {
    return (
      <MarketingLayout>
        <Box maxW="contentMax" mx="auto" px={sectionPx} py={{ base: 10, md: 14 }}>
          <Text textStyle="headlineLg">Page not found</Text>
        </Box>
      </MarketingLayout>
    )
  }

  const highlights = meta.highlights?.[locale] ?? []

  return (
    <MarketingLayout>
      <MarketingPageHero
        badge={meta.badge[locale]}
        title={page.title}
        subtitle={page.subtitle}
        icon={meta.icon}
        breadcrumbLabel={page.title}
      />

      <MarketingTrustStrip />

      <MarketingHighlightCards items={highlights} />

      <Box w="full" bg="background" py={{ base: 8, md: 12 }}>
        <Box maxW="contentMax" mx="auto" px={sectionPx}>
          <Grid templateColumns={{ base: '1fr', lg: '18rem 1fr' }} gap={{ base: 8, lg: 12 }} alignItems="start">
            <Box display={{ base: 'none', lg: 'block' }}>
              <Box position="sticky" top="5.5rem">
                <InfoSidebar pageKey={pageKey} sections={page.sections} ui={ui} locale={locale} />
              </Box>
            </Box>

            <Box
              bg="surface"
              borderRadius="fluide3xl"
              borderWidth="1px"
              borderColor="outlineVariant"
              shadow="level2"
              p={{ base: 6, md: 10, lg: 12 }}
            >
              <Flex
                align="center"
                gap="3"
                pb="6"
                mb="2"
                borderBottomWidth="2px"
                borderColor="primary"
              >
                <MaterialIcon name="article" size={24} color="primary" />
                <Text fontSize="sm" fontWeight="700" letterSpacing="0.06em" textTransform="uppercase" color="primary">
                  {MARKETING_PAGE_UI[locale].documentLabel}
                </Text>
              </Flex>

              <VStack align="stretch" gap="0">
                {page.sections.map((section, index) => (
                  <InfoSection
                    key={section.heading}
                    section={section}
                    index={index}
                    isLast={index === page.sections.length - 1}
                  />
                ))}
              </VStack>
            </Box>
          </Grid>

          <Box display={{ base: 'block', lg: 'none' }} mt="8">
            <InfoSidebar pageKey={pageKey} sections={page.sections} ui={ui} locale={locale} />
          </Box>
        </Box>
      </Box>
    </MarketingLayout>
  )
}
