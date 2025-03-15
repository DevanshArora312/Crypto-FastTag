import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AnonAadhaarProvider } from '@anon-aadhaar/react'
createRoot(document.getElementById('root')).render(
  <AnonAadhaarProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AnonAadhaarProvider>,
)
