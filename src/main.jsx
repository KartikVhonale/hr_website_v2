import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Modal from 'react-modal'
import './index.css'
import App from './App.jsx'

// Set the app element for react-modal accessibility
Modal.setAppElement('#root')

// Global error handler to filter out browser extension errors
window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  const isExtensionError =
    errorMessage.includes('onMessage listener') ||
    errorMessage.includes('Extension context invalidated') ||
    errorMessage.includes('chrome-extension://') ||
    errorMessage.includes('moz-extension://') ||
    errorMessage.includes('Promised response from onMessage listener went out of scope');

  if (isExtensionError) {
    console.warn('Browser extension error detected (ignoring):', event.error);
    event.preventDefault();
    return false;
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || event.reason || '';
  const isExtensionError =
    errorMessage.includes('onMessage listener') ||
    errorMessage.includes('Extension context invalidated') ||
    errorMessage.includes('chrome-extension://') ||
    errorMessage.includes('moz-extension://') ||
    errorMessage.includes('Promised response from onMessage listener went out of scope');

  if (isExtensionError) {
    console.warn('Browser extension promise rejection detected (ignoring):', event.reason);
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
