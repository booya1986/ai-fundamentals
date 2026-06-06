import { createRoot } from 'react-dom/client'
// Self-hosted fonts (offline-safe for the SCORM package) — bundled by Vite.
import '@fontsource/noto-sans-hebrew/400.css'
import '@fontsource/noto-sans-hebrew/500.css'
import '@fontsource/noto-sans-hebrew/600.css'
import '@fontsource/noto-sans-hebrew/700.css'
import '@fontsource/noto-sans-hebrew/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'
import './styles/tokens.css'
import './index.css'
import App from './App.jsx'

// No StrictMode: it double-invokes effects in dev, which would call SCORM
// Initialize twice and double the faux-timers. One mount, one SCORM session.
createRoot(document.getElementById('root')).render(<App />)
