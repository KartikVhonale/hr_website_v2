/**
 * Cookie-based caching system for temporary data storage
 * Ideal for user preferences, session data, and small cached responses
 */

class CookieCache {
  constructor() {
    this.prefix = 'hr_cache_';
    this.maxCookieSize = 4000; // Stay under 4KB cookie limit
    this.defaultTTL = 30 * 60 * 1000; // 30 minutes default
  }

  /**
   * Set cookie with data and expiration
   */
  set(key, data, ttlMs = this.defaultTTL) {
    try {
      const expiresAt = Date.now() + ttlMs;
      const cacheData = {
        data,
        expiresAt,
        createdAt: Date.now()
      };

      const serialized = JSON.stringify(cacheData);
      
      // Check size limit
      if (serialized.length > this.maxCookieSize) {
        console.warn(`Cookie cache: Data too large for key ${key} (${serialized.length} bytes)`);
        return false;
      }

      const cookieName = this.prefix + key;
      const expires = new Date(expiresAt).toUTCString();
      
      document.cookie = `${cookieName}=${encodeURIComponent(serialized)}; expires=${expires}; path=/; SameSite=Lax`;
      
      console.log(`Cookie cache SET: ${key} (expires in ${ttlMs/1000}s)`);
      return true;
    } catch (error) {
      console.error('Cookie cache set error:', error);
      return false;
    }
  }

  /**
   * Get cached data from cookie
   */
  get(key) {
    try {
      const cookieName = this.prefix + key;
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
          const cacheData = JSON.parse(decodeURIComponent(value));
          
          // Check if expired
          if (Date.now() > cacheData.expiresAt) {
            this.delete(key);
            console.log(`Cookie cache EXPIRED: ${key}`);
            return null;
          }
          
          console.log(`Cookie cache HIT: ${key}`);
          return cacheData.data;
        }
      }
      
      console.log(`Cookie cache MISS: ${key}`);
      return null;
    } catch (error) {
      console.error('Cookie cache get error:', error);
      return null;
    }
  }

  /**
   * Delete specific cookie
   */
  delete(key) {
    try {
      const cookieName = this.prefix + key;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      console.log(`Cookie cache DELETE: ${key}`);
      return true;
    } catch (error) {
      console.error('Cookie cache delete error:', error);
      return false;
    }
  }

  /**
   * Check if key exists and is valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Clear all cache cookies
   */
  clear() {
    try {
      const cookies = document.cookie.split(';');
      let cleared = 0;
      
      for (let cookie of cookies) {
        const name = cookie.trim().split('=')[0];
        if (name.startsWith(this.prefix)) {
          const key = name.replace(this.prefix, '');
          this.delete(key);
          cleared++;
        }
      }
      
      console.log(`Cookie cache CLEARED: ${cleared} entries`);
      return cleared;
    } catch (error) {
      console.error('Cookie cache clear error:', error);
      return 0;
    }
  }

  /**
   * Get all cache keys
   */
  keys() {
    try {
      const cookies = document.cookie.split(';');
      const keys = [];
      
      for (let cookie of cookies) {
        const name = cookie.trim().split('=')[0];
        if (name.startsWith(this.prefix)) {
          keys.push(name.replace(this.prefix, ''));
        }
      }
      
      return keys;
    } catch (error) {
      console.error('Cookie cache keys error:', error);
      return [];
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    try {
      const keys = this.keys();
      let totalSize = 0;
      let validEntries = 0;
      let expiredEntries = 0;
      
      for (let key of keys) {
        const data = this.get(key);
        if (data) {
          validEntries++;
          totalSize += JSON.stringify(data).length;
        } else {
          expiredEntries++;
        }
      }
      
      return {
        total: keys.length,
        valid: validEntries,
        expired: expiredEntries,
        totalSize,
        averageSize: validEntries > 0 ? Math.round(totalSize / validEntries) : 0
      };
    } catch (error) {
      console.error('Cookie cache stats error:', error);
      return { total: 0, valid: 0, expired: 0, totalSize: 0, averageSize: 0 };
    }
  }

  /**
   * Cleanup expired entries
   */
  cleanup() {
    try {
      const keys = this.keys();
      let cleaned = 0;
      
      for (let key of keys) {
        if (!this.has(key)) {
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        console.log(`Cookie cache CLEANUP: removed ${cleaned} expired entries`);
      }
      
      return cleaned;
    } catch (error) {
      console.error('Cookie cache cleanup error:', error);
      return 0;
    }
  }

  /**
   * Set user preferences (long-term storage)
   */
  setUserPreference(key, value) {
    return this.set(`pref_${key}`, value, 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  /**
   * Get user preferences
   */
  getUserPreference(key) {
    return this.get(`pref_${key}`);
  }

  /**
   * Set session data (short-term storage)
   */
  setSessionData(key, value) {
    return this.set(`session_${key}`, value, 60 * 60 * 1000); // 1 hour
  }

  /**
   * Get session data
   */
  getSessionData(key) {
    return this.get(`session_${key}`);
  }
}

// Create singleton instance
const cookieCache = new CookieCache();

// Auto cleanup every 5 minutes
setInterval(() => {
  cookieCache.cleanup();
}, 5 * 60 * 1000);

export default cookieCache;
