import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isAdminEmail } from '../data/mockData'
import {
  clearAuthSession,
  findRegisteredUser,
  loadAuthSession,
  registerUser,
  saveAuthSession,
  seedDemoUsers,
} from '../lib/authStorage'
import { ROLES } from '../lib/roles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadAuthSession())

  useEffect(() => {
    seedDemoUsers()
  }, [])

  const persistUser = useCallback((session) => {
    saveAuthSession(session)
    setUser(session)
    return session
  }, [])

  const login = useCallback(
    ({ email, accountType }) => {
      const normalizedEmail = email.trim().toLowerCase()

      if (isAdminEmail(normalizedEmail)) {
        return persistUser({
          email: normalizedEmail,
          name: 'Flunexia Admin',
          role: ROLES.ADMIN,
        })
      }

      if (accountType !== ROLES.ORGANIZER && accountType !== ROLES.PROVIDER) {
        throw new Error('Please select Organizer or Supplier.')
      }

      const registered = findRegisteredUser(normalizedEmail)
      if (!registered) {
        throw new Error('No account found for this email. Please register first.')
      }

      if (registered.role !== accountType) {
        throw new Error(`This email is registered as ${registered.role === ROLES.ORGANIZER ? 'Organizer' : 'Supplier'}.`)
      }

      return persistUser({
        email: normalizedEmail,
        name: registered.name,
        role: registered.role,
        organizationType: registered.organizationType,
        providerType: registered.providerType,
      })
    },
    [persistUser],
  )

  const register = useCallback(
    ({ email, accountType, name, organizationType, providerType }) => {
      const normalizedEmail = email.trim().toLowerCase()

      if (isAdminEmail(normalizedEmail)) {
        throw new Error('Admin accounts cannot be created through public registration.')
      }
      if (accountType !== ROLES.ORGANIZER && accountType !== ROLES.PROVIDER) {
        throw new Error('Please select Organizer or Supplier.')
      }
      if (findRegisteredUser(normalizedEmail)) {
        throw new Error('An account with this email already exists. Please log in.')
      }

      const profile = registerUser({
        email: normalizedEmail,
        name: name?.trim() || normalizedEmail.split('@')[0],
        role: accountType,
        organizationType: accountType === ROLES.ORGANIZER ? organizationType : undefined,
        providerType: accountType === ROLES.PROVIDER ? providerType : undefined,
      })

      return persistUser({
        email: profile.email,
        name: profile.name,
        role: profile.role,
        organizationType: profile.organizationType,
        providerType: profile.providerType,
      })
    },
    [persistUser],
  )

  const logout = useCallback(() => {
    clearAuthSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === ROLES.ADMIN,
      isOrganizer: user?.role === ROLES.ORGANIZER,
      isProvider: user?.role === ROLES.PROVIDER,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
