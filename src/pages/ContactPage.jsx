import { Box, Button, Flex, Grid, Input, NativeSelect, Text, Textarea } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { FaqAccordion } from '../components/molecules/FaqAccordion'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { contactFaqItems } from '../data/mockData'
import { textWithBrand } from '../lib/textWithBrand'
import { fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'

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
      <Box maxW="3xl" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py={{ base: 10, md: 14 }}>
        <Box textAlign="center" mb={{ base: 8, md: 10 }}>
          <Text textStyle="headlineXl" mb="3">
            Contact us
          </Text>
          <Text textStyle="bodyMd" color="onSurfaceVariant" maxW="lg" mx="auto" lineHeight="1.6">
            {textWithBrand('Organizer or Supplier — send a message and Flunexia will respond as soon as possible.')}
          </Text>
        </Box>

        <Box
          bg="surface"
          borderRadius="fluide3xl"
          p={{ base: 6, md: 10 }}
          shadow="level2"
          borderWidth="1px"
          borderColor="outlineVariant"
        >
          <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4" mb="4">
            <FormField label="Full name">
              <Input placeholder="Your name" css={fluideInputStyles} size="lg" />
            </FormField>
            <FormField label="Email">
              <Input type="email" placeholder="you@organization.fr" css={fluideInputStyles} size="lg" />
            </FormField>
          </Grid>
          <Box mb="4">
            <FormField label="I am a…">
              <NativeSelect.Root size="lg">
                <NativeSelect.Field css={fluideInputStyles}>
                  <option value="organizer">Organizer</option>
                  <option value="supplier">Supplier</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </FormField>
          </Box>
          <FormField label="Message">
            <Textarea
              rows={5}
              placeholder="Your question or demo request…"
              borderRadius="fluide"
              borderColor="outlineVariant"
              bg="surfaceContainerLow"
              fontSize="md"
            />
          </FormField>
          <Flex mt="8" direction={{ base: 'column', sm: 'row' }} gap="3" align={{ sm: 'center' }} justify="space-between">
            <Button {...stitchBlackButton} px="10" py="4" fontSize="md" w={{ base: 'full', sm: 'auto' }}>
              <MaterialIcon name="send" size={20} />
              Send message
            </Button>
            <RouterLink to="/login">
              <Text textStyle="labelMd" color="primary" textAlign={{ base: 'center', sm: 'right' }}>
                Already have an account? Log in →
              </Text>
            </RouterLink>
          </Flex>
        </Box>

        <Box mt={{ base: 10, md: 12 }}>
          <Text textStyle="labelMd" color="onSurfaceVariant" mb="4" textAlign="center">
            Quick answers
          </Text>
          <FaqAccordion items={contactFaqItems} alwaysVisible />
        </Box>
      </Box>
    </MarketingLayout>
  )
}
