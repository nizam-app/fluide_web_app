import { useEffect, useMemo, useState } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { resolveTripImageUrl } from '../../lib/format'
import api from '../../lib/api'

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)',
  'linear-gradient(135deg, #1D3557 0%, #457B9D 100%)',
  'linear-gradient(135deg, #5C4D7D 0%, #8E7DBE 100%)',
  'linear-gradient(135deg, #9A3412 0%, #EA580C 100%)',
  'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
]

function hashString(value = '') {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function TripCoverPlaceholder({ trip, alt = '', boxProps }) {
  const seed = String(trip?._id || trip?.id || trip?.title || trip?.location || 'trip')
  const gradient = PLACEHOLDER_GRADIENTS[hashString(seed) % PLACEHOLDER_GRADIENTS.length]
  const label = trip?.location || trip?.title || 'Trip'

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      gap="1"
      bg="surfaceContainer"
      color="white"
      textAlign="center"
      px="2"
      aria-label={alt || label}
      {...boxProps}
      style={{ background: gradient }}
    >
      <MaterialIcon name="location_on" size={boxProps?.h === 'full' || Number(boxProps?.h) > 100 ? 32 : 22} />
      <Text
        fontSize={boxProps?.w === '20' || boxProps?.w === 20 ? '2xs' : 'xs'}
        fontWeight="700"
        lineClamp={2}
        maxW="90%"
      >
        {label}
      </Text>
    </Flex>
  )
}

/** Trip cover image with API URL resolution, load error fallback, and location placeholder. */
export function TripCover({ trip, alt = '', ...boxProps }) {
  const storedSrc = resolveTripImageUrl(trip)
  const proxySrc = useMemo(
    () => (trip?.location ? api.utils.destinationImageProxyUrl(trip.location) : ''),
    [trip?.location],
  )
  const [src, setSrc] = useState('')
  const [usePlaceholder, setUsePlaceholder] = useState(false)

  useEffect(() => {
    setUsePlaceholder(false)
    setSrc(storedSrc || proxySrc || '')
  }, [storedSrc, proxySrc, trip?._id, trip?.image])

  if (usePlaceholder || !src) {
    return <TripCoverPlaceholder trip={trip} alt={alt} boxProps={boxProps} />
  }

  return (
    <Image
      src={src}
      alt={alt || trip?.title || 'Trip cover'}
      objectFit="cover"
      onError={() => {
        if (proxySrc && src !== proxySrc) {
          setSrc(proxySrc)
          return
        }
        setUsePlaceholder(true)
      }}
      {...boxProps}
    />
  )
}
