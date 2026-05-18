import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import { ThemeProvider } from '@/context/ThemeContext'
import { MonthProvider } from '@/context/MonthContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <MonthProvider>
          <App />
        </MonthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
