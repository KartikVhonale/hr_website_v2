import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Modal from 'react-modal'
import './index.css'
import App from './App.jsx'

// Set the app element for react-modal accessibility
Modal.setAppElement('#root')

// Helper function to identify browser extension errors
export const isBrowserExtensionError = (error) => {
  const errorMessage = error?.message || String(error) || '';
  return (
    errorMessage.includes('onMessage listener') ||
    errorMessage.includes('Extension context invalidated') ||
    errorMessage.includes('chrome-extension://') ||
    errorMessage.includes('moz-extension://') ||
    errorMessage.includes('Promised response from onMessage listener went out of scope')
  );
};

// Global error handler to filter out browser extension errors
window.addEventListener('error', (event) => {
  if (isBrowserExtensionError(event.error || event.message)) {
    console.warn('Browser extension error detected (ignoring):', event.error);
    event.preventDefault();
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (isBrowserExtensionError(event.reason)) {
    console.warn('Browser extension promise rejection detected (ignoring):', event.reason);
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
