import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Link,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { ContactEmailLink } from '../components/atoms/ContactEmailLink'
import { FaqAccordion } from '../components/molecules/FaqAccordion'
import {
  MarketingHighlightCards,
  MarketingPageHero,
  MarketingTrustStrip,
} from '../components/organisms/MarketingPageSections'
import { MarketingLayout } from '../components/templates/MarketingLayout'
import { CONTACT_PAGE_UI } from '../content/marketingPages'
import { CONTACT_EMAIL } from '../content/siteContact'
import { contactFaqItems } from '../data/mockData'
import { useLocale } from '../context/LocaleContext'
import api from '../lib/api'
import { fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'

const sectionPx = { base: 'marginMobile', md: 'marginDesktop' }

function FormField({ label, children }) {
  return (
    <Box>
      <Text textStyle="labelMd" color="onSurfaceVariant" mb="2" fontWeight="600">
        {label}
      </Text>
      {children}
    </Box>
  )
}

export function ContactPage() {
  const { locale } = useLocale()
  const ui = CONTACT_PAGE_UI[locale]
  const [form, setForm] = useState({ name: '', email: '', role: 'organizer', message: '' })
  const [status, setStatus] = useState({ type: null, message: '' })
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 5) {
      setStatus({
        type: 'error',
        message:
          locale === 'fr'
            ? 'Veuillez renseigner votre nom, e-mail et un message (5 caractères minimum).'
            : 'Please fill in your name, email, and a short message (5+ chars).',
      })
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
      setStatus({
        type: 'success',
        message:
          locale === 'fr'
            ? 'Merci — nous vous répondrons très prochainement.'
            : 'Thanks for reaching out — we will reply soon.',
      })
      setForm({ name: '', email: '', role: form.role, message: '' })
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          err?.message ||
          (locale === 'fr'
            ? 'Envoi impossible. Veuillez réessayer.'
            : 'Could not submit your message. Please try again.'),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const roleOptions =
    locale === 'fr'
      ? [
          { value: 'organizer', label: 'Organisateur' },
          { value: 'supplier', label: 'Prestataire' },
          { value: 'other', label: 'Autre' },
        ]
      : [
          { value: 'organizer', label: 'Organizer' },
          { value: 'supplier', label: 'Supplier' },
          { value: 'other', label: 'Other' },
        ]

  return (
    <MarketingLayout>
      <MarketingPageHero
        badge={ui.badge}
        title={ui.title}
        subtitle={ui.subtitle}
        icon="support_agent"
        breadcrumbLabel={ui.title}
      />

      <MarketingTrustStrip />

      <MarketingHighlightCards items={ui.highlights} />

      <Box w="full" bg="background" py={{ base: 8, md: 12 }}>
        <Box maxW="contentMax" mx="auto" px={sectionPx}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 22rem' }} gap={{ base: 8, lg: 10 }} alignItems="start">
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
              <Box mb="8" pb="6" borderBottomWidth="2px" borderColor="primary">
                <Text textStyle="headlineMd" mb="2">
                  {ui.formTitle}
                </Text>
                <Text textStyle="bodyMd" color="onSurfaceVariant" lineHeight="1.65">
                  {ui.formSubtitle}
                </Text>
              </Box>

              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4" mb="4">
                <FormField label={locale === 'fr' ? 'Nom complet' : 'Full name'}>
                  <Input
                    placeholder={locale === 'fr' ? 'Votre nom' : 'Your name'}
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
                <FormField label={locale === 'fr' ? 'Je suis…' : 'I am a…'}>
                  <NativeSelect.Root size="lg">
                    <NativeSelect.Field css={fluideInputStyles} value={form.role} onChange={update('role')}>
                      {roleOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </FormField>
              </Box>

              <FormField label={locale === 'fr' ? 'Message' : 'Message'}>
                <Textarea
                  rows={6}
                  placeholder={
                    locale === 'fr' ? 'Votre question ou demande de démo…' : 'Your question or demo request…'
                  }
                  value={form.message}
                  onChange={update('message')}
                  borderRadius="fluide"
                  borderColor="outlineVariant"
                  bg="surfaceContainerLow"
                  fontSize="md"
                />
              </FormField>

              {status.message && (
                <Flex
                  mt="4"
                  p="4"
                  borderRadius="fluide"
                  bg={status.type === 'success' ? 'primaryContainer' : 'errorContainer'}
                  align="flex-start"
                  gap="3"
                >
                  <MaterialIcon
                    name={status.type === 'success' ? 'check_circle' : 'error'}
                    size={20}
                    color={status.type === 'success' ? 'primary' : 'error'}
                  />
                  <Text textStyle="bodySm" color={status.type === 'success' ? 'primary' : 'error'} fontWeight="600">
                    {status.message}
                  </Text>
                </Flex>
              )}

              <Flex
                mt="8"
                direction={{ base: 'column', sm: 'row' }}
                gap="4"
                align={{ sm: 'center' }}
                justify="space-between"
              >
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
                  {locale === 'fr' ? 'Envoyer le message' : 'Send message'}
                </Button>
                <RouterLink to="/login">
                  <Text textStyle="labelMd" color="primary" textAlign={{ base: 'center', sm: 'right' }}>
                    {ui.loginHint} →
                  </Text>
                </RouterLink>
              </Flex>
            </Box>

            <Stack gap="5">
              <Box
                p="6"
                borderRadius="fluide3xl"
                style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' }}
                color="onPrimary"
                shadow="level2"
              >
                <Flex align="center" gap="3" mb="4">
                  <Flex w="12" h="12" borderRadius="xl" bg="whiteAlpha.200" align="center" justify="center">
                    <MaterialIcon name="mail" size={26} color="accentMint" />
                  </Flex>
                  <Box>
                    <Text fontWeight="700" fontSize="md">
                      {locale === 'fr' ? 'E-mail direct' : 'Direct email'}
                    </Text>
                    <Text fontSize="sm" color="whiteAlpha.900">
                      {locale === 'fr' ? 'Pour les partenaires et collectivités' : 'For partners and institutions'}
                    </Text>
                  </Box>
                </Flex>
                <ContactEmailLink fontSize="md" fontWeight="700" color="accentMint" textDecoration="underline">
                  {CONTACT_EMAIL}
                </ContactEmailLink>
                <Text fontSize="xs" color="whiteAlpha.800" mt="2" lineHeight="1.5">
                  {locale === 'fr'
                    ? 'Ouvre votre application e-mail (Gmail, Outlook, etc.) pour nous écrire.'
                    : 'Opens your email app (Gmail, Outlook, etc.) to write to us.'}
                </Text>
              </Box>

              <Box
                bg="surface"
                borderRadius="fluide3xl"
                p="6"
                borderWidth="1px"
                borderColor="outlineVariant"
                shadow="level1"
              >
                <Text fontWeight="700" color="onSurface" mb="4">
                  {locale === 'fr' ? 'Informations utiles' : 'Useful links'}
                </Text>
                <Stack gap="2">
                  {[
                    { to: '/about', label: locale === 'fr' ? 'À propos de Flunexia' : 'About Flunexia', icon: 'groups' },
                    { to: '/privacy', label: locale === 'fr' ? 'Politique de confidentialité' : 'Privacy policy', icon: 'shield' },
                    { to: '/impact', label: locale === 'fr' ? "Rapport d'impact" : 'Impact report', icon: 'eco' },
                  ].map((item) => (
                    <RouterLink key={item.to} to={item.to}>
                      <Flex
                        align="center"
                        gap="3"
                        py="2.5"
                        px="3"
                        borderRadius="fluide"
                        _hover={{ bg: 'surfaceContainerLow' }}
                      >
                        <MaterialIcon name={item.icon} size={20} color="primary" />
                        <Text fontSize="sm" fontWeight="600" color="onSurfaceVariant">
                          {item.label}
                        </Text>
                      </Flex>
                    </RouterLink>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Box mt={{ base: 12, md: 16 }}>
            <Text textStyle="headlineSm" mb="6" textAlign="center">
              {ui.faqTitle}
            </Text>
            <Box maxW="3xl" mx="auto">
              <FaqAccordion items={contactFaqItems} alwaysVisible />
            </Box>
          </Box>
        </Box>
      </Box>
    </MarketingLayout>
  )
}
