# API Layer Documentation

This directory contains the centralized API layer for the TalentFlow frontend application. The API layer provides a clean, organized, and optimized way to communicate with the backend services.

## 📁 Structure

```
api/
├── config.js           # API configuration and endpoints
├── httpClient.js        # Enhanced HTTP client with optimizations
├── auth.js             # Authentication API calls
├── jobs.js             # Job-related API calls
├── applications.js     # Application management API calls
├── articles.js         # Article/blog API calls
├── jobseeker.js        # Jobseeker-specific API calls
├── employer.js         # Employer-specific API calls
├── admin.js            # Admin-specific API calls
├── contact.js          # Contact form API calls
├── index.js            # Main export file
├── README.md           # This documentation
└── MIGRATION_GUIDE.md  # Migration guide from old structure
```

## 🚀 Quick Start

### Basic Usage

```javascript
// Import the main API object
import API from '../api/index.js';

// Use specific API services
const jobs = await API.jobs.getAllJobs();
const profile = await API.jobseeker.getJobseekerProfile();
```

### Individual Service Imports

```javascript
// Import specific services
import { jobsAPI, authAPI } from '../api/index.js';

// Use the services
const jobs = await jobsAPI.getAllJobs();
const user = await authAPI.getProfile();
```

### Direct Function Imports

```javascript
// Import specific functions
import { getAllJobs, getProfile } from '../api/index.js';

// Use the functions directly
const jobs = await getAllJobs();
const user = await getProfile();
```

## 🔧 Features

### Enhanced HTTP Client
- **Automatic Authentication**: Adds auth tokens to requests automatically
- **Error Handling**: Comprehensive error handling with structured error objects
- **Request Timeout**: Configurable timeout for all requests
- **Network Detection**: Detects offline status and provides appropriate errors
- **File Upload Support**: Optimized handling for FormData and file uploads

### Centralized Configuration
- **Environment-based URLs**: Automatic API URL detection
- **Endpoint Management**: Centralized endpoint definitions
- **Header Management**: Consistent header handling across all requests

### Optimizations
- **Request Deduplication**: Prevents duplicate requests
- **Automatic Retry**: Built-in retry logic for failed requests
- **Response Caching**: Optional response caching for GET requests
- **Request Cancellation**: Automatic request cancellation on component unmount

## 📚 API Services

### Authentication (`auth.js`)
```javascript
import { authAPI } from '../api/index.js';

// Login user
const result = await authAPI.login({ email, password });

// Get user profile
const profile = await authAPI.getProfile();

// Update profile
await authAPI.updateProfile(profileData);
```

### Jobs (`jobs.js`)
```javascript
import { jobsAPI } from '../api/index.js';

// Get all jobs with filters
const jobs = await jobsAPI.getAllJobs({ location: 'New York' });

// Search jobs
const searchResults = await jobsAPI.searchJobs({
  query: 'developer',
  location: 'remote',
  jobType: 'full-time'
});

// Get featured jobs
const featured = await jobsAPI.getFeaturedJobs(6);
```

### Applications (`applications.js`)
```javascript
import { applicationsAPI } from '../api/index.js';

// Submit application
await applicationsAPI.submitApplication(jobId, {
  resume: fileObject,
  coverLetter: 'My cover letter...'
});

// Update application status
await applicationsAPI.updateApplicationStatus(appId, 'reviewed');
```

### Jobseeker (`jobseeker.js`)
```javascript
import { jobseekerAPI } from '../api/index.js';

// Upload resume
await jobseekerAPI.uploadResume(fileObject);

// Get saved jobs
const savedJobs = await jobseekerAPI.getSavedJobs();

// Save a job
await jobseekerAPI.saveJob(jobId);
```

### Employer (`employer.js`)
```javascript
import { employerAPI } from '../api/index.js';

// Get posted jobs
const postedJobs = await employerAPI.getPostedJobs();

// Create job posting
await employerAPI.createJobPosting(jobData);

// Get applications for job
const applications = await employerAPI.getApplicationsForJob(jobId);
```

## 🛠️ Configuration

### Environment Variables
```bash
# Required
VITE_API_URL=https://your-backend-url.com

# Optional
VITE_REQUEST_TIMEOUT=30000
VITE_ENABLE_API_CACHE=true
```

### Custom Configuration
```javascript
// config.js
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  retryAttempts: 3,
  enableCache: true
};
```

## 🔒 Authentication

The API layer automatically handles authentication:

```javascript
// Token is automatically added to requests
const profile = await authAPI.getProfile();

// Manual token management
import { httpClient } from '../api/index.js';

httpClient.setAuthToken('your-token');
const token = httpClient.getAuthToken();
```

## 🚨 Error Handling

Enhanced error objects provide detailed information:

```javascript
try {
  await jobsAPI.getAllJobs();
} catch (error) {
  console.log('Message:', error.message);
  console.log('Status:', error.status);
  console.log('Data:', error.data);
  
  // Handle specific errors
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 403) {
    // Show permission error
  }
}
```

## 📊 Performance

### Request Optimization
- Automatic request deduplication
- Response compression support
- Efficient file upload handling
- Request cancellation on component unmount

### Caching Strategy
```javascript
// Enable caching for specific requests
const jobs = await jobsAPI.getAllJobs({ cache: true });

// Cache duration can be configured
const jobs = await jobsAPI.getAllJobs({ 
  cache: true, 
  cacheDuration: 300000 // 5 minutes
});
```

## 🧪 Testing

The API layer is designed to be easily testable:

```javascript
// Mock the API for testing
import { jest } from '@jest/globals';
import * as API from '../api/index.js';

jest.mock('../api/index.js', () => ({
  jobsAPI: {
    getAllJobs: jest.fn().mockResolvedValue({ data: [] })
  }
}));
```

## 🔄 Migration

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration instructions from the old service structure.

## 📝 Best Practices

1. **Use TypeScript**: The API layer is prepared for TypeScript integration
2. **Handle Errors**: Always wrap API calls in try-catch blocks
3. **Use Specific Imports**: Import only what you need for better tree-shaking
4. **Cache Wisely**: Use caching for data that doesn't change frequently
5. **Monitor Performance**: Use browser dev tools to monitor API performance

## 🤝 Contributing

When adding new API endpoints:

1. Add the endpoint to `config.js`
2. Create or update the appropriate service file
3. Export the function from `index.js`
4. Update this documentation
5. Add tests for the new functionality

## 📞 Support

For questions or issues with the API layer, please refer to:
- [Migration Guide](./MIGRATION_GUIDE.md)
- Individual service file documentation
- Backend API documentation
