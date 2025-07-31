import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Modal from 'react-modal'
import './index.css'
import App from './App.jsx'

// Set the app element for react-modal accessibility
Modal.setAppElement('#root')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
