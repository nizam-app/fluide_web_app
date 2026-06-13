import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RouteErrorPage } from './components/RouteErrorPage'
import { PortalShell } from './components/templates/PortalShell'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminRequestsPage } from './pages/AdminRequestsPage'
import { AdminTripsPage } from './pages/AdminTripsPage'
import { AuthPage } from './pages/AuthPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { ImpactPage } from './pages/ImpactPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
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
  { path: '/about', element: <AboutPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/impact', element: <ImpactPage /> },
  { path: '/auth', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <AuthPage /> },
  { path: '/trips/new', element: <Navigate to="/create-trip" replace /> },

  {
    element: <PortalShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/dashboard', element: <RoleDashboardPage /> },
      { path: '/create-trip', element: <CreateTripPage /> },
      { path: '/trips', element: <RoleTripsPage /> },
      { path: '/trips/:tripId', element: <TripDetailPage /> },
      { path: '/requests', element: <RoleRequestsPage /> },
      { path: '/favorites', element: <OrganizerFavoritesPage /> },
      { path: '/providers/:providerId', element: <ProviderProfilePage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/admin', element: <AdminDashboardPage /> },
      { path: '/admin/trips', element: <AdminTripsPage /> },
      { path: '/admin/requests', element: <AdminRequestsPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
