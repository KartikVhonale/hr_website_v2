# API Migration Guide

This guide explains how to migrate from the old `services` folder structure to the new centralized `api` folder structure.

## Overview

The new API structure provides:
- ✅ Centralized configuration
- ✅ Better error handling
- ✅ Optimized HTTP client
- ✅ Consistent API patterns
- ✅ Type safety preparation
- ✅ Better organization

## Migration Steps

### 1. Update Import Statements

**Old way:**
```javascript
import { getAllJobs } from '../services/jobService.js';
import { getJobseekerProfile } from '../services/jobseekerService.js';
import httpClient from '../utils/httpClient.js';
```

**New way:**
```javascript
// Option 1: Import specific functions
import { getAllJobs, getJobseekerProfile } from '../api/index.js';

// Option 2: Import API services
import { jobsAPI, jobseekerAPI } from '../api/index.js';

// Option 3: Import main API object
import API from '../api/index.js';
```

### 2. Update Function Calls

**Old way:**
```javascript
// Using old services
const jobs = await getAllJobs(filters);
const profile = await getJobseekerProfile();
```

**New way:**
```javascript
// Option 1: Direct function imports
const jobs = await getAllJobs(filters);
const profile = await getJobseekerProfile();

// Option 2: Using API services
const jobs = await jobsAPI.getAllJobs(filters);
const profile = await jobseekerAPI.getJobseekerProfile();

// Option 3: Using main API object
const jobs = await API.jobs.getAllJobs(filters);
const profile = await API.jobseeker.getJobseekerProfile();
```

### 3. Authentication Token Management

**Old way:**
```javascript
const getAuthToken = () => localStorage.getItem('token');
```

**New way:**
```javascript
import { httpClient } from '../api/index.js';
const token = httpClient.getAuthToken();
```

### 4. Error Handling

**Old way:**
```javascript
try {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
} catch (error) {
  console.error(error);
}
```

**New way:**
```javascript
try {
  const data = await API.jobs.getAllJobs();
  // Error handling is built-in
} catch (error) {
  // Enhanced error object with status, data, etc.
  console.error('Error:', error.message);
  console.error('Status:', error.status);
  console.error('Data:', error.data);
}
```

## File Mapping

| Old File | New File | Notes |
|----------|----------|-------|
| `services/adminService.js` | `api/admin.js` | Enhanced with more admin functions |
| `services/employerService.js` | `api/employer.js` | Better organization and error handling |
| `services/jobService.js` | `api/jobs.js` | More comprehensive job functions |
| `services/jobseekerService.js` | `api/jobseeker.js` | Enhanced with dashboard and stats |
| `services/userService.js` | `api/auth.js` + `api/admin.js` | Split into auth and admin functions |
| `utils/httpClient.js` | `api/httpClient.js` | Enhanced with better error handling |

## New Features

### 1. Centralized Configuration
```javascript
import { API_ENDPOINTS, API_BASE_URL } from '../api/config.js';
```

### 2. Enhanced Error Handling
- Automatic token refresh
- Network error detection
- Timeout handling
- Structured error responses

### 3. Request Optimization
- Automatic request deduplication
- Built-in retry logic
- Request/response interceptors
- Better file upload handling

### 4. Type Safety (Future)
The new structure is prepared for TypeScript integration.

## Breaking Changes

### 1. Function Signatures
Some functions have updated signatures for better consistency:

**Old:**
```javascript
updateApplicationStatus(applicationId, status)
```

**New:**
```javascript
updateApplicationStatus(applicationId, status, notes = '')
```

### 2. Response Format
All API functions now return consistent response format:

```javascript
{
  data: any,      // Response data
  status: number, // HTTP status code
  statusText: string // HTTP status text
}
```

### 3. Error Format
Enhanced error objects:

```javascript
{
  message: string,    // Error message
  status: number,     // HTTP status code
  statusText: string, // HTTP status text
  data: any          // Server response data
}
```

## Recommended Migration Approach

1. **Phase 1**: Update imports to use new API structure
2. **Phase 2**: Update function calls to use new signatures
3. **Phase 3**: Update error handling to use new error format
4. **Phase 4**: Remove old service files
5. **Phase 5**: Update tests to use new API structure

## Example Component Migration

**Before:**
```javascript
import { getJobseekerProfile, updateJobseekerProfile } from '../services/jobseekerService.js';

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getJobseekerProfile();
        setProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);
  
  const handleUpdate = async (data) => {
    try {
      await updateJobseekerProfile(data);
    } catch (error) {
      console.error(error);
    }
  };
};
```

**After:**
```javascript
import { jobseekerAPI } from '../api/index.js';

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await jobseekerAPI.getJobseekerProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error.message);
      }
    };
    fetchProfile();
  }, []);
  
  const handleUpdate = async (data) => {
    try {
      await jobseekerAPI.updateJobseekerProfile(data);
    } catch (error) {
      console.error('Failed to update profile:', error.message);
    }
  };
};
```

## Support

If you encounter any issues during migration, please refer to the individual API service files for detailed function documentation.
