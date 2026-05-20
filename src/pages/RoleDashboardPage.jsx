import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/roles'
import { OrganizerDashboardPage } from './OrganizerDashboardPage'
import { ProviderDashboardPage } from './ProviderDashboardPage'

/** Single /dashboard route — renders organizer or provider UI by role */
export function RoleDashboardPage() {
  const { user } = useAuth()
  if (user?.role === ROLES.PROVIDER) return <ProviderDashboardPage />
  return <OrganizerDashboardPage />
}
