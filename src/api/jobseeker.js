/**
 * Jobseeker API Service
 * Handles all jobseeker-specific API calls
 */

import httpClient, {
  getCached,
  getUserData,
  CACHE_TTL
} from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get jobseeker profile (cached in cookies for session persistence)
export const getJobseekerProfile = async () => {
  try {
    const response = await getUserData(API_ENDPOINTS.JOBSEEKER.PROFILE, {
      cacheTTL: CACHE_TTL.LONG,
      useCookieCache: true
    });
    return response;
  } catch (error) {
    console.error('Get jobseeker profile error:', error);
    throw error;
  }
};

// Update jobseeker profile
export const updateJobseekerProfile = async (profileData) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.JOBSEEKER.PROFILE, profileData);
    
    // Update local user data if successful
    if (response.data.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Update jobseeker profile error:', error);
    throw error;
  }
};

// Get saved jobs (cached for 5 minutes)
export const getSavedJobs = async (filters = {}) => {
  try {
    const response = await getCached(API_ENDPOINTS.JOBSEEKER.SAVED_JOBS, {
      params: filters,
      cacheTTL: CACHE_TTL.MEDIUM,
      useCookieCache: true
    });
    return response;
  } catch (error) {
    console.error('Get saved jobs error:', error);
    // Return empty array on error to prevent crashes
    return { success: true, data: [] };
  }
};

// Save a job
export const saveJob = async (jobId) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.JOBSEEKER.SAVE_JOB(jobId));
    return response.data;
  } catch (error) {
    console.error('Save job error:', error);
    throw error;
  }
};

// Unsave a job
export const unsaveJob = async (jobId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.JOBSEEKER.SAVE_JOB(jobId));
    return response.data;
  } catch (error) {
    console.error('Unsave job error:', error);
    throw error;
  }
};

// Get applied jobs
export const getAppliedJobs = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.JOBSEEKER.APPLIED_JOBS, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get applied jobs error:', error);
    throw error;
  }
};

// Upload resume
export const uploadResume = async (file) => {
  try {
    console.log('Uploading resume file:', file.name);

    const formData = new FormData();
    formData.append('resume', file);

    const response = await httpClient.post(API_ENDPOINTS.JOBSEEKER.UPLOAD_RESUME, formData);

    console.log('Resume upload response:', response);
    return response.data;
  } catch (error) {
    console.error('Resume upload error:', error);
    throw error;
  }
};

// Delete resume
export const deleteResume = async () => {
  try {
    console.log('Deleting resume');

    const response = await httpClient.delete(API_ENDPOINTS.JOBSEEKER.RESUME);

    console.log('Resume delete response:', response);
    return response.data;
  } catch (error) {
    console.error('Resume delete error:', error);
    throw error;
  }
};

// Get resume details
export const getResumeDetails = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.JOBSEEKER.RESUME);
    return response.data;
  } catch (error) {
    console.error('Get resume details error:', error);
    throw error;
  }
};

// Update resume visibility
export const updateResumeVisibility = async (isPublic) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.JOBSEEKER.RESUME}/visibility`, {
      isPublic
    });
    return response.data;
  } catch (error) {
    console.error('Update resume visibility error:', error);
    throw error;
  }
};

// Get job recommendations
export const getJobRecommendations = async (limit = 10) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.JOBSEEKER.BASE}/recommendations`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get job recommendations error:', error);
    throw error;
  }
};

// Get application status for a specific job
export const getApplicationStatus = async (jobId) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.JOBSEEKER.BASE}/application-status/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Get application status error:', error);
    throw error;
  }
};

// Get jobseeker dashboard data (Optimized with cookie caching)
export const getDashboardData = async () => {
  try {
    const response = await getUserData(`${API_ENDPOINTS.JOBSEEKER.BASE}/dashboard`, {
      cacheTTL: CACHE_TTL.MEDIUM,
      useCookieCache: true
    });
    return response;
  } catch (error) {
    console.error('Get dashboard data error:', error);
    throw error;
  }
};

// Get interview schedule
export const getInterviewSchedule = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.JOBSEEKER.BASE}/interviews`);
    return response.data;
  } catch (error) {
    console.error('Get interview schedule error:', error);
    throw error;
  }
};

// Update interview response
export const updateInterviewResponse = async (interviewId, response) => {
  try {
    const result = await httpClient.put(`${API_ENDPOINTS.JOBSEEKER.BASE}/interviews/${interviewId}`, {
      response
    });
    return result.data;
  } catch (error) {
    console.error('Update interview response error:', error);
    throw error;
  }
};

// Get notifications
export const getNotifications = async (filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.JOBSEEKER.BASE}/notifications`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.JOBSEEKER.BASE}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

// Get jobseeker statistics
export const getJobseekerStats = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.JOBSEEKER.BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get jobseeker stats error:', error);
    throw error;
  }
};

// Update job preferences
export const updateJobPreferences = async (preferences) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.JOBSEEKER.BASE}/preferences`, preferences);
    return response.data;
  } catch (error) {
    console.error('Update job preferences error:', error);
    throw error;
  }
};

// Jobseeker API object for easier imports
const jobseekerAPI = {
  getJobseekerProfile,
  updateJobseekerProfile,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getAppliedJobs,
  uploadResume,
  deleteResume,
  getResumeDetails,
  updateResumeVisibility,
  getJobRecommendations,
  getApplicationStatus,
  getDashboardData,
  getInterviewSchedule,
  updateInterviewResponse,
  getNotifications,
  markNotificationAsRead,
  getJobseekerStats,
  updateJobPreferences,
};

export default jobseekerAPI;
