import { Box, Button, Flex, Grid, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHomePath, ROLES } from '../lib/roles'
import { BrandInlineText } from '../components/atoms/BrandInlineText'
import { BrandName } from '../components/atoms/BrandName'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { InstallAppBanner } from '../components/organisms/InstallAppBanner'
import { HeroCarousel } from '../components/molecules/HeroCarousel'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { featureCards } from '../data/mockData'
import { textWithBrand } from '../lib/textWithBrand'
import {
  HOME_HERO,
  HOME_HERO_SLIDES,
  HOME_HERO_VIDEO,
  HOME_STEPS,
  HOME_STEPS_SECTION,
} from '../content/homeMarketing'
import { useLocale } from '../context/LocaleContext'
import { stitchBlackButton, stitchGreenButton } from '../theme/fluide-theme'

const serviceVisualKeys = [
  { key: 'transport', icon: 'directions_bus', iconBg: 'infoBg', iconColor: 'infoFg' },
  { key: 'activities', icon: 'hiking', iconBg: 'primaryContainer', iconColor: 'primary' },
  { key: 'services', icon: 'storefront', iconBg: 'secondaryContainer', iconColor: 'primary' },
]

const sectionPx = { base: 'marginMobile', md: 'marginDesktop' }

export function HomePage() {
  const { locale } = useLocale()
  const { isAuthenticated, user } = useAuth()
  const hero = HOME_HERO[locale]
  const heroSlides = HOME_HERO_SLIDES[locale]
  const steps = HOME_STEPS[locale]
  const stepsSection = HOME_STEPS_SECTION[locale]
  const portalPath = user ? getHomePath(user.role) : '/login'
  const createTripPath =
    isAuthenticated && user?.role === ROLES.ORGANIZER ? '/create-trip' : '/login'

  return (
    <MarketingLayout>
      {/* Hero */}
      <Box w="full" maxW="contentMax" mx="auto" px={sectionPx} py={{ base: 8, md: 12, lg: 16 }}>
        <Grid
          w="full"
          templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}
          gap={{ base: 8, lg: 12, xl: 16 }}
          alignItems="center"
        >
          <Box w="full" minW={0} overflow="hidden">
            <Text
              as="h1"
              fontSize={{ base: '2rem', sm: '2.25rem', md: '2.5rem', lg: '3rem' }}
              lineHeight="1.15"
              fontWeight="700"
              letterSpacing="-0.02em"
              color="onBackground"
              mb="4"
            >
              {hero.titleBefore}
              <Box as="span" color="primary" display="inline">
                {hero.titleHighlight}
              </Box>
            </Text>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="onSurfaceVariant"
              mb="6"
              lineHeight="1.65"
            >
              <BrandInlineText
                before={hero.introBefore}
                after={hero.introAfter}
                lockCopy
                lang={locale}
              />
            </Text>

            <Stack gap="3" mb="6" direction="column" w="full" maxW={{ lg: '100%' }}>
              <RouterLink to={createTripPath}>
                <Button
                  {...stitchBlackButton}
                  px="6"
                  py="3.5"
                  fontSize="md"
                  w={{ base: 'full', lg: 'fit-content' }}
                  maxW="100%"
                  aria-label={hero.ctaCreate}
                >
                  <MaterialIcon name="add" size={22} />
                  <Box as="span" ml="2">
                    {hero.ctaCreate}
                  </Box>
                </Button>
              </RouterLink>
              <RouterLink to="/contact">
                <Button
                  {...stitchGreenButton}
                  px="6"
                  py="3.5"
                  fontSize="md"
                  w={{ base: 'full', lg: 'fit-content' }}
                  maxW="100%"
                  aria-label={hero.ctaDemo}
                >
                  <MaterialIcon name="videocam" size={22} />
                  <Box as="span" ml="2">
                    {hero.ctaDemo}
                  </Box>
                </Button>
              </RouterLink>
            </Stack>

            <Flex gap="2" flexWrap="wrap" w="full" maxW="100%">
              {serviceVisualKeys.map((s) => (
                <Flex
                  key={s.key}
                  align="center"
                  gap="2"
                  px="3"
                  py="2"
                  bg="surface"
                  borderRadius="pill"
                  borderWidth="1px"
                  borderColor="outlineVariant"
                >
                  <Flex
                    w="8"
                    h="8"
                    borderRadius="full"
                    bg={s.iconBg}
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <MaterialIcon name={s.icon} size={18} color={s.iconColor} />
                  </Flex>
                  <Text fontSize="sm" fontWeight="600" color="onSurface">
                    {hero.services[s.key]}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Box>

          <Box w="full" minW={0} maxW="100%">
            <Box
              w="full"
              maxW="100%"
              borderRadius="fluide3xl"
              overflow="hidden"
              shadow="level2"
              borderWidth="2px"
              borderColor="primary"
              bg="surface"
              aspectRatio={{ base: '16/10', lg: '4/3' }}
            >
              <HeroCarousel
                slides={heroSlides}
                videoSrc={HOME_HERO_VIDEO}
                lang={locale}
              />
            </Box>
          </Box>
        </Grid>
      </Box>

      <InstallAppBanner />

      {/* How it works */}
      <Box w="full" bg="surfaceContainerLow" py={{ base: 10, md: 14, lg: 16 }}>
        <Box maxW="contentMax" mx="auto" px={sectionPx} w="full">
          <Text textStyle="headlineLg" textAlign="center" mb="2">
            {stepsSection.heading}
          </Text>
          <Text textStyle="bodyMd" color="onSurfaceVariant" textAlign="center" mb={{ base: 8, md: 10 }} maxW="md" mx="auto" px="2">
            {stepsSection.subheading}
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="5" w="full">
            {steps.map((step, i) => (
              <Box
                key={step.icon}
                bg="surface"
                borderRadius="fluide3xl"
                p="6"
                borderWidth="1px"
                borderColor="outlineVariant"
                textAlign="center"
                h="full"
              >
                <Text textStyle="labelSm" color="primary" fontWeight="700" mb="3">
                  {i + 1}
                </Text>
                <Flex w="12" h="12" borderRadius="xl" bg="primaryContainer" align="center" justify="center" mx="auto" mb="4">
                  <MaterialIcon name={step.icon} size={26} color="primary" />
                </Flex>
                <Text textStyle="headlineSm" mb="2">
                  {step.title}
                </Text>
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  {step.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Everything in one place */}
      <Box w="full" maxW="contentMax" mx="auto" px={sectionPx} py={{ base: 10, md: 14, lg: 16 }}>
        <Text textStyle="headlineLg" mb={{ base: 6, md: 8 }} textAlign="center">
          Everything in one place
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" mb={{ base: 8, md: 10 }} w="full">
          {featureCards.map((f) => (
            <Flex
              key={f.title}
              bg="surface"
              p="6"
              borderRadius="fluide3xl"
              borderWidth="1px"
              borderColor="outlineVariant"
              align="flex-start"
              gap="4"
              h="full"
            >
              <Flex w="14" h="14" borderRadius="xl" bg="primaryContainer" align="center" justify="center" flexShrink={0}>
                <MaterialIcon name={f.icon} size={28} color="primary" />
              </Flex>
              <Box>
                <Text textStyle="headlineSm" mb="1">
                  {f.title}
                </Text>
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  {f.description}
                </Text>
              </Box>
            </Flex>
          ))}
        </SimpleGrid>

        <Stack
          direction={{ base: 'column', sm: 'row' }}
          gap="3"
          align="stretch"
          justify="center"
          maxW="32rem"
          mx="auto"
        >
          <RouterLink to="/login" style={{ flex: 1 }}>
            <Button
              variant="outline"
              borderColor="outlineVariant"
              borderRadius="pill"
              px="6"
              py="3"
              w="full"
              aria-label="Organizer log in"
            >
              <MaterialIcon name="groups" size={18} color="primary" />
              <Box as="span" ml="2">
                Organizer — Log in
              </Box>
            </Button>
          </RouterLink>
          <RouterLink to="/login" style={{ flex: 1 }}>
            <Button
              variant="outline"
              borderColor="outlineVariant"
              borderRadius="pill"
              px="6"
              py="3"
              w="full"
              aria-label="Supplier log in"
            >
              <MaterialIcon name="storefront" size={18} color="primary" />
              <Box as="span" ml="2">
                Supplier — Log in
              </Box>
            </Button>
          </RouterLink>
        </Stack>
      </Box>

      {/* Bottom CTA */}
      <Box w="full" maxW="contentMax" mx="auto" px={sectionPx} pb={{ base: 10, md: 16, lg: 20 }}>
        <Box
          bg="brandBlack"
          borderRadius="fluide3xl"
          p={{ base: 8, md: 10, lg: 12 }}
          textAlign="center"
          color="white"
          mx="auto"
        >
          <Text textStyle="headlineLg" mb="3" fontSize={{ base: 'xl', md: '2xl' }}>
            Start your next outing
          </Text>
          <Text textStyle="bodyMd" color="whiteAlpha.800" mb="8" maxW="md" mx="auto" px="2" lineHeight="1.6">
            {textWithBrand('Create a trip now, or request a demo — we will show you how Flunexia simplifies coordination.')}
          </Text>
          <Stack direction={{ base: 'column', sm: 'row' }} gap="3" justify="center" align="center" px="2">
            <RouterLink to={createTripPath} style={{ width: '100%', maxWidth: '16rem' }}>
              <Button {...stitchGreenButton} px="8" py="3.5" w="full">
                Create a trip
              </Button>
            </RouterLink>
            <RouterLink to="/contact" style={{ width: '100%', maxWidth: '16rem' }}>
              <Button
                bg="transparent"
                color="white"
                borderWidth="1px"
                borderColor="whiteAlpha.500"
                borderRadius="pill"
                px="8"
                py="3.5"
                w="full"
              >
                Request a demo
              </Button>
            </RouterLink>
          </Stack>
          {isAuthenticated && (
            <RouterLink to={portalPath}>
              <Text textStyle="labelMd" color="accentMint" mt="6" display="inline-block">
                Open your dashboard →
              </Text>
            </RouterLink>
          )}
        </Box>
      </Box>
    </MarketingLayout>
  )
}
