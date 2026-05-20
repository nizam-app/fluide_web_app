/** @typedef {'admin' | 'organizer' | 'provider'} UserRole */

export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  PROVIDER: 'provider',
}

export function getHomePath(role) {
  if (role === ROLES.ADMIN) return '/admin'
  return '/dashboard'
}

export function getRoleLabel(role) {
  const labels = { admin: 'Admin', organizer: 'Organizer', provider: 'Provider' }
  return labels[role] ?? role
}

export function canAccessPath(role, path) {
  if (role === ROLES.ADMIN) {
    if (path === '/dashboard' || path === '/create-trip') return false
    const adminPaths = ['/admin', '/admin/trips', '/admin/requests', '/profile']
    if (adminPaths.some((p) => path === p || path.startsWith(`${p}/`))) return true
    if (path.startsWith('/trips/') && path !== '/create-trip') return true
    return false
  }

  if (path.startsWith('/admin')) return false
  if (path === '/create-trip' || path === '/trips/new') return role === ROLES.ORGANIZER

  if (path === '/trips') return role === ROLES.ORGANIZER || role === ROLES.PROVIDER
  if (path === '/requests') return role === ROLES.ORGANIZER || role === ROLES.PROVIDER
  if (path.startsWith('/trips/')) return role === ROLES.ORGANIZER || role === ROLES.PROVIDER
  if (path === '/dashboard' || path === '/profile') {
    return role === ROLES.ORGANIZER || role === ROLES.PROVIDER
  }

  return true
}
