import { Link } from 'react-router-dom'
import { Text } from '@chakra-ui/react'
import { cacheProviderProfile } from '../../lib/providerProfile'

/** Supplier name link — uses a document navigation so the profile page always loads. */
export function ProviderNameLink({ provider, children, textStyle = 'labelMd', ...textProps }) {
  const providerId = provider?._id || provider
  const label = children ?? provider?.name ?? 'Provider'

  if (!providerId) {
    return (
      <Text textStyle={textStyle} {...textProps}>
        {label}
      </Text>
    )
  }

  return (
    <Link
      to={`/providers/${providerId}`}
      reloadDocument
      state={{ provider }}
      onClick={() => cacheProviderProfile(provider)}
      style={{ textDecoration: 'none' }}
    >
      <Text
        as="span"
        textStyle={textStyle}
        color="primary"
        fontWeight="600"
        _hover={{ textDecoration: 'underline' }}
        {...textProps}
      >
        {label}
      </Text>
    </Link>
  )
}
