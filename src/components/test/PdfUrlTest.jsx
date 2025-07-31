import React, { useState } from 'react';
import { FaCheck, FaTimes, FaExternalLinkAlt, FaDownload } from 'react-icons/fa';

const PdfUrlTest = () => {
  const [testResults, setTestResults] = useState(null);

  // Sample resume data with proper PDF extension
  const sampleResumeData = {
    url: "https://res.cloudinary.com/dr4uuk5x0/raw/upload/v1234567890/talentflow/resumes/resume_John_Doe_Resume_1234567890.pdf",
    original_name: "John_Doe_Resume.pdf",
    public_id: "talentflow/resumes/resume_John_Doe_Resume_1234567890.pdf"
  };

  const runTests = () => {
    console.log('=== PDF URL TESTS ===');
    
    const tests = {
      hasProperExtension: sampleResumeData.url.endsWith('.pdf'),
      isRawResource: sampleResumeData.url.includes('/raw/upload/'),
      hasCloudinaryDomain: sampleResumeData.url.includes('res.cloudinary.com'),
      hasProperFolder: sampleResumeData.url.includes('talentflow/resumes'),
      publicIdHasExtension: sampleResumeData.public_id.endsWith('.pdf')
    };

    // Test download URL generation
    const urlParts = sampleResumeData.url.split('/upload/');
    const downloadUrl = urlParts.length === 2 ? 
      `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}` : 
      null;

    const downloadTests = {
      canGenerateDownloadUrl: downloadUrl !== null,
      downloadUrlHasAttachment: downloadUrl?.includes('fl_attachment'),
      downloadUrlKeepsExtension: downloadUrl?.endsWith('.pdf')
    };

    const allTests = { ...tests, ...downloadTests };
    const passedTests = Object.values(allTests).filter(Boolean).length;
    const totalTests = Object.keys(allTests).length;

    setTestResults({
      tests: allTests,
      downloadUrl,
      passedTests,
      totalTests,
      allPassed: passedTests === totalTests
    });

    console.log('Test Results:', allTests);
    console.log('Download URL:', downloadUrl);
    console.log(`Passed: ${passedTests}/${totalTests}`);
  };

  const testViewUrl = () => {
    console.log('Testing view URL:', sampleResumeData.url);
    window.open(sampleResumeData.url, '_blank');
  };

  const testDownloadUrl = () => {
    if (testResults?.downloadUrl) {
      console.log('Testing download URL:', testResults.downloadUrl);
      const link = document.createElement('a');
      link.href = testResults.downloadUrl;
      link.download = sampleResumeData.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>PDF URL Test Component</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Sample Resume Data:</h3>
        <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem' }}>
          <div><strong>URL:</strong> {sampleResumeData.url}</div>
          <div><strong>Original Name:</strong> {sampleResumeData.original_name}</div>
          <div><strong>Public ID:</strong> {sampleResumeData.public_id}</div>
        </div>
      </div>

      <button 
        onClick={runTests}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        Run PDF URL Tests
      </button>

      {testResults && (
        <div>
          <h3>Test Results ({testResults.passedTests}/{testResults.totalTests} passed)</h3>
          
          <div style={{ marginBottom: '2rem' }}>
            {Object.entries(testResults.tests).map(([test, passed]) => (
              <div key={test} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '0.5rem' 
              }}>
                {passed ? <FaCheck style={{ color: 'green' }} /> : <FaTimes style={{ color: 'red' }} />}
                <span style={{ color: passed ? 'green' : 'red' }}>
                  {test.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </div>
            ))}
          </div>

          {testResults.downloadUrl && (
            <div style={{ marginBottom: '2rem' }}>
              <h4>Generated Download URL:</h4>
              <div style={{ 
                background: '#f5f5f5', 
                padding: '1rem', 
                borderRadius: '4px', 
                fontSize: '0.9rem',
                wordBreak: 'break-all'
              }}>
                {testResults.downloadUrl}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={testViewUrl}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <FaExternalLinkAlt /> Test View URL
            </button>

            <button
              onClick={testDownloadUrl}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <FaDownload /> Test Download URL
            </button>
          </div>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: testResults.allPassed ? '#d4edda' : '#f8d7da',
            border: `1px solid ${testResults.allPassed ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            color: testResults.allPassed ? '#155724' : '#721c24'
          }}>
            <strong>
              {testResults.allPassed ? 
                '✅ All tests passed! PDF URLs are properly configured.' : 
                '❌ Some tests failed. Check PDF URL configuration.'
              }
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUrlTest;
