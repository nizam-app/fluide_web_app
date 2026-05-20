import { Box, Button, Flex, Grid, Input, NativeSelect, Stack, Text, Textarea } from '@chakra-ui/react'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { FaqAccordion } from '../components/molecules/FaqAccordion'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { faqItems } from '../data/mockData'
import { fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'

const partners = [
  { icon: 'account_balance', title: 'Municipalities', description: 'Partnering with local governments for safe, verified locations and streamlined permitting.', link: 'Learn more →' },
  { icon: 'diversity_3', title: 'Associations', description: 'Supporting clubs, schools, and non-profits with robust itinerary and roster tools.', link: 'Learn more →' },
  { icon: 'local_shipping', title: 'Providers', description: 'Connect transport, lodging, and activity vendors with group organizers seamlessly.', link: 'Join as Provider →', wide: true },
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
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py="12">
        <Box textAlign="center" mb="12">
          <Text textStyle="headlineXl" mb="3">
            Contact FluideApp
          </Text>
          <Text textStyle="bodyLg" color="onSurfaceVariant" maxW="2xl" mx="auto">
            Have questions about our platform? Our team is here to help municipalities, associations, and providers get started.
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="8" mb="20">
          <Box bg="surface" borderRadius="fluide3xl" p="8" shadow="level1" borderWidth="1px" borderColor="outlineVariant">
            <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4" mb="4">
              <FormField label="Full Name">
                <Input placeholder="Alex Morgan" css={fluideInputStyles} />
              </FormField>
              <FormField label="Email">
                <Input type="email" placeholder="alex@example.com" css={fluideInputStyles} />
              </FormField>
            </Grid>
            <FormField label="I am a...">
              <NativeSelect.Root>
                <NativeSelect.Field css={fluideInputStyles}>
                  <option>Organizer / Municipality</option>
                  <option>Service Provider</option>
                  <option>Association</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </FormField>
            <Box mt="4">
              <FormField label="Message">
                <Textarea rows={5} placeholder="How can we help?" borderRadius="fluide" borderColor="outlineVariant" bg="surfaceContainerLow" />
              </FormField>
            </Box>
            <Button mt="6" {...stitchBlackButton} px="8" py="3">
              Send Message
            </Button>
          </Box>

          <Stack gap="4">
            <Box bg="primary" borderRadius="fluide3xl" p="6" color="onPrimary" overflow="hidden">
              <Box bg="blackAlpha.300" borderRadius="2xl" h="40" mb="4" display="flex" alignItems="center" justifyContent="center">
                <MaterialIcon name="smartphone" size={48} color="accentMint" />
              </Box>
              <Text textStyle="headlineSm" mb="2">
                In Person Support
              </Text>
              <Text textStyle="bodySm" opacity={0.9}>
                Visit our municipal partnership desk at City Hall, Lyon — Tuesdays & Thursdays.
              </Text>
            </Box>
            <Box bg="accentMint" borderRadius="fluide3xl" p="6">
              <MaterialIcon name="schedule" size={28} color="primary" mb="3" />
              <Text textStyle="labelMd" color="primary" mb="1">
                Average response time: 2 hours
              </Text>
              <Text textStyle="bodySm" color="onPrimaryContainer">
                Support available Mon–Fri, 8am–6pm CET for all platform users.
              </Text>
            </Box>
          </Stack>
        </Grid>

        <Box textAlign="center" mb="10">
          <Text textStyle="headlineLg" mb="2">
            Our Network
          </Text>
          <Box w="12" h="1" bg="primary" mx="auto" borderRadius="full" />
        </Box>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6" mb="20">
          {partners.map((p) => (
            <Box
              key={p.title}
              bg="surface"
              p="6"
              borderRadius="fluide3xl"
              borderWidth="1px"
              borderColor="outlineVariant"
              gridColumn={p.wide ? { md: 'span 1' } : undefined}
            >
              <Flex w="12" h="12" bg="surfaceContainer" borderRadius="lg" align="center" justify="center" mb="4">
                <MaterialIcon name={p.icon} color="primary" />
              </Flex>
              <Text textStyle="headlineSm" mb="2">
                {p.title}
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="4">
                {p.description}
              </Text>
              <Text textStyle="labelMd" color="primary">
                {p.link}
              </Text>
            </Box>
          ))}
        </Grid>

        <Text textStyle="headlineLg" textAlign="center" mb="8">
          Frequently Asked Questions
        </Text>
        <Box maxW="3xl" mx="auto">
          <FaqAccordion items={faqItems} />
        </Box>
      </Box>
    </MarketingLayout>
  )
}
