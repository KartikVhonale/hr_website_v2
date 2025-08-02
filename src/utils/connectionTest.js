/**
 * Connection Test Utility
 * Tests the connection between frontend and backend
 */

import { API_BASE_URL } from '../api/config.js';

export const testConnection = async () => {
  console.log('🔄 Testing frontend-backend connection...');
  console.log('📍 API Base URL:', API_BASE_URL);

  const tests = [];

  // Test 1: Basic connectivity
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs?limit=1`);
    const data = await response.json();
    
    if (response.ok) {
      tests.push({
        name: 'Basic Connectivity',
        status: '✅ PASS',
        details: `Connected successfully. Status: ${response.status}`
      });
    } else {
      tests.push({
        name: 'Basic Connectivity',
        status: '❌ FAIL',
        details: `HTTP ${response.status}: ${data.message || 'Unknown error'}`
      });
    }
  } catch (error) {
    tests.push({
      name: 'Basic Connectivity',
      status: '❌ FAIL',
      details: `Network error: ${error.message}`
    });
  }

  // Test 2: CORS Configuration
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'OPTIONS'
    });
    
    tests.push({
      name: 'CORS Configuration',
      status: response.ok ? '✅ PASS' : '⚠️ WARNING',
      details: `OPTIONS request status: ${response.status}`
    });
  } catch (error) {
    tests.push({
      name: 'CORS Configuration',
      status: '❌ FAIL',
      details: `CORS error: ${error.message}`
    });
  }

  // Test 3: API Response Format
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs?limit=1`);
    const data = await response.json();
    
    if (data && typeof data === 'object' && 'success' in data) {
      tests.push({
        name: 'API Response Format',
        status: '✅ PASS',
        details: 'Response follows expected format'
      });
    } else {
      tests.push({
        name: 'API Response Format',
        status: '⚠️ WARNING',
        details: 'Response format may not match expected structure'
      });
    }
  } catch (error) {
    tests.push({
      name: 'API Response Format',
      status: '❌ FAIL',
      details: `JSON parsing error: ${error.message}`
    });
  }

  // Test 4: Authentication Endpoint
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    if (response.status === 401) {
      tests.push({
        name: 'Authentication Endpoint',
        status: '✅ PASS',
        details: 'Auth endpoint properly rejects invalid tokens'
      });
    } else {
      tests.push({
        name: 'Authentication Endpoint',
        status: '⚠️ WARNING',
        details: `Unexpected status: ${response.status}`
      });
    }
  } catch (error) {
    tests.push({
      name: 'Authentication Endpoint',
      status: '❌ FAIL',
      details: `Auth test error: ${error.message}`
    });
  }

  // Print results
  console.log('\n📊 Connection Test Results:');
  console.log('=' .repeat(50));
  
  tests.forEach(test => {
    console.log(`${test.status} ${test.name}`);
    console.log(`   ${test.details}`);
    console.log('');
  });

  const passCount = tests.filter(t => t.status.includes('PASS')).length;
  const totalCount = tests.length;
  
  console.log(`📈 Summary: ${passCount}/${totalCount} tests passed`);
  
  if (passCount === totalCount) {
    console.log('🎉 All tests passed! Frontend-backend connection is working properly.');
  } else if (passCount > 0) {
    console.log('⚠️ Some tests failed. Check the details above.');
  } else {
    console.log('❌ All tests failed. There may be a connection issue.');
  }

  return {
    success: passCount > 0,
    passCount,
    totalCount,
    tests
  };
};

// Quick connection check
export const quickConnectionCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs?limit=1`);
    return {
      connected: response.ok,
      status: response.status,
      url: API_BASE_URL
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      url: API_BASE_URL
    };
  }
};

// Environment info
export const getEnvironmentInfo = () => {
  return {
    apiBaseUrl: API_BASE_URL,
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    customApiUrl: import.meta.env.VITE_API_URL
  };
};

export default {
  testConnection,
  quickConnectionCheck,
  getEnvironmentInfo
};
