import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Mission from './Mission.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Mission />
  </StrictMode>,
)
