import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/roles'
import { OrganizerTripsPage } from './OrganizerTripsPage'
import { ProviderTripsPage } from './ProviderTripsPage'

/** /trips — organizer sees own trips; provider browses opportunities */
export function RoleTripsPage() {
  const { user } = useAuth()
  if (user?.role === ROLES.PROVIDER) return <ProviderTripsPage />
  return <OrganizerTripsPage />
}
