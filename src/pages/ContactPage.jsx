import { Box, Button, Flex, Grid, Input, NativeSelect, Stack, Text, Textarea } from '@chakra-ui/react'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { FaqAccordion } from '../components/molecules/FaqAccordion'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { faqItems } from '../data/mockData'
import { fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'

const audienceCards = [
  {
    icon: 'groups',
    title: 'Organizers',
    description: 'Municipalities, associations, schools, and local institutions planning group outings.',
  },
  {
    icon: 'storefront',
    title: 'Providers',
    description: 'Transport, activities, restaurants, hotels, and other local services.',
  },
]

function FormField({ label, children }) {
  return (
    <Box>
      <Text textStyle="labelMd" color="onSurfaceVariant" mb="2">
        {label}
      </Text>
      {children}
    </Box>
  )
}

export function ContactPage() {
  return (
    <MarketingLayout>
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 10, md: 12 }}>
        <Box textAlign="center" mb={{ base: 10, md: 12 }}>
          <Text textStyle="headlineXl" mb="4" px={{ base: 0, md: 4 }}>
            Contact Fluide
          </Text>
          <Text textStyle="bodyLg" color="onSurfaceVariant" maxW="2xl" mx="auto" lineHeight="1.65">
            Whether you want to organize a group outing or offer transport, activities, or services, Fluide helps
            centralize requests and simplify coordination.
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={{ base: 6, lg: 8 }} mb={{ base: 14, md: 20 }}>
          <Box bg="surface" borderRadius="fluide3xl" p={{ base: 6, md: 8 }} shadow="level1" borderWidth="1px" borderColor="outlineVariant">
            <Text textStyle="headlineSm" mb="6">
              Send a message
            </Text>
            <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4" mb="4">
              <FormField label="Full name">
                <Input placeholder="Your name" css={fluideInputStyles} />
              </FormField>
              <FormField label="Email">
                <Input type="email" placeholder="you@organization.fr" css={fluideInputStyles} />
              </FormField>
            </Grid>
            <FormField label="I am a…">
              <NativeSelect.Root>
                <NativeSelect.Field css={fluideInputStyles}>
                  <option value="organizer">Organizer</option>
                  <option value="provider">Provider</option>
                  <option value="municipality">Organizer — Municipality</option>
                  <option value="association">Organizer — Association</option>
                  <option value="school">Organizer — School</option>
                  <option value="other">Other / general question</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </FormField>
            <Box mt="4">
              <FormField label="Message">
                <Textarea
                  rows={5}
                  placeholder="Tell Fluide about your outing or the services you offer…"
                  borderRadius="fluide"
                  borderColor="outlineVariant"
                  bg="surfaceContainerLow"
                />
              </FormField>
            </Box>
            <Text textStyle="bodySm" color="onSurfaceVariant" mt="4">
              Fluide will review your request. Your message will be handled by Fluide, and we will respond as soon as
              possible.
            </Text>
            <Button mt="6" {...stitchBlackButton} px="8" py="3" w={{ base: 'full', sm: 'auto' }}>
              Send message
            </Button>
          </Box>

          <Stack gap="4">
            <Box bg="primary" borderRadius="fluide3xl" p="6" color="onPrimary">
              <MaterialIcon name="mail" size={32} color="accentMint" mb="3" />
              <Text textStyle="headlineSm" mb="2">
                Write to Fluide
              </Text>
              <Text textStyle="bodySm" opacity={0.95} lineHeight="1.6">
                Questions about organizing an outing, joining as a provider, or using the platform? Send a message and
                Fluide will get back to you.
              </Text>
            </Box>
            <Box bg="accentMint" borderRadius="fluide3xl" p="6">
              <MaterialIcon name="schedule" size={28} color="primary" mb="3" />
              <Text textStyle="labelMd" color="primary" mb="2" fontWeight="700">
                Response time
              </Text>
              <Text textStyle="bodySm" color="onPrimaryContainer" lineHeight="1.6">
                Fluide will respond as soon as possible. We read every message and follow up when we can.
              </Text>
            </Box>
          </Stack>
        </Grid>

        <Text textStyle="headlineLg" textAlign="center" mb={{ base: 6, md: 8 }}>
          Who Fluide is for
        </Text>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="6" mb={{ base: 14, md: 20 }} maxW="4xl" mx="auto">
          {audienceCards.map((card) => (
            <Box key={card.title} bg="surface" p="6" borderRadius="fluide3xl" borderWidth="1px" borderColor="outlineVariant">
              <Flex w="12" h="12" bg="surfaceContainer" borderRadius="lg" align="center" justify="center" mb="4">
                <MaterialIcon name={card.icon} color="primary" />
              </Flex>
              <Text textStyle="headlineSm" mb="2">
                {card.title}
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" lineHeight="1.55">
                {card.description}
              </Text>
            </Box>
          ))}
        </Grid>

        <Text textStyle="headlineLg" textAlign="center" mb="3">
          Frequently asked questions
        </Text>
        <Text textStyle="bodyMd" color="onSurfaceVariant" textAlign="center" mb={{ base: 8, md: 10 }} maxW="xl" mx="auto">
          Clear answers for organizers and providers.
        </Text>
        <Box maxW="3xl" mx="auto">
          <FaqAccordion items={faqItems} alwaysVisible />
        </Box>
      </Box>
    </MarketingLayout>
  )
}
