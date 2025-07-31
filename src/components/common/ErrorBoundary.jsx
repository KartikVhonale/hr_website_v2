import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Filter out browser extension errors
    const errorMessage = error.message || '';
    const isExtensionError = 
      errorMessage.includes('onMessage listener') ||
      errorMessage.includes('Extension context invalidated') ||
      errorMessage.includes('chrome-extension://') ||
      errorMessage.includes('moz-extension://');

    if (isExtensionError) {
      console.warn('Browser extension error detected (ignoring):', error);
      // Reset the error boundary for extension errors
      this.setState({ hasError: false, error: null, errorInfo: null });
      return;
    }

    // Log actual application errors
    console.error('Application error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for actual application errors
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="retry-button"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="reload-button"
            >
              Reload Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Error Details (Development)</summary>
              <pre>{this.state.error && this.state.error.toString()}</pre>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
