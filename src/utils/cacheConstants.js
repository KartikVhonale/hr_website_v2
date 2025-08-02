/**
 * Centralized cache constants for consistent TTL values across the application
 */

// Memory cache TTL constants
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes
  MEDIUM: 5 * 60 * 1000,     // 5 minutes  
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000  // 1 hour
};

// Cookie cache TTL constants
export const COOKIE_TTL = {
  SHORT: 5 * 60 * 1000,        // 5 minutes
  MEDIUM: 30 * 60 * 1000,      // 30 minutes  
  LONG: 2 * 60 * 60 * 1000,    // 2 hours
  SESSION: 8 * 60 * 60 * 1000, // 8 hours
  PERSISTENT: 30 * 24 * 60 * 60 * 1000 // 30 days
};

// Export both as default for convenience
export default {
  CACHE_TTL,
  COOKIE_TTL
};
