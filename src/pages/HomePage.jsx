import { Box, Button, Flex, Grid, HStack, Image, SimpleGrid, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHomePath } from '../lib/roles'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { featureCards, HERO_IMAGE, trustedOrgs } from '../data/mockData'
import { stitchBlackButton, stitchGreenButton } from '../theme/fluide-theme'

const steps = [
  { icon: 'edit_document', title: 'Create a Trip', description: 'Define your needs, numbers, and dates. Broadcast your request to verified local providers instantly.', dark: true },
  { icon: 'forum', title: 'Receive Responses', description: 'Providers submit their offers. Compare options side-by-side in a unified dashboard.', green: true },
  { icon: 'task_alt', title: 'Confirm Booking', description: 'Accept the best offer with one click. Automated communications keep everyone aligned.', blue: true },
]

export function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const portalPath = user ? getHomePath(user.role) : '/login'

  return (
    <MarketingLayout>
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 12, md: 20 }}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="12" alignItems="center">
          <Box>
            <Box bg="accentMint" color="primary" textStyle="labelMd" px="4" py="1.5" borderRadius="pill" w="fit-content" mb="6">
              Simplifying Group Logistics
            </Box>
            <Text as="h1" textStyle="headlineXl" color="onBackground" mb="4">
              Organize Group Trips{' '}
              <Box as="span" color="accentBlue">
                Easily
              </Box>
            </Text>
            <Text textStyle="bodyLg" color="onSurfaceVariant" mb="8" maxW="lg">
              Fluide helps municipalities, associations, schools, and service providers manage group outings, transport requests, and activity bookings in one simple platform.
            </Text>
            <HStack gap="4" flexWrap="wrap">
              <RouterLink to="/login">
                <Button {...stitchBlackButton} px="8" py="3">
                  Create Account
                  <MaterialIcon name="arrow_forward" size={18} />
                </Button>
              </RouterLink>
              <RouterLink to={isAuthenticated ? portalPath : '/login'}>
                <Button bg="surface" color="onSurface" borderWidth="2px" borderColor="brandBlack" borderRadius="pill" px="8" py="3" textStyle="labelMd" fontWeight="600">
                  Try the Platform
                </Button>
              </RouterLink>
            </HStack>
          </Box>
          <Box bg="primary" borderRadius="fluide3xl" p="4" shadow="level2">
            <Image src={HERO_IMAGE} alt="Dashboard preview" borderRadius="2xl" w="full" />
          </Box>
        </Grid>
      </Box>

      <Box py="10" borderYWidth="1px" borderColor="outlineVariant" bg="surface">
        <Text textAlign="center" textStyle="labelSm" color="onSurfaceVariant" mb="6">
          TRUSTED BY 250+ ORGANIZATIONS
        </Text>
        <Flex maxW="contentMax" mx="auto" px="marginDesktop" justify="center" gap={{ base: 6, md: 12 }} flexWrap="wrap">
          {trustedOrgs.map((name) => (
            <Text key={name} textStyle="labelMd" color="outline" fontWeight="600">
              {name}
            </Text>
          ))}
        </Flex>
      </Box>

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py="20">
        <Box textAlign="center" mb="12">
          <Text textStyle="headlineLg" mb="3">
            How It Works
          </Text>
          <Text textStyle="bodyLg" color="onSurfaceVariant">
            A streamlined process to get your group moving without the administrative headache.
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
          {steps.map((step) => (
            <Box key={step.title} bg="surface" borderRadius="fluide3xl" p="8" shadow="level1" borderWidth="1px" borderColor="outlineVariant">
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
              <Text textStyle="bodyMd" color="onSurfaceVariant">
                {step.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} pb="20">
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6">
          <Box bg="navy" borderRadius="fluide3xl" p="10" color="onNavy" position="relative" overflow="hidden" minH="80">
            <Text textStyle="labelSm" color="accentBlue" mb="3">
              FOR ADMINISTRATORS
            </Text>
            <Text textStyle="headlineLg" mb="3">
              Organizers
            </Text>
            <Text textStyle="bodyMd" opacity={0.85} mb="8" maxW="sm">
              Perfect for municipalities, associations, and schools looking to simplify their outing logistics.
            </Text>
            <RouterLink to={isAuthenticated ? portalPath : '/login'}>
              <Button bg="surface" color="onSurface" borderRadius="pill" px="6" textStyle="labelMd" fontWeight="600">
                Launch Dashboard
              </Button>
            </RouterLink>
            <MaterialIcon name="account_balance" size={120} position="absolute" bottom="-4" right="-4" color="white" style={{ opacity: 0.08 }} />
          </Box>
          <Box bg="primary" borderRadius="fluide3xl" p="10" color="onPrimary" position="relative" overflow="hidden" minH="80">
            <Text textStyle="labelSm" color="accentMint" mb="3">
              FOR TRANSPORTATION PARTNERS
            </Text>
            <Text textStyle="headlineLg" mb="3">
              Providers
            </Text>
            <Text textStyle="bodyMd" opacity={0.9} mb="8" maxW="sm">
              Connect with reliable clients. Transport, activities, restaurants, hotels, and local services.
            </Text>
            <Button bg="surface" color="primary" borderRadius="pill" px="6" textStyle="labelMd" fontWeight="600">
              Join Network
            </Button>
            <MaterialIcon name="directions_bus" size={120} position="absolute" bottom="-4" right="-4" color="white" style={{ opacity: 0.1 }} />
          </Box>
        </Grid>
      </Box>

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} pb="20">
        <Flex justify="space-between" align="flex-end" mb="10" flexWrap="wrap" gap="4">
          <Box>
            <Text textStyle="headlineLg" mb="2">
              Streamline Every Aspect
            </Text>
            <Text textStyle="bodyMd" color="onSurfaceVariant">
              Everything you need to coordinate group logistics efficiently.
            </Text>
          </Box>
          <Text textStyle="labelMd" color="primary">
            View All Features →
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="6">
          {featureCards.map((f) => (
            <Box key={f.title} bg="surface" p="6" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant">
              <MaterialIcon name={f.icon} size={28} color="primary" mb="4" />
              <Text textStyle="headlineSm" mb="2">
                {f.title}
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant">
                {f.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} pb="20">
        <Box bg="brandBlack" borderRadius="fluide3xl" p={{ base: 10, md: 16 }} textAlign="center" color="white">
          <Text textStyle="headlineLg" mb="3">
            Ready to simplify your group travel?
          </Text>
          <Text textStyle="bodyMd" color="whiteAlpha.700" mb="8" maxW="lg" mx="auto">
            Join hundreds of organizations already using Fluide to coordinate trips effortlessly.
          </Text>
          <HStack justify="center" gap="4" flexWrap="wrap">
            <RouterLink to="/login">
              <Button {...stitchGreenButton} px="8" py="3">
                Create Free Account
              </Button>
            </RouterLink>
            <Button bg="transparent" color="white" borderWidth="1px" borderColor="whiteAlpha.500" borderRadius="pill" px="8" py="3" textStyle="labelMd">
              Schedule a Demo
            </Button>
          </HStack>
        </Box>
      </Box>
    </MarketingLayout>
  )
}
