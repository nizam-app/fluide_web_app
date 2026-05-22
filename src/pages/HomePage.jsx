import { Box, Button, Flex, Grid, HStack, Image, SimpleGrid, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHomePath, ROLES } from '../lib/roles'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { featureCards, HERO_IMAGE } from '../data/mockData'
import { stitchBlackButton, stitchGreenButton } from '../theme/fluide-theme'

const steps = [
  { icon: 'add_circle', title: 'Create a trip', description: 'Set date, location, and what you need.' },
  { icon: 'send', title: 'Get responses', description: 'Suppliers send offers — compare in one view.' },
  { icon: 'check_circle', title: 'Confirm', description: 'Accept an offer and keep coordination in one place.' },
]

const serviceVisuals = [
  { icon: 'directions_bus', label: 'Transport', color: 'infoBg', iconColor: 'infoFg' },
  { icon: 'hiking', label: 'Activities', color: 'secondaryContainer', iconColor: 'primary' },
  { icon: 'storefront', label: 'Services', color: 'accentMint', iconColor: 'primary' },
]

export function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const portalPath = user ? getHomePath(user.role) : '/login'
  const createTripPath =
    isAuthenticated && user?.role === ROLES.ORGANIZER ? '/create-trip' : '/login'

  return (
    <MarketingLayout>
      {/* Hero */}
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 10, md: 16 }}>
        <Grid templateColumns={{ base: '1fr', lg: '1.05fr 0.95fr' }} gap={{ base: 8, lg: 10 }} alignItems="center">
          <Box>
            <Text as="h1" textStyle="headlineXl" color="onBackground" mb="4" lineHeight="1.12">
              Save time on{' '}
              <Box as="span" color="primary">
                group trip coordination
              </Box>
            </Text>
            <Text textStyle="bodyLg" color="onSurfaceVariant" mb="6" maxW="lg" lineHeight="1.6">
              Flunexia centralizes transport, activities, services, and supplier requests — so municipalities,
              associations, and schools stop juggling emails and spreadsheets.
            </Text>

            <Flex gap="3" flexWrap="wrap" mb="8" direction={{ base: 'column', sm: 'row' }}>
              <RouterLink to={createTripPath}>
                <Button {...stitchBlackButton} px="8" py="4" fontSize="md" w={{ base: 'full', sm: 'auto' }}>
                  <MaterialIcon name="add" size={22} />
                  Create a trip
                </Button>
              </RouterLink>
              <RouterLink to="/contact">
                <Button {...stitchGreenButton} px="8" py="4" fontSize="md" w={{ base: 'full', sm: 'auto' }}>
                  <MaterialIcon name="videocam" size={22} />
                  Request a demo
                </Button>
              </RouterLink>
            </Flex>

            <SimpleGrid columns={3} gap="3" maxW="md">
              {serviceVisuals.map((s) => (
                <Flex
                  key={s.label}
                  direction="column"
                  align="center"
                  gap="2"
                  p="4"
                  bg={s.color}
                  borderRadius="fluide3xl"
                  borderWidth="1px"
                  borderColor="outlineVariant"
                >
                  <MaterialIcon name={s.icon} size={32} color={s.iconColor} />
                  <Text textStyle="labelSm" fontWeight="700" color="onSurface">
                    {s.label}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>

          <Box bg="primary" borderRadius="fluide3xl" p="3" shadow="level2">
            <Image src={HERO_IMAGE} alt="Flunexia platform preview" borderRadius="2xl" w="full" />
          </Box>
        </Grid>
      </Box>

      {/* How it works — compact */}
      <Box bg="surfaceContainerLow" py={{ base: 12, md: 16 }}>
        <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }}>
          <Text textStyle="headlineLg" textAlign="center" mb="2">
            Three steps
          </Text>
          <Text textStyle="bodyMd" color="onSurfaceVariant" textAlign="center" mb="10" maxW="md" mx="auto">
            From outing idea to confirmed supplier — fast and clear.
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="5">
            {steps.map((step, i) => (
              <Box
                key={step.title}
                bg="surface"
                borderRadius="fluide3xl"
                p="6"
                borderWidth="1px"
                borderColor="outlineVariant"
                textAlign="center"
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

      {/* What you manage — visual */}
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 12, md: 16 }}>
        <Text textStyle="headlineLg" mb="8" textAlign="center">
          Everything in one place
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" mb="10">
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

        <Flex
          justify="center"
          gap="4"
          flexWrap="wrap"
          direction={{ base: 'column', sm: 'row' }}
          align="center"
        >
          <RouterLink to="/login">
            <Button variant="outline" borderColor="outlineVariant" borderRadius="pill" px="8" py="3" w={{ base: 'full', sm: 'auto' }}>
              <MaterialIcon name="groups" size={18} color="primary" />
              Organizer — Log in
            </Button>
          </RouterLink>
          <RouterLink to="/login">
            <Button variant="outline" borderColor="outlineVariant" borderRadius="pill" px="8" py="3" w={{ base: 'full', sm: 'auto' }}>
              <MaterialIcon name="storefront" size={18} color="primary" />
              Supplier — Log in
            </Button>
          </RouterLink>
        </Flex>
      </Box>

      {/* Bottom CTA */}
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} pb={{ base: 12, md: 20 }}>
        <Box bg="brandBlack" borderRadius="fluide3xl" p={{ base: 8, md: 12 }} textAlign="center" color="white">
          <Text textStyle="headlineLg" mb="3">
            Start your next outing
          </Text>
          <Text textStyle="bodyMd" color="whiteAlpha.800" mb="8" maxW="md" mx="auto">
            Create a trip now, or request a demo — we will show you how Flunexia simplifies coordination.
          </Text>
          <HStack justify="center" gap="3" flexWrap="wrap">
            <RouterLink to={createTripPath}>
              <Button {...stitchGreenButton} px="8" py="3.5">
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
              >
                Request a demo
              </Button>
            </RouterLink>
          </HStack>
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
