import { RouterProvider } from 'react-router-dom'
import { LocaleAuthSync } from './components/LocaleAuthSync'
import { AuthProvider } from './context/AuthContext'
import { LocaleProvider } from './context/LocaleContext'
import { appRouter } from './appRouter'

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <LocaleAuthSync />
        <RouterProvider router={appRouter} />
      </AuthProvider>
    </LocaleProvider>
  )
}
