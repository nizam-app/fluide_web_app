import { HStack, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { countApprovedDocuments, formatBillingAddress } from '../../lib/format'

export function ProviderTrustPreview({ provider, compact = false }) {
  if (!provider) return null

  const companyName = provider.companyName
  const siret = provider.siret
  const billingLabel =
    provider.billingAddressLabel || formatBillingAddress(provider.billingAddress)
  const approvedDocs =
    provider.documentsApprovedCount ?? countApprovedDocuments(provider.documents)

  const items = [
    companyName && { icon: 'business', text: companyName },
    siret && { icon: 'badge', text: `SIRET ${siret}` },
    billingLabel && { icon: 'location_on', text: billingLabel },
    approvedDocs > 0 && { icon: 'verified', text: `${approvedDocs} verified document${approvedDocs === 1 ? '' : 's'}` },
  ].filter(Boolean)

  if (!items.length) return null

  return (
    <HStack gap={compact ? '3' : '4'} flexWrap="wrap" mt="1">
      {items.map((item) => (
        <HStack key={item.text} gap="1" color="onSurfaceVariant">
          <MaterialIcon name={item.icon} size={14} />
          <Text textStyle="labelSm">{item.text}</Text>
        </HStack>
      ))}
    </HStack>
  )
}
