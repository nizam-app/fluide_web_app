import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { NeedTypePicker } from './NeedTypePicker'
import api from '../../lib/api'
import { getSelectedProviderTypes } from '../../lib/providerTypes'
import { fluideInputStyles, stitchBlackButton, stitchGreenButton } from '../../theme/fluide-theme'

function emptyBillingAddress(address) {
  return {
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'France',
  }
}

function emptyBilling(billing) {
  return {
    chorusProReady: billing?.chorusProReady || false,
    chorusServiceCode: billing?.chorusServiceCode || '',
    legalEntityId: billing?.legalEntityId || '',
    paymentTerms: billing?.paymentTerms || '',
    notes: billing?.notes || '',
  }
}

export function AdminEditSupplierModal({ open, user, onClose, onSaved }) {
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [docBusyId, setDocBusyId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !user) return
    setForm({
      name: user.name || '',
      contactPerson: user.contactPerson || '',
      companyName: user.companyName || '',
      companyDescription: user.companyDescription || '',
      siret: user.siret || '',
      iban: user.iban || '',
      bic: user.bic || '',
      providerTypes: getSelectedProviderTypes(user).length ? getSelectedProviderTypes(user) : ['Transport'],
      rating: user.rating ?? '',
      reviewCount: user.reviewCount ?? 0,
      billingAddress: emptyBillingAddress(user.billingAddress),
      billing: emptyBilling(user.billing),
      documents: user.documents || [],
    })
    setError('')
  }, [open, user])

  if (!open || !user || !form || typeof document === 'undefined') return null

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const updateNested = (section, field) => (event) =>
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: event.target.value },
    }))

  const updateBillingFlag = (field) => (event) =>
    setForm((prev) => ({
      ...prev,
      billing: { ...prev.billing, [field]: event.target.checked },
    }))

  const handleSave = async () => {
    setBusy(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        contactPerson: form.contactPerson.trim() || null,
        companyName: form.companyName.trim() || null,
        companyDescription: form.companyDescription.trim() || null,
        siret: form.siret.trim() || null,
        iban: form.iban.trim() || null,
        bic: form.bic.trim() || null,
        providerTypes: form.providerTypes,
        billingAddress: form.billingAddress,
        billing: form.billing,
      }
      if (form.rating !== '' && form.rating != null) payload.rating = Number(form.rating)
      if (form.reviewCount !== '' && form.reviewCount != null) {
        payload.reviewCount = Number(form.reviewCount)
      }

      const result = await api.admin.updateUser(user._id, payload)
      onSaved?.(result.user)
      onClose()
    } catch (err) {
      setError(err?.message || 'Could not save supplier profile.')
    } finally {
      setBusy(false)
    }
  }

  const reviewDocument = async (documentId, status) => {
    setDocBusyId(documentId)
    try {
      const result = await api.admin.updateUserDocumentStatus(user._id, documentId, status)
      setForm((prev) => ({ ...prev, documents: result.user?.documents || [] }))
      onSaved?.(result.user)
    } catch (err) {
      setError(err?.message || 'Could not update document status.')
    } finally {
      setDocBusyId(null)
    }
  }

  return createPortal(
    <Box
      position="fixed"
      inset="0"
      zIndex={200}
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="4"
      onClick={busy ? undefined : onClose}
    >
      <Box
        bg="surface"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="outlineVariant"
        maxW="900px"
        w="full"
        maxH="90vh"
        overflow="auto"
        onClick={(event) => event.stopPropagation()}
      >
        <Flex
          px="6"
          py="4"
          borderBottomWidth="1px"
          borderColor="outlineVariant"
          bg="surfaceContainerLow"
          justify="space-between"
          align="center"
          gap="4"
        >
          <Box>
            <Text textStyle="headlineSm" fontWeight="600">
              Edit supplier — {user.name}
            </Text>
            <Text textStyle="bodySm" color="onSurfaceVariant" mt="1">
              {user.email}
            </Text>
          </Box>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            <MaterialIcon name="close" size={20} />
          </Button>
        </Flex>

        <Stack gap="6" p="6">
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
            <Box>
              <Text textStyle="labelMd" mb="2">
                Display name
              </Text>
              <Input value={form.name} onChange={updateField('name')} css={fluideInputStyles} />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                Contact person
              </Text>
              <Input value={form.contactPerson} onChange={updateField('contactPerson')} css={fluideInputStyles} />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                Company name
              </Text>
              <Input value={form.companyName} onChange={updateField('companyName')} css={fluideInputStyles} />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                SIRET
              </Text>
              <Input value={form.siret} onChange={updateField('siret')} css={fluideInputStyles} />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                IBAN
              </Text>
              <Input value={form.iban} onChange={updateField('iban')} css={fluideInputStyles} />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                BIC
              </Text>
              <Input value={form.bic} onChange={updateField('bic')} css={fluideInputStyles} />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                Rating
              </Text>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={updateField('rating')}
                css={fluideInputStyles}
              />
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                Review count
              </Text>
              <Input
                type="number"
                min="0"
                value={form.reviewCount}
                onChange={updateField('reviewCount')}
                css={fluideInputStyles}
              />
            </Box>
          </Grid>

          <Box>
            <Text textStyle="labelMd" mb="2">
              Services
            </Text>
            <NeedTypePicker
              value={form.providerTypes}
              onChange={(providerTypes) => setForm((prev) => ({ ...prev, providerTypes }))}
            />
          </Box>

          <Box>
            <Text textStyle="labelMd" mb="2">
              Company description
            </Text>
            <Input
              as="textarea"
              rows={4}
              value={form.companyDescription}
              onChange={updateField('companyDescription')}
              css={fluideInputStyles}
            />
          </Box>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
            <Box>
              <Text textStyle="labelMd" mb="2">
                Billing address
              </Text>
              <Stack gap="2">
                <Input
                  placeholder="Street"
                  value={form.billingAddress.line1}
                  onChange={updateNested('billingAddress', 'line1')}
                  css={fluideInputStyles}
                />
                <Input
                  placeholder="Additional line"
                  value={form.billingAddress.line2}
                  onChange={updateNested('billingAddress', 'line2')}
                  css={fluideInputStyles}
                />
                <Grid templateColumns="1fr 1fr" gap="2">
                  <Input
                    placeholder="Postal code"
                    value={form.billingAddress.postalCode}
                    onChange={updateNested('billingAddress', 'postalCode')}
                    css={fluideInputStyles}
                  />
                  <Input
                    placeholder="City"
                    value={form.billingAddress.city}
                    onChange={updateNested('billingAddress', 'city')}
                    css={fluideInputStyles}
                  />
                </Grid>
                <Input
                  placeholder="Country"
                  value={form.billingAddress.country}
                  onChange={updateNested('billingAddress', 'country')}
                  css={fluideInputStyles}
                />
              </Stack>
            </Box>
            <Box>
              <Text textStyle="labelMd" mb="2">
                Billing / Chorus Pro
              </Text>
              <Flex align="center" gap="2" mb="3">
                <Input
                  type="checkbox"
                  checked={form.billing.chorusProReady}
                  onChange={updateBillingFlag('chorusProReady')}
                />
                <Text textStyle="bodySm">Ready for Chorus Pro integration</Text>
              </Flex>
              <Stack gap="2">
                <Input
                  placeholder="Chorus service code"
                  value={form.billing.chorusServiceCode}
                  onChange={updateNested('billing', 'chorusServiceCode')}
                  css={fluideInputStyles}
                />
                <Input
                  placeholder="Legal entity ID"
                  value={form.billing.legalEntityId}
                  onChange={updateNested('billing', 'legalEntityId')}
                  css={fluideInputStyles}
                />
                <Input
                  placeholder="Payment terms"
                  value={form.billing.paymentTerms}
                  onChange={updateNested('billing', 'paymentTerms')}
                  css={fluideInputStyles}
                />
                <Input
                  placeholder="Billing notes"
                  value={form.billing.notes}
                  onChange={updateNested('billing', 'notes')}
                  css={fluideInputStyles}
                />
              </Stack>
            </Box>
          </Grid>

          <Box>
            <Text textStyle="labelMd" mb="3">
              Uploaded documents
            </Text>
            {form.documents.length === 0 ? (
              <Text textStyle="bodySm" color="onSurfaceVariant">
                No documents uploaded yet.
              </Text>
            ) : (
              <Stack gap="3">
                {form.documents.map((doc) => (
                  <Flex
                    key={doc._id}
                    p="4"
                    borderWidth="1px"
                    borderColor="outlineVariant"
                    borderRadius="lg"
                    align="center"
                    justify="space-between"
                    gap="4"
                    flexWrap="wrap"
                  >
                    <Box>
                      <Text textStyle="labelMd">{doc.label}</Text>
                      <Text textStyle="bodySm" color="onSurfaceVariant" textTransform="capitalize">
                        {doc.category} · {doc.status}
                      </Text>
                    </Box>
                    <HStack gap="2" flexWrap="wrap">
                      <Button
                        as="a"
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        variant="outline"
                        borderRadius="pill"
                      >
                        View
                      </Button>
                      {doc.status !== 'approved' && (
                        <Button
                          size="sm"
                          {...stitchGreenButton}
                          loading={docBusyId === doc._id}
                          onClick={() => reviewDocument(doc._id, 'approved')}
                        >
                          Approve
                        </Button>
                      )}
                      {doc.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          borderRadius="pill"
                          loading={docBusyId === doc._id}
                          onClick={() => reviewDocument(doc._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      )}
                    </HStack>
                  </Flex>
                ))}
              </Stack>
            )}
          </Box>

          {error && (
            <Text textStyle="bodySm" color="error">
              {error}
            </Text>
          )}

          <HStack justify="flex-end" gap="3">
            <Button {...stitchBlackButton} onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button {...stitchGreenButton} onClick={handleSave} loading={busy}>
              Save changes
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Box>,
    document.body,
  )
}
