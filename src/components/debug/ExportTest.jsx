/**
 * Debug component to test exports
 */

import React, { useEffect, useState } from 'react';

const ExportTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        console.log('🧪 Starting export tests...');
        
        // Test 1: Import CACHE_TTL from apiCache
        const { CACHE_TTL } = await import('../../utils/apiCache.js');
        console.log('✅ CACHE_TTL from apiCache:', CACHE_TTL);
        
        // Test 2: Import COOKIE_TTL from cookieCache
        const { COOKIE_TTL } = await import('../../utils/cookieCache.js');
        console.log('✅ COOKIE_TTL from cookieCache:', COOKIE_TTL);
        
        // Test 3: Import from httpClient
        const httpClientModule = await import('../../api/httpClient.js');
        console.log('✅ httpClient module:', Object.keys(httpClientModule));
        
        // Test 4: Import specific exports from httpClient
        const { 
          getCached, 
          getUserData, 
          CACHE_TTL: HTTP_CACHE_TTL,
          COOKIE_TTL: HTTP_COOKIE_TTL
        } = await import('../../api/httpClient.js');
        
        console.log('✅ getCached:', typeof getCached);
        console.log('✅ getUserData:', typeof getUserData);
        console.log('✅ HTTP_CACHE_TTL:', HTTP_CACHE_TTL);
        console.log('✅ HTTP_COOKIE_TTL:', HTTP_COOKIE_TTL);
        
        setTestResults({
          apiCache_CACHE_TTL: !!CACHE_TTL,
          cookieCache_COOKIE_TTL: !!COOKIE_TTL,
          httpClient_getCached: typeof getCached === 'function',
          httpClient_getUserData: typeof getUserData === 'function',
          httpClient_CACHE_TTL: !!HTTP_CACHE_TTL,
          httpClient_COOKIE_TTL: !!HTTP_COOKIE_TTL
        });
        
        console.log('🎉 All export tests completed successfully!');
        
      } catch (err) {
        console.error('❌ Export test failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
        <h3>🧪 Running Export Tests...</h3>
        <p>Check the console for detailed results.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid red', margin: '20px', backgroundColor: '#ffe6e6' }}>
        <h3>❌ Export Test Failed</h3>
        <p><strong>Error:</strong> {error}</p>
        <p>Check the console for more details.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid green', margin: '20px', backgroundColor: '#e6ffe6' }}>
      <h3>🧪 Export Test Results</h3>
      <ul>
        {Object.entries(testResults).map(([test, passed]) => (
          <li key={test} style={{ color: passed ? 'green' : 'red' }}>
            {passed ? '✅' : '❌'} {test}
          </li>
        ))}
      </ul>
      <p><strong>All tests passed:</strong> {Object.values(testResults).every(Boolean) ? '✅ YES' : '❌ NO'}</p>
    </div>
  );
};

export default ExportTest;
