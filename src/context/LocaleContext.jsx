import { createContext, useContext, useEffect, useMemo } from 'react'

const STORAGE_KEY = 'flunexia_locale'

const LocaleContext = createContext(null)

/** UI is English-only; no locale toggle or browser detection. */
export function LocaleProvider({ children }) {
  useEffect(() => {
    document.documentElement.lang = 'en'
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(() => ({ locale: 'en', setLocale: () => {} }), [])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
