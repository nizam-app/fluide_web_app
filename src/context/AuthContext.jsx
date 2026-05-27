import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { onSessionExpired } from '../lib/api'
import {
  clearAuthSession,
  loadCachedUser,
  loadToken,
  saveCachedUser,
  saveToken,
} from '../lib/authStorage'
import { ROLES } from '../lib/roles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadCachedUser())
  const [hydrating, setHydrating] = useState(() => Boolean(loadToken()))
  const [error, setError] = useState(null)

  const applySession = useCallback((session) => {
    if (!session) {
      clearAuthSession()
      setUser(null)
      return null
    }
    if (session.token) saveToken(session.token)
    if (session.user) {
      saveCachedUser(session.user)
      setUser(session.user)
    }
    return session.user
  }, [])

  useEffect(() => {
    const unsubscribe = onSessionExpired(() => {
      setUser(null)
      setError('Your session has expired. Please log in again.')
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    let cancelled = false
    async function hydrate() {
      const token = loadToken()
      if (!token) {
        setHydrating(false)
        return
      }
      try {
        const result = await api.auth.me()
        if (!cancelled && result?.user) {
          saveCachedUser(result.user)
          setUser(result.user)
        }
      } catch (err) {
        if (err?.status === 401) {
          clearAuthSession()
          if (!cancelled) setUser(null)
        }
      } finally {
        if (!cancelled) setHydrating(false)
      }
    }
    hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(
    async ({ email, password }) => {
      setError(null)
      const payload = { email: email.trim().toLowerCase(), password }
      const result = await api.auth.login(payload)
      return applySession(result)
    },
    [applySession],
  )

  const register = useCallback(
    async ({ email, password, accountType, name, organizationType, providerType }) => {
      setError(null)
      const payload = {
        email: email.trim().toLowerCase(),
        password,
        accountType,
        name: name?.trim() || undefined,
      }
      if (accountType === ROLES.ORGANIZER) payload.organizationType = organizationType
      if (accountType === ROLES.PROVIDER) payload.providerType = providerType
      const result = await api.auth.register(payload)
      return applySession(result)
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    try {
      await api.auth.logout()
    } catch {
      // ignore — stateless logout
    }
    clearAuthSession()
    setUser(null)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const result = await api.auth.me()
      if (result?.user) {
        saveCachedUser(result.user)
        setUser(result.user)
      }
      return result?.user
    } catch (err) {
      if (err?.status === 401) {
        clearAuthSession()
        setUser(null)
      }
      throw err
    }
  }, [])

  const updateProfile = useCallback(async (payload) => {
    const result = await api.users.updateProfile(payload)
    if (result?.user) {
      saveCachedUser(result.user)
      setUser(result.user)
    }
    return result?.user
  }, [])

  const updatePassword = useCallback((payload) => api.users.updatePassword(payload), [])

  const value = useMemo(
    () => ({
      user,
      hydrating,
      error,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === ROLES.ADMIN,
      isOrganizer: user?.role === ROLES.ORGANIZER,
      isProvider: user?.role === ROLES.PROVIDER,
      login,
      register,
      logout,
      refresh,
      updateProfile,
      updatePassword,
      clearError: () => setError(null),
    }),
    [user, hydrating, error, login, register, logout, refresh, updateProfile, updatePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
