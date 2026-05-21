import { Box, Button, Flex, Grid, HStack, Image, SimpleGrid, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHomePath, ROLES } from '../lib/roles'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { featureCards, HERO_IMAGE, homeValuePillars } from '../data/mockData'
import { stitchBlackButton, stitchGreenButton } from '../theme/fluide-theme'

const steps = [
  {
    icon: 'edit_document',
    title: 'Create your outing',
    description: 'Describe the trip, participants, and what you need — transport, activity, or another local service.',
    dark: true,
  },
  {
    icon: 'forum',
    title: 'Send requests to providers',
    description: 'Providers in your area can respond with a clear offer. You compare options in one dashboard.',
    green: true,
  },
  {
    icon: 'task_alt',
    title: 'Confirm and coordinate',
    description: 'Accept the response that fits, track status, and keep the whole outing organized in one place.',
    blue: true,
  },
]

const coordinationItems = [
  { icon: 'directions_bus', label: 'Transport' },
  { icon: 'hiking', label: 'Activities' },
  { icon: 'storefront', label: 'Services' },
  { icon: 'forum', label: 'Provider requests' },
  { icon: 'event', label: 'Trip coordination' },
]

export function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const portalPath = user ? getHomePath(user.role) : '/login'
  const createTripPath =
    isAuthenticated && user?.role === ROLES.ORGANIZER ? '/create-trip' : '/login'

  return (
    <MarketingLayout>
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 10, md: 16, lg: 20 }}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 10, lg: 12 }} alignItems="center">
          <Box>
            <Box bg="accentMint" color="primary" textStyle="labelMd" px="4" py="1.5" borderRadius="pill" w="fit-content" mb="5">
              For municipalities, associations & schools
            </Box>
            <Text as="h1" textStyle="headlineXl" color="onBackground" mb="4" lineHeight="1.15">
              One place to organize{' '}
              <Box as="span" color="primary">
                group trips & outings
              </Box>
            </Text>
            <Text textStyle="bodyLg" color="onSurfaceVariant" mb="4" maxW="lg" lineHeight="1.65">
              Fluide is a centralized platform for organizing group trips and outings for municipalities, associations,
              schools, and local organizations.
            </Text>
            <Text textStyle="labelMd" color="onSurface" mb="5" maxW="lg" fontWeight="600">
              All your group trip needs centralized in one platform — transport, activities, and services.
            </Text>
            <Flex gap="2" flexWrap="wrap" mb="8">
              {coordinationItems.map((item) => (
                <Flex
                  key={item.label}
                  align="center"
                  gap="1.5"
                  px="3"
                  py="1.5"
                  bg="surfaceContainerLow"
                  borderRadius="pill"
                  borderWidth="1px"
                  borderColor="outlineVariant"
                  textStyle="labelSm"
                  color="onSurfaceVariant"
                >
                  <MaterialIcon name={item.icon} size={16} color="primary" />
                  {item.label}
                </Flex>
              ))}
            </Flex>
            <Flex gap="3" flexWrap="wrap" direction={{ base: 'column', sm: 'row' }}>
              <RouterLink to={createTripPath}>
                <Button {...stitchBlackButton} px="8" py="3.5" w={{ base: 'full', sm: 'auto' }} fontSize="md">
                  <MaterialIcon name="add" size={20} />
                  Create a trip
                </Button>
              </RouterLink>
              <RouterLink to="/contact">
                <Button
                  {...stitchGreenButton}
                  px="8"
                  py="3.5"
                  w={{ base: 'full', sm: 'auto' }}
                  fontSize="md"
                >
                  <MaterialIcon name="send" size={20} />
                  Submit a request
                </Button>
              </RouterLink>
            </Flex>
            {isAuthenticated && (
              <RouterLink to={portalPath}>
                <Text textStyle="labelMd" color="primary" mt="4" display="inline-block">
                  Go to your dashboard →
                </Text>
              </RouterLink>
            )}
          </Box>
          <Box bg="primary" borderRadius="fluide3xl" p="4" shadow="level2">
            <Image src={HERO_IMAGE} alt="Fluide trip coordination dashboard" borderRadius="2xl" w="full" />
          </Box>
        </Grid>
      </Box>

      <Box py={{ base: 10, md: 14 }} borderYWidth="1px" borderColor="outlineVariant" bg="surfaceContainerLow">
        <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, md: 8 }}>
            {homeValuePillars.map((pillar) => (
              <Flex key={pillar.title} direction="column" align={{ base: 'flex-start', md: 'center' }} textAlign={{ base: 'left', md: 'center' }} gap="3">
                <Flex w="12" h="12" borderRadius="xl" bg="primaryContainer" align="center" justify="center">
                  <MaterialIcon name={pillar.icon} size={28} color="primary" />
                </Flex>
                <Text textStyle="labelMd" color="onSurface" fontWeight="700">
                  {pillar.title}
                </Text>
                <Text textStyle="bodySm" color="onSurfaceVariant" maxW="xs">
                  {pillar.description}
                </Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 14, md: 20 }}>
        <Box textAlign="center" mb={{ base: 8, md: 12 }}>
          <Text textStyle="headlineLg" mb="3">
            How it works
          </Text>
          <Text textStyle="bodyLg" color="onSurfaceVariant" maxW="2xl" mx="auto">
            A straightforward path from outing idea to confirmed provider — without losing track in emails and spreadsheets.
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
          {steps.map((step) => (
            <Box key={step.title} bg="surface" borderRadius="fluide3xl" p={{ base: 6, md: 8 }} shadow="level1" borderWidth="1px" borderColor="outlineVariant">
              <Flex
                w="14"
                h="14"
                borderRadius="xl"
                bg={step.dark ? 'brandBlack' : step.green ? 'secondaryContainer' : 'infoBg'}
                color={step.dark ? 'white' : step.green ? 'primary' : 'infoFg'}
                align="center"
                justify="center"
                mb="5"
              >
                <MaterialIcon name={step.icon} size={28} />
              </Flex>
              <Text textStyle="headlineSm" mb="2">
                {step.title}
              </Text>
              <Text textStyle="bodyMd" color="onSurfaceVariant" lineHeight="1.6">
                {step.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} pb={{ base: 14, md: 20 }}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
          <Box bg="navy" borderRadius="fluide3xl" p={{ base: 8, md: 10 }} color="onNavy" position="relative" overflow="hidden" minH={{ base: 'auto', md: '320px' }}>
            <Text textStyle="labelSm" color="accentBlue" mb="3">
              For organizers
            </Text>
            <Text textStyle="headlineLg" mb="3">
              Plan outings for your community
            </Text>
            <Text textStyle="bodyMd" opacity={0.9} mb="8" maxW="sm" lineHeight="1.6">
              Municipalities, associations, and schools use Fluide to manage transport, activities, services, and provider
              requests in one workspace.
            </Text>
            <RouterLink to={isAuthenticated ? portalPath : '/login'}>
              <Button bg="surface" color="onSurface" borderRadius="pill" px="6" py="2.5" textStyle="labelMd" fontWeight="600">
                Organizer sign in
              </Button>
            </RouterLink>
            <MaterialIcon name="account_balance" size={120} position="absolute" bottom="-4" right="-4" color="white" style={{ opacity: 0.08 }} />
          </Box>
          <Box bg="primary" borderRadius="fluide3xl" p={{ base: 8, md: 10 }} color="onPrimary" position="relative" overflow="hidden" minH={{ base: 'auto', md: '320px' }}>
            <Text textStyle="labelSm" color="accentMint" mb="3">
              For providers
            </Text>
            <Text textStyle="headlineLg" mb="3">
              Respond to local trip requests
            </Text>
            <Text textStyle="bodyMd" opacity={0.95} mb="8" maxW="sm" lineHeight="1.6">
              Transport companies, activity providers, restaurants, hotels, and local services can view opportunities and
              send clear offers.
            </Text>
            <RouterLink to="/login">
              <Button bg="surface" color="primary" borderRadius="pill" px="6" py="2.5" textStyle="labelMd" fontWeight="600">
                Provider sign in
              </Button>
            </RouterLink>
            <MaterialIcon name="directions_bus" size={120} position="absolute" bottom="-4" right="-4" color="white" style={{ opacity: 0.1 }} />
          </Box>
        </Grid>
      </Box>

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} pb={{ base: 14, md: 20 }}>
        <Box mb={{ base: 8, md: 10 }}>
          <Text textStyle="headlineLg" mb="2">
            Everything in one platform
          </Text>
          <Text textStyle="bodyMd" color="onSurfaceVariant" maxW="2xl">
            Keep transport, activities, services, and provider coordination together — so your team knows what is pending,
            accepted, or completed.
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="6">
          {featureCards.map((f) => (
            <Box key={f.title} bg="surface" p="6" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant" h="full">
              <MaterialIcon name={f.icon} size={28} color="primary" mb="4" />
              <Text textStyle="headlineSm" mb="2">
                {f.title}
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" lineHeight="1.55">
                {f.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} pb={{ base: 12, md: 20 }}>
        <Box bg="brandBlack" borderRadius="fluide3xl" p={{ base: 8, md: 14 }} textAlign="center" color="white">
          <Text textStyle="headlineLg" mb="3">
            Ready to organize your next outing?
          </Text>
          <Text textStyle="bodyMd" color="whiteAlpha.800" mb="8" maxW="lg" mx="auto" lineHeight="1.6">
            Create a trip as an organizer, or get in touch if you offer transport, activities, or local services.
          </Text>
          <Flex justify="center" gap="3" flexWrap="wrap" direction={{ base: 'column', sm: 'row' }} align="center">
            <RouterLink to={createTripPath}>
              <Button {...stitchGreenButton} px="8" py="3.5" w={{ base: 'full', sm: 'auto' }}>
                Create a trip
              </Button>
            </RouterLink>
            <RouterLink to="/contact">
              <Button
                bg="transparent"
                color="white"
                borderWidth="1px"
                borderColor="whiteAlpha.500"
                borderRadius="pill"
                px="8"
                py="3.5"
                textStyle="labelMd"
                w={{ base: 'full', sm: 'auto' }}
              >
                Contact Fluide
              </Button>
            </RouterLink>
          </Flex>
        </Box>
      </Box>
    </MarketingLayout>
  )
}
