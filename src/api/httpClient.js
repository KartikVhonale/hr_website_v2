/**
 * Enhanced HTTP Client with optimizations and better error handling
 * Centralized API communication layer
 */

import { API_BASE_URL, REQUEST_TIMEOUT, DEFAULT_HEADERS } from './config.js';
import apiCache from '../utils/apiCache.js';
import cookieCache from '../utils/cookieCache.js';
import { CACHE_TTL, COOKIE_TTL } from '../utils/cacheConstants.js';

// Token management
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Request interceptor to add auth token
const addAuthHeader = (headers = {}) => {
  const token = getAuthToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
};

// Response handler with better error handling
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  let data;
  try {
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  } catch (parseError) {
    console.error('Failed to parse response:', parseError);
    data = { message: 'Failed to parse server response' };
  }

  if (!response.ok) {
    const error = new Error(data.message || `HTTP Error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.statusText = response.statusText;
    error.data = data;
    
    // Handle specific error cases
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      setAuthToken(null);
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    throw error;
  }

  return { data, status: response.status, statusText: response.statusText };
};

// Create AbortController for request timeout
const createTimeoutController = (timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
};

// Base fetch function with common configurations
const baseFetch = async (url, options = {}) => {
  const { timeout = REQUEST_TIMEOUT, headers = {}, ...fetchOptions } = options;
  
  // Create timeout controller
  const { controller, timeoutId } = createTimeoutController(timeout);
  
  try {
    // Construct full URL
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    // Merge headers with auth
    const finalHeaders = addAuthHeader({
      ...DEFAULT_HEADERS,
      ...headers,
    });

    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers: finalHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return handleResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    // Network error
    if (!navigator.onLine) {
      throw new Error('No internet connection');
    }
    
    throw error;
  }
};

// GET request
export const get = async (url, options = {}) => {
  const { params = {}, ...fetchOptions } = options;
  
  // Add query parameters
  const urlObj = new URL(url.startsWith('http') ? url : `${API_BASE_URL}${url}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      urlObj.searchParams.append(key, params[key]);
    }
  });

  return baseFetch(urlObj.toString(), {
    method: 'GET',
    ...fetchOptions,
  });
};

// POST request
export const post = async (url, data = {}, options = {}) => {
  const { headers = {}, ...fetchOptions } = options;
  
  let body;
  let finalHeaders = { ...headers };

  // Handle different data types
  if (data instanceof FormData) {
    body = data;
    // By setting Content-Type to undefined, we prevent the default 'application/json'
    // header from being added, allowing the browser to set the correct multipart boundary.
    finalHeaders['Content-Type'] = undefined;
  } else {
    body = JSON.stringify(data);
    finalHeaders['Content-Type'] = 'application/json';
  }

  return baseFetch(url, {
    method: 'POST',
    headers: finalHeaders,
    body,
    ...fetchOptions,
  });
};

// PUT request
export const put = async (url, data = {}, options = {}) => {
  const { headers = {}, ...fetchOptions } = options;
  
  let body;
  let finalHeaders = { ...headers };

  // Handle different data types
  if (data instanceof FormData) {
    body = data;
    // By setting Content-Type to undefined, we prevent the default 'application/json'
    // header from being added, allowing the browser to set the correct multipart boundary.
    finalHeaders['Content-Type'] = undefined;
  } else {
    body = JSON.stringify(data);
    finalHeaders['Content-Type'] = 'application/json';
  }

  return baseFetch(url, {
    method: 'PUT',
    headers: finalHeaders,
    body,
    ...fetchOptions,
  });
};

// DELETE request
export const del = async (url, options = {}) => {
  return baseFetch(url, {
    method: 'DELETE',
    ...options,
  });
};

// PATCH request
export const patch = async (url, data = {}, options = {}) => {
  const { headers = {}, ...fetchOptions } = options;
  
  return baseFetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
    ...fetchOptions,
  });
};

