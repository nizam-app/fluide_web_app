import { useState } from 'react'
import { Box, Button, Flex, Grid, Input, Link, NativeSelect, Text, Textarea } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { FaqAccordion } from '../components/molecules/FaqAccordion'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { CONTACT_EMAIL } from '../content/siteContact'
import { contactFaqItems } from '../data/mockData'
import { useLocale } from '../context/LocaleContext'
import api from '../lib/api'
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
  const { locale } = useLocale()
  const [form, setForm] = useState({ name: '', email: '', role: 'organizer', message: '' })
  const [status, setStatus] = useState({ type: null, message: '' })
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 5) {
      setStatus({ type: 'error', message: 'Please fill in your name, email, and a short message (5+ chars).' })
      return
    }
    setSubmitting(true)
    setStatus({ type: null, message: '' })
    try {
      await api.contact.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        message: form.message.trim(),
      })
      setStatus({ type: 'success', message: 'Thanks for reaching out — we will reply soon.' })
      setForm({ name: '', email: '', role: form.role, message: '' })
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.message || 'Could not submit your message. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

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
          <Text textStyle="bodyMd" color="onSurfaceVariant" mt="3">
            {locale === 'fr' ? 'Ou écrivez directement à ' : 'Or email us directly at '}
            <Link href={`mailto:${CONTACT_EMAIL}`} color="primary" textDecoration="underline" fontWeight="600">
              {CONTACT_EMAIL}
            </Link>
          </Text>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="surface"
          borderRadius="fluide3xl"
          p={{ base: 6, md: 10 }}
          shadow="level2"
          borderWidth="1px"
          borderColor="outlineVariant"
        >
          <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4" mb="4">
            <FormField label="Full name">
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={update('name')}
                css={fluideInputStyles}
                size="lg"
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                placeholder="you@organization.fr"
                value={form.email}
                onChange={update('email')}
                css={fluideInputStyles}
                size="lg"
              />
            </FormField>
          </Grid>
          <Box mb="4">
            <FormField label="I am a…">
              <NativeSelect.Root size="lg">
                <NativeSelect.Field
                  css={fluideInputStyles}
                  value={form.role}
                  onChange={update('role')}
                >
                  <option value="organizer">Organizer</option>
                  <option value="supplier">Supplier</option>
                  <option value="other">Other</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </FormField>
          </Box>
          <FormField label="Message">
            <Textarea
              rows={5}
              placeholder="Your question or demo request…"
              value={form.message}
              onChange={update('message')}
              borderRadius="fluide"
              borderColor="outlineVariant"
              bg="surfaceContainerLow"
              fontSize="md"
            />
          </FormField>

          {status.message && (
            <Text
              mt="4"
              textStyle="bodySm"
              color={status.type === 'success' ? 'primary' : 'error'}
            >
              {status.message}
            </Text>
          )}

          <Flex mt="8" direction={{ base: 'column', sm: 'row' }} gap="3" align={{ sm: 'center' }} justify="space-between">
            <Button
              type="submit"
              {...stitchBlackButton}
              px="10"
              py="4"
              fontSize="md"
              w={{ base: 'full', sm: 'auto' }}
              loading={submitting}
              disabled={submitting}
            >
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
