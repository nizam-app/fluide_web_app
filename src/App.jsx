import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ROLES } from './lib/roles'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminRequestsPage } from './pages/AdminRequestsPage'
import { AdminTripsPage } from './pages/AdminTripsPage'
import { AuthPage } from './pages/AuthPage'
import { ContactPage } from './pages/ContactPage'
import { CreateTripPage } from './pages/CreateTripPage'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { RoleDashboardPage } from './pages/RoleDashboardPage'
import { RoleRequestsPage } from './pages/RoleRequestsPage'
import { RoleTripsPage } from './pages/RoleTripsPage'
import { TripDetailPage } from './pages/TripDetailPage'

const organizerProvider = [ROLES.ORGANIZER, ROLES.PROVIDER]
const allRoles = [ROLES.ORGANIZER, ROLES.PROVIDER, ROLES.ADMIN]

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={organizerProvider}>
                <RoleDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-trip"
            element={
              <ProtectedRoute role={ROLES.ORGANIZER}>
                <CreateTripPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute roles={organizerProvider}>
                <RoleTripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute roles={organizerProvider}>
                <RoleRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute roles={allRoles}>
                <TripDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={allRoles}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trips"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminTripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminRequestsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/trips/new" element={<Navigate to="/create-trip" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
