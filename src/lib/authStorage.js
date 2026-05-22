const SESSION_KEY = 'flunexia_auth'
const USERS_KEY = 'flunexia_registered_users'

export function loadAuthSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session?.role || !session?.email) return null
    return session
  } catch {
    return null
  }
}

export function saveAuthSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  localStorage.removeItem(SESSION_KEY)
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findRegisteredUser(email) {
  const users = loadUsers()
  return users[email.trim().toLowerCase()] ?? null
}

export function registerUser({ email, name, role, organizationType, providerType }) {
  const normalized = email.trim().toLowerCase()
  const users = loadUsers()
  users[normalized] = {
    email: normalized,
    name,
    role,
    organizationType,
    providerType,
  }
  saveUsers(users)
  return users[normalized]
}

/** Ensures demo organizer/provider accounts exist for login testing */
export function seedDemoUsers() {
  const demos = [
    {
      email: 'organizer@flunexia.org',
      name: 'Demo Organizer',
      role: 'organizer',
      organizationType: 'Municipality',
    },
    {
      email: 'supplier@flunexia.org',
      name: 'Demo Provider',
      role: 'provider',
      providerType: 'Transport',
    },
  ]
  for (const demo of demos) {
    if (!findRegisteredUser(demo.email)) {
      registerUser(demo)
    }
  }
}
