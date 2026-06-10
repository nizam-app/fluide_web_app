import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PortalShell } from './components/templates/PortalShell'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminRequestsPage } from './pages/AdminRequestsPage'
import { AdminTripsPage } from './pages/AdminTripsPage'
import { AuthPage } from './pages/AuthPage'
import { ContactPage } from './pages/ContactPage'
import { CreateTripPage } from './pages/CreateTripPage'
import { HomePage } from './pages/HomePage'
import { OrganizerFavoritesPage } from './pages/OrganizerFavoritesPage'
import { ProfilePage } from './pages/ProfilePage'
import { RoleDashboardPage } from './pages/RoleDashboardPage'
import { RoleRequestsPage } from './pages/RoleRequestsPage'
import { RoleTripsPage } from './pages/RoleTripsPage'
import { TripDetailPage } from './pages/TripDetailPage'
import { ProviderProfilePage } from './pages/ProviderProfilePage'

export const appRouter = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/auth', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <AuthPage /> },
  { path: '/trips/new', element: <Navigate to="/create-trip" replace /> },

  {
    element: <PortalShell />,
    children: [
      { path: '/dashboard', element: <RoleDashboardPage /> },
      { path: '/create-trip', element: <CreateTripPage /> },
      { path: '/trips', element: <RoleTripsPage /> },
      { path: '/trips/:id', element: <TripDetailPage /> },
      { path: '/requests', element: <RoleRequestsPage /> },
      { path: '/favorites', element: <OrganizerFavoritesPage /> },
      { path: '/providers/:id', element: <ProviderProfilePage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/admin', element: <AdminDashboardPage /> },
      { path: '/admin/trips', element: <AdminTripsPage /> },
      { path: '/admin/requests', element: <AdminRequestsPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
