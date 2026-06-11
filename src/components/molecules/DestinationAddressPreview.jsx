import { useEffect, useState } from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import api from '../../lib/api'

export function DestinationAddressPreview({ query }) {
  const [imageUrl, setImageUrl] = useState('')
  const [attribution, setAttribution] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const trimmed = query?.trim() || ''
    if (trimmed.length < 3) {
      setImageUrl('')
      setAttribution('')
      return undefined
    }

    const timer = window.setTimeout(async () => {
      setBusy(true)
      try {
        const result = await api.utils.destinationImage(trimmed)
        setImageUrl(result?.image?.url || result?.image?.thumbUrl || '')
        setAttribution(result?.image?.attribution || '')
      } catch {
        setImageUrl('')
        setAttribution('')
      } finally {
        setBusy(false)
      }
    }, 500)

    return () => window.clearTimeout(timer)
  }, [query])

  if (!query?.trim() || query.trim().length < 3) return null

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor="outlineVariant"
      bg="surfaceContainerLow"
    >
      <Flex h="24" align="center" justify="center">
        {imageUrl ? (
          <Image src={imageUrl} alt="" w="full" h="full" objectFit="cover" />
        ) : busy ? (
          <Flex direction="column" align="center" gap="1" color="onSurfaceVariant">
            <MaterialIcon name="travel_explore" size={22} />
            <Text textStyle="bodySm">Finding place…</Text>
          </Flex>
        ) : (
          <Flex direction="column" align="center" gap="1" color="onSurfaceVariant" px="3">
            <MaterialIcon name="location_on" size={22} />
            <Text textStyle="bodySm" textAlign="center" lineClamp={2}>
              {query.trim()}
            </Text>
          </Flex>
        )}
      </Flex>
      {attribution && imageUrl && (
        <Text px="2" py="1" textStyle="bodySm" color="onSurfaceVariant" lineClamp={1}>
          {attribution}
        </Text>
      )}
    </Box>
  )
}
