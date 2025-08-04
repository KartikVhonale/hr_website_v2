/**
 * Employer API Service
 * Handles all employer-specific API calls
 */

import httpClient, {
  getCached,
  getUserData,
  CACHE_TTL,
  COOKIE_TTL
} from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get employer profile (cached in cookies for session persistence)
export const getEmployerProfile = async () => {
  try {
    const response = await getUserData(API_ENDPOINTS.EMPLOYER.PROFILE, {
      cacheTTL: CACHE_TTL.LONG,
      useCookieCache: true
    });
    return response;
  } catch (error) {
    console.error('Get employer profile error:', error);
    throw error;
  }
};

// Update employer profile
export const updateEmployerProfile = async (profileData) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.EMPLOYER.PROFILE, profileData);
    
    // Update local user data if successful
    if (response.data.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Update employer profile error:', error);
    throw error;
  }
};

// Get posted jobs (cached for 5 minutes)
export const getPostedJobs = async (forceRefetch = false) => {
  try {
    const response = await getCached(API_ENDPOINTS.EMPLOYER.JOBS, {
      cacheTTL: CACHE_TTL.MEDIUM,
      forceRefetch
    });
    return response;
  } catch (error) {
    console.error('Get posted jobs error:', error);
    throw error;
  }
};

// Create new job posting
export const createJobPosting = async (jobData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.EMPLOYER.JOBS, jobData);
    return response.data;
  } catch (error) {
    console.error('Create job posting error:', error);
    throw error;
  }
};

// Update job posting
export const updateJobPosting = async (jobId, jobData) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.EMPLOYER.JOBS}/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Update job posting error:', error);
    throw error;
  }
};

// Delete job posting
export const deleteJobPosting = async (jobId) => {
  try {
    const response = await httpClient.delete(`${API_ENDPOINTS.EMPLOYER.JOBS}/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Delete job posting error:', error);
    throw error;
  }
};

// Get applications for a specific job
export const getApplicationsForJob = async (jobId, filters = {}) => {
  try {
    const response = await httpClient.get(
      API_ENDPOINTS.EMPLOYER.JOB_APPLICATIONS(jobId),
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Get applications for job error:', error);
    throw error;
  }
};

// Get all applications for employer
export const getAllApplications = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.EMPLOYER.APPLICATIONS, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all applications error:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (applicationId, status, notes = '') => {
  try {
    const response = await httpClient.put(
      API_ENDPOINTS.EMPLOYER.APPLICATION_BY_ID(applicationId),
      { status, notes }
    );
    return response.data;
  } catch (error) {
    console.error('Update application status error:', error);
    throw error;
  }
};

// Get saved candidates
export const getSavedCandidates = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.EMPLOYER.SAVED_CANDIDATES, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get saved candidates error:', error);
    // Return empty array on error to prevent crashes
    return { success: true, data: [] };
  }
};

// Save a candidate
export const saveCandidate = async (candidateId) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.EMPLOYER.SAVE_CANDIDATE(candidateId));
    return response.data;
  } catch (error) {
    console.error('Save candidate error:', error);
    throw error;
  }
};

// Unsave a candidate
export const unsaveCandidate = async (candidateId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.EMPLOYER.SAVE_CANDIDATE(candidateId));
    return response.data;
  } catch (error) {
    console.error('Unsave candidate error:', error);
    throw error;
  }
};

// Get employer dashboard data (Optimized with cookie caching)
export const getDashboardData = async () => {
  try {
    const response = await getUserData(`${API_ENDPOINTS.EMPLOYER.BASE}/dashboard`, {
      cacheTTL: CACHE_TTL.MEDIUM,
      useCookieCache: true
    });
    return response;
  } catch (error) {
    console.error('Get employer dashboard data error:', error);
    throw error;
  }
};

// Get employer statistics
export const getEmployerStats = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.EMPLOYER.BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get employer stats error:', error);
    throw error;
  }
};

// Search candidates
export const searchCandidates = async (searchParams) => {
  try {
    const {
      query = '',
      skills = [],
      experience = '',
      location = '',
      education = '',
      page = 1,
      limit = 10,
      sortBy = 'relevance',
      sortOrder = 'desc'
    } = searchParams;

    const params = {
      q: query,
      skills: Array.isArray(skills) ? skills.join(',') : skills,
      experience,
      location,
      education,
      page,
      limit,
      sortBy,
      sortOrder
    };

    // Remove empty parameters
    Object.keys(params).forEach(key => {
      if (!params[key] || params[key] === '') {
        delete params[key];
      }
    });

    const response = await httpClient.get(`${API_ENDPOINTS.EMPLOYER.BASE}/candidates`, { params });
    return response.data;
  } catch (error) {
    console.error('Search candidates error:', error);
    throw error;
  }
};

// Schedule interview
export const scheduleInterview = async (applicationId, interviewData) => {
  try {
    const response = await httpClient.post(
      `${API_ENDPOINTS.EMPLOYER.BASE}/interviews`,
      { applicationId, ...interviewData }
    );
    return response.data;
  } catch (error) {
    console.error('Schedule interview error:', error);
    throw error;
  }
};

// Get scheduled interviews
export const getScheduledInterviews = async (filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.EMPLOYER.BASE}/interviews`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Get scheduled interviews error:', error);
    throw error;
  }
};

// Update interview details
export const updateInterview = async (interviewId, interviewData) => {
  try {
    const response = await httpClient.put(
      `${API_ENDPOINTS.EMPLOYER.BASE}/interviews/${interviewId}`,
      interviewData
    );
    return response.data;
  } catch (error) {
    console.error('Update interview error:', error);
    throw error;
  }
};

// Cancel interview
export const cancelInterview = async (interviewId, reason = '') => {
  try {
    const response = await httpClient.delete(
      `${API_ENDPOINTS.EMPLOYER.BASE}/interviews/${interviewId}`,
      { data: { reason } }
    );
    return response.data;
  } catch (error) {
    console.error('Cancel interview error:', error);
    throw error;
  }
};

// Get company profile
export const getCompanyProfile = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.EMPLOYER.BASE}/company`);
    return response.data;
  } catch (error) {
    console.error('Get company profile error:', error);
    throw error;
  }
};

// Update company profile
export const updateCompanyProfile = async (companyData) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.EMPLOYER.BASE}/company`, companyData);
    return response.data;
  } catch (error) {
    console.error('Update company profile error:', error);
    throw error;
  }
};

// Employer API object for easier imports
const employerAPI = {
  getEmployerProfile,
  updateEmployerProfile,
  getPostedJobs,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getApplicationsForJob,
  getAllApplications,
  updateApplicationStatus,
  getSavedCandidates,
  saveCandidate,
  unsaveCandidate,
  getDashboardData,
  getEmployerStats,
  searchCandidates,
  scheduleInterview,
  getScheduledInterviews,
  updateInterview,
  cancelInterview,
  getCompanyProfile,
  updateCompanyProfile,
};

export default employerAPI;
