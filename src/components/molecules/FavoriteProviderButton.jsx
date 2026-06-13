import { useEffect, useRef, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { getPortalCopy } from '../../content/portalCopy'
import { useLocale } from '../../context/LocaleContext'
import api from '../../lib/api'
import { stableBusyProps } from '../../lib/stableButton'

export function FavoriteProviderButton({ providerId, initialFavorite = false, onChange }) {
  const { locale } = useLocale()
  const copy = getPortalCopy(locale).shared
  const [favorite, setFavorite] = useState(initialFavorite)
  const [busy, setBusy] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    setFavorite(initialFavorite)
  }, [initialFavorite, providerId])

  const toggle = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (busy) return

    const nextFavorite = !favorite
    setBusy(true)
    setFavorite(nextFavorite)

    try {
      if (nextFavorite) {
        await api.favorites.add(providerId)
      } else {
        await api.favorites.remove(providerId)
      }
      if (!mountedRef.current) return
      onChange?.(nextFavorite)
    } catch (err) {
      if (!mountedRef.current) return
      setFavorite(!nextFavorite)
      window.alert(err?.message || (locale === 'fr' ? 'Impossible de mettre à jour les favoris.' : 'Could not update favorites.'))
    } finally {
      if (mountedRef.current) setBusy(false)
    }
  }

  const label = favorite ? copy.favorited : copy.favorite
  const iconName = favorite ? 'favorite' : 'favorite_border'

  return (
    <Button
      size="sm"
      type="button"
      variant={favorite ? 'solid' : 'outline'}
      borderRadius="pill"
      {...stableBusyProps(busy)}
      onClick={toggle}
      aria-pressed={favorite}
      aria-label={label}
    >
      <Flex as="span" align="center" gap="1">
        <MaterialIcon name={iconName} size={16} filled={favorite} />
        <Text as="span" textStyle="labelSm">
          {label}
        </Text>
      </Flex>
    </Button>
  )
}
