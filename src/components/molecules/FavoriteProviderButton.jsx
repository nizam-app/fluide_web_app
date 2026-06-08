import { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import api from '../../lib/api'

export function FavoriteProviderButton({ providerId, initialFavorite = false, onChange }) {
  const [favorite, setFavorite] = useState(initialFavorite)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setFavorite(initialFavorite)
  }, [initialFavorite])

  const toggle = async () => {
    setBusy(true)
    try {
      if (favorite) {
        await api.favorites.remove(providerId)
        setFavorite(false)
        onChange?.(false)
      } else {
        await api.favorites.add(providerId)
        setFavorite(true)
        onChange?.(true)
      }
    } catch (err) {
      window.alert(err?.message || 'Could not update favorites.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      size="sm"
      variant={favorite ? 'solid' : 'outline'}
      borderRadius="pill"
      loading={busy}
      onClick={toggle}
    >
      <MaterialIcon name={favorite ? 'favorite' : 'favorite_border'} size={16} filled={favorite} />
      {favorite ? 'Favorited' : 'Favorite'}
    </Button>
  )
}
