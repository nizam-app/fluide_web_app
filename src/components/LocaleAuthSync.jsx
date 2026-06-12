import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

/** Keep UI locale aligned with the signed-in user's email language preference. */
export function LocaleAuthSync() {
  const { user } = useAuth()
  const { locale, setLocale } = useLocale()

  useEffect(() => {
    if (!user?.locale) return
    if (user.locale !== locale) {
      setLocale(user.locale)
    }
  }, [user?._id, user?.locale, locale, setLocale])

  return null
}
