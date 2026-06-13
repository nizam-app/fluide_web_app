import { Box, Heading, Link, List, Text, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { LEGAL_PAGES } from '../content/legalPages'
import { CONTACT_EMAIL } from '../content/siteContact'
import { useLocale } from '../context/LocaleContext'
import { textWithBrand } from '../lib/textWithBrand'

function RichLegalText({ text }) {
  if (!text.includes(CONTACT_EMAIL)) {
    return textWithBrand(text)
  }

  const [before, after] = text.split(CONTACT_EMAIL)

  return (
    <>
      {textWithBrand(before)}
      <Link href={`mailto:${CONTACT_EMAIL}`} color="primary" textDecoration="underline">
        {CONTACT_EMAIL}
      </Link>
      {textWithBrand(after)}
    </>
  )
}

function InfoSection({ section }) {
  return (
    <Box as="section">
      <Heading as="h2" size="md" mb="3" color="onSurface">
        {section.heading}
      </Heading>
      {section.paragraphs?.map((paragraph) => (
        <Text key={paragraph.slice(0, 40)} textStyle="bodyMd" color="onSurfaceVariant" lineHeight="1.7" mb="3">
          <RichLegalText text={paragraph} />
        </Text>
      ))}
      {section.bullets?.length > 0 && (
        <List.Root as="ul" ps="5" gap="2" mb="2">
          {section.bullets.map((item) => (
            <List.Item key={item.slice(0, 40)} textStyle="bodyMd" color="onSurfaceVariant" lineHeight="1.7">
              <RichLegalText text={item} />
            </List.Item>
          ))}
        </List.Root>
      )}
    </Box>
  )
}

export function InfoPage({ pageKey }) {
  const { locale } = useLocale()
  const page = LEGAL_PAGES[pageKey]?.[locale]

  if (!page) {
    return (
      <MarketingLayout>
        <Box maxW="3xl" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 10, md: 14 }}>
          <Text textStyle="headlineLg">Page not found</Text>
        </Box>
      </MarketingLayout>
    )
  }

  return (
    <MarketingLayout>
      <Box maxW="3xl" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 10, md: 14 }}>
        <Box textAlign="center" mb={{ base: 8, md: 10 }}>
          <Text as="h1" textStyle="headlineXl" mb="3">
            {page.title}
          </Text>
          <Text textStyle="bodyMd" color="onSurfaceVariant" maxW="2xl" mx="auto" lineHeight="1.6">
            {textWithBrand(page.subtitle)}
          </Text>
        </Box>

        <Box
          bg="surface"
          borderRadius="fluide3xl"
          p={{ base: 6, md: 10 }}
          shadow="level1"
          borderWidth="1px"
          borderColor="outlineVariant"
        >
          <VStack align="stretch" gap="8">
            {page.sections.map((section) => (
              <InfoSection key={section.heading} section={section} />
            ))}
          </VStack>
        </Box>

        <Text textAlign="center" mt="8" textStyle="bodySm" color="onSurfaceVariant">
          <RouterLink to="/contact">
            <Text as="span" color="primary" textDecoration="underline">
              {locale === 'fr' ? 'Nous contacter' : 'Contact us'}
            </Text>
          </RouterLink>
          {' · '}
          <RouterLink to="/">
            <Text as="span" color="primary" textDecoration="underline">
              {locale === 'fr' ? 'Retour à l’accueil' : 'Back to home'}
            </Text>
          </RouterLink>
        </Text>
      </Box>
    </MarketingLayout>
  )
}
