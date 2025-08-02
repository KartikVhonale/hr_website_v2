/**
 * Test file to verify all exports are working correctly
 * This can be imported in the console to debug export issues
 */

// Test API Cache exports
import apiCache, { CACHE_TTL } from './apiCache.js';
console.log('✅ API Cache imported successfully');
console.log('CACHE_TTL:', CACHE_TTL);

// Test Cookie Cache exports  
import cookieCache, { COOKIE_TTL } from './cookieCache.js';
console.log('✅ Cookie Cache imported successfully');
console.log('COOKIE_TTL:', COOKIE_TTL);

// Test HTTP Client exports
import httpClient, { 
  getCached, 
  getUserData, 
  clearCache, 
  getCacheStats,
  CACHE_TTL as HTTP_CACHE_TTL,
  COOKIE_TTL as HTTP_COOKIE_TTL
} from '../api/httpClient.js';
console.log('✅ HTTP Client imported successfully');
console.log('HTTP_CACHE_TTL:', HTTP_CACHE_TTL);
console.log('HTTP_COOKIE_TTL:', HTTP_COOKIE_TTL);

// Test User Preferences
import userPreferences from './userPreferences.js';
console.log('✅ User Preferences imported successfully');

// Test Form Auto Save Hook
import { useFormAutoSave, useSearchFilters } from '../hooks/useFormAutoSave.js';
console.log('✅ Form Auto Save hooks imported successfully');

// Export test function
export const testAllExports = () => {
  console.log('🧪 Testing all exports...');
  
  // Test cache functionality
  const testKey = 'test-key';
  const testData = { message: 'Hello World', timestamp: Date.now() };
  
  // Test API cache
  apiCache.set(testKey, {}, testData, CACHE_TTL.SHORT);
  const cachedData = apiCache.get(testKey, {});
  console.log('API Cache test:', cachedData ? '✅ PASS' : '❌ FAIL');
  
  // Test cookie cache
  cookieCache.set(testKey, testData, COOKIE_TTL.SHORT);
  const cookieData = cookieCache.get(testKey);
  console.log('Cookie Cache test:', cookieData ? '✅ PASS' : '❌ FAIL');
  
  // Test user preferences
  userPreferences.setActiveSection('test-section');
  const activeSection = userPreferences.getActiveSection();
  console.log('User Preferences test:', activeSection === 'test-section' ? '✅ PASS' : '❌ FAIL');
  
  // Test cache stats
  const stats = getCacheStats();
  console.log('Cache Stats test:', stats && stats.memory && stats.cookies ? '✅ PASS' : '❌ FAIL');
  
  console.log('🎉 All export tests completed!');
  
  return {
    apiCache: !!cachedData,
    cookieCache: !!cookieData,
    userPreferences: activeSection === 'test-section',
    cacheStats: !!(stats && stats.memory && stats.cookies)
  };
};

// Auto-run test in development
if (import.meta.env.DEV) {
  console.log('🔧 Development mode: Running export tests...');
  setTimeout(() => {
    try {
      testAllExports();
    } catch (error) {
      console.error('❌ Export test failed:', error);
    }
  }, 1000);
}

export default {
  testAllExports,
  apiCache,
  cookieCache,
  userPreferences,
  CACHE_TTL,
  COOKIE_TTL
};
