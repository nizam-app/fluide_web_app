import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/roles'
import { OrganizerRequestsPage } from './OrganizerRequestsPage'
import { ProviderRequestsPage } from './ProviderRequestsPage'

/** Single /requests route — organizer vs provider booking views */
export function RoleRequestsPage() {
  const { user } = useAuth()
  if (user?.role === ROLES.PROVIDER) return <ProviderRequestsPage />
  return <OrganizerRequestsPage />
}
