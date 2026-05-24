import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'flunexia_locale'

const LocaleContext = createContext(null)

function readInitialLocale() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'fr') return saved
  return 'en'
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(readInitialLocale)

  const setLocale = useCallback((next) => {
    if (next !== 'en' && next !== 'fr') return
    localStorage.setItem(STORAGE_KEY, next)
    setLocaleState(next)
    document.documentElement.lang = next
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