// Default export with axios-like interface
const httpClient = {
  get,
  post,
  put,
  delete: del,
  patch,
  // Utility methods
  setAuthToken,
  getAuthToken,
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
      case 'PATCH':
        return patch(url, data, options);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
};

// Enhanced GET request with dual caching (memory + cookies)
export const getCached = async (url, options = {}) => {
  const {
    params = {},
    useCache = true,
    cacheTTL = CACHE_TTL.MEDIUM,
    useCookieCache = false,
    cookieTTL = COOKIE_TTL.MEDIUM,
    ...fetchOptions
  } = options;

  if (!useCache) {
    return await get(url, { params, ...fetchOptions });
  }

  const cacheKey = apiCache.generateKey(url, params);

  // Check memory cache first (fastest)
  const memoryData = apiCache.get(url, params);
  if (memoryData) {
    console.log(`Memory cache HIT: ${url}`);
    return memoryData;
  }

  // Check cookie cache for persistent data
  if (useCookieCache) {
    const cookieData = cookieCache.get(cacheKey);
    if (cookieData) {
      console.log(`Cookie cache HIT: ${url}`);
      // Also store in memory cache for faster subsequent access
      apiCache.set(url, params, cookieData, cacheTTL);
      return cookieData;
    }
  }

  // Use deduplication to prevent multiple identical requests
  return await apiCache.deduplicate(cacheKey, async () => {
    const startTime = Date.now();
    const result = await get(url, { params, ...fetchOptions });

    // Track request duration for performance monitoring
    const duration = Date.now() - startTime;

    // Cache successful responses
    if (result) {
      // Always cache in memory
      apiCache.set(url, params, result, cacheTTL);

      // Cache in cookies for persistent data (user preferences, profile, etc.)
      if (useCookieCache) {
        cookieCache.set(cacheKey, result, cookieTTL);
      }
    }

    return result;
  });
};

// Enhanced GET for user-specific data (uses cookie cache)
export const getUserData = async (url, options = {}) => {
  return getCached(url, {
    ...options,
    useCookieCache: true,
    cookieTTL: COOKIE_TTL.SESSION,
    cacheTTL: CACHE_TTL.LONG
  });
};

// Enhanced GET for preferences (long-term cookie storage)
export const getPreferences = async (url, options = {}) => {
  return getCached(url, {
    ...options,
    useCookieCache: true,
    cookieTTL: COOKIE_TTL.PERSISTENT,
    cacheTTL: CACHE_TTL.VERY_LONG
  });
};

// Export TTL constants for use in other files
export { CACHE_TTL, COOKIE_TTL } from '../utils/cacheConstants.js';

// Cache utility functions
export const clearCache = () => {
  apiCache.clear();
  cookieCache.clear();
};

export const getCacheStats = () => {
  const memoryStats = apiCache.getStats();
  const cookieStats = cookieCache.getStats();

  return {
    memory: memoryStats,
    cookies: cookieStats,
    total: {
      entries: memoryStats.total + cookieStats.total,
      valid: memoryStats.valid + cookieStats.valid,
      expired: memoryStats.expired + cookieStats.expired
    }
  };
};

export const invalidateCache = (pattern) => {
  const memoryCleared = apiCache.invalidatePattern(pattern);
  const cookieKeys = cookieCache.keys().filter(key => key.includes(pattern));
  let cookieCleared = 0;

  cookieKeys.forEach(key => {
    if (cookieCache.delete(key)) {
      cookieCleared++;
    }
  });

  console.log(`Cache invalidated: ${memoryCleared} memory + ${cookieCleared} cookie entries`);
  return { memory: memoryCleared, cookies: cookieCleared };
};

// Cookie-specific utilities
export const setUserPreference = (key, value) => cookieCache.setUserPreference(key, value);
export const getUserPreference = (key) => cookieCache.getUserPreference(key);
export const setSessionData = (key, value) => cookieCache.setSessionData(key, value);
export const getSessionData = (key) => cookieCache.getSessionData(key);

export default httpClient;
