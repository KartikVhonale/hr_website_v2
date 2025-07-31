/**
 * HTTP Client utility using native fetch API
 * Replacement for axios to avoid import issues in Vercel
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to handle response
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(data.message || `HTTP Error: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return { data, status: response.status, statusText: response.statusText };
};

// GET request
export const get = async (url, options = {}) => {
  const { headers = {}, params = {}, ...fetchOptions } = options;
  
  // Add query parameters
  const urlObj = new URL(url.startsWith('http') ? url : `${API_BASE_URL}${url}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      urlObj.searchParams.append(key, params[key]);
    }
  });

  const response = await fetch(urlObj.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...fetchOptions,
  });

  return handleResponse(response);
};

// POST request
export const post = async (url, data = {}, options = {}) => {
  const { headers = {}, ...fetchOptions } = options;
  
  const response = await fetch(url.startsWith('http') ? url : `${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
    ...fetchOptions,
  });

  return handleResponse(response);
};

// PUT request
export const put = async (url, data = {}, options = {}) => {
  const { headers = {}, ...fetchOptions } = options;
  
  const response = await fetch(url.startsWith('http') ? url : `${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
    ...fetchOptions,
  });

  return handleResponse(response);
};

// DELETE request
export const del = async (url, options = {}) => {
  const { headers = {}, ...fetchOptions } = options;
  
  const response = await fetch(url.startsWith('http') ? url : `${API_BASE_URL}${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...fetchOptions,
  });

  return handleResponse(response);
};

// Default export with axios-like interface
const httpClient = {
  get,
  post,
  put,
  delete: del,
  // Axios-compatible methods
  request: async (config) => {
    const { method = 'GET', url, data, ...options } = config;
    
    switch (method.toUpperCase()) {
      case 'GET':
        return get(url, options);
      case 'POST':
        return post(url, data, options);
      case 'PUT':
        return put(url, data, options);
      case 'DELETE':
        return del(url, options);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
};

export default httpClient;
