import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { SiteThemeProvider } from './context/SiteThemeContext'
import { LanguageProvider } from './i18n/LanguageProvider'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Basename follows the build's base, so the same bundle works whether it
        is hosted under /admin/ or at the root of its own domain. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider>
        <SiteThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </ToastProvider>
          </AuthProvider>
        </SiteThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
