import './lib/translateDomPatch.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Provider } from './components/ui/provider'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
