/**
 * Simple API Response Caching System
 * Prevents redundant API requests for the same data
 */

class APICache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  /**
   * Generate cache key from URL and params
   */
  generateKey(url, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${url}${paramString ? '?' + paramString : ''}`;
  }

  /**
   * Check if cached data is still valid
   */
  isValid(cacheEntry) {
    return Date.now() < cacheEntry.expiresAt;
  }

  /**
   * Get cached data if available and valid
   */
  get(url, params = {}) {
    const key = this.generateKey(url, params);
    const cacheEntry = this.cache.get(key);
    
    if (cacheEntry && this.isValid(cacheEntry)) {
      console.log(`Cache HIT for: ${key}`);
      return cacheEntry.data;
    }
    
    console.log(`Cache MISS for: ${key}`);
    return null;
  }

  /**
   * Store data in cache with TTL
   */
  set(url, params = {}, data, ttl = this.defaultTTL) {
    const key = this.generateKey(url, params);
    const expiresAt = Date.now() + ttl;
    
    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: Date.now()
    });
    
    console.log(`Cache SET for: ${key} (expires in ${ttl/1000}s)`);
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(url, params = {}) {
    const key = this.generateKey(url, params);
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`Cache INVALIDATED for: ${key}`);
    }
    return deleted;
  }

  /**
   * Invalidate cache entries matching pattern
   */
  invalidatePattern(pattern) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`Cache INVALIDATED ${count} entries matching: ${pattern}`);
    return count;
  }

  /**
   * Clear all cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.pendingRequests.clear();
    console.log(`Cache CLEARED ${size} entries`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const entry of this.cache.values()) {
      if (now < entry.expiresAt) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }
    
    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      pending: this.pendingRequests.size
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`Cache CLEANUP removed ${cleaned} expired entries`);
    }
    
    return cleaned;
  }

  /**
   * Prevent duplicate requests for the same resource
   */
  async deduplicate(key, requestFn) {
    // If request is already pending, wait for it
    if (this.pendingRequests.has(key)) {
      console.log(`Request DEDUPLICATION for: ${key}`);
      return await this.pendingRequests.get(key);
    }

    // Start new request and store promise
    const requestPromise = requestFn();
    this.pendingRequests.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(key);
    }
  }
}

// Create singleton instance
const apiCache = new APICache();

// Auto cleanup every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);

export default apiCache;
