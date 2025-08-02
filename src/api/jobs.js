/**
 * Jobs API Service
 * Handles all job-related API calls
 */

import httpClient, { getCached, CACHE_TTL } from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get all jobs with optional filters
export const getAllJobs = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.JOBS.BASE, { params: filters });
    return response;
  } catch (error) {
    console.error('Get all jobs error:', error);
    throw error;
  }
};

// Get job by ID
export const getJobById = async (jobId) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.JOBS.BY_ID(jobId));
    return response.data;
  } catch (error) {
    console.error('Get job by ID error:', error);
    throw error;
  }
};

// Create new job (Admin/Employer)
export const createJob = async (jobData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.JOBS.BASE, jobData);
    return response.data;
  } catch (error) {
    console.error('Create job error:', error);
    throw error;
  }
};

// Update job (Admin/Employer)
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.JOBS.BY_ID(jobId), jobData);
    return response.data;
  } catch (error) {
    console.error('Update job error:', error);
    throw error;
  }
};

// Delete job (Admin/Employer)
export const deleteJob = async (jobId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.JOBS.BY_ID(jobId));
    return response.data;
  } catch (error) {
    console.error('Delete job error:', error);
    throw error;
  }
};

// Get job applications
export const getJobApplications = async (jobId) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.JOBS.APPLICATIONS(jobId));
    return response.data;
  } catch (error) {
    console.error('Get job applications error:', error);
    throw error;
  }
};

// Apply for a job
export const applyForJob = async (jobId, applicationData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.JOBS.APPLICATIONS(jobId), applicationData);
    return response.data;
  } catch (error) {
    console.error('Apply for job error:', error);
    throw error;
  }
};

// Search jobs with advanced filters
export const searchJobs = async (searchParams) => {
  try {
    const {
      query = '',
      location = '',
      jobType = '',
      experienceLevel = '',
      salaryRange = '',
      skills = [],
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = searchParams;

    const params = {
      q: query,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      skills: Array.isArray(skills) ? skills.join(',') : skills,
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

    const response = await httpClient.get(API_ENDPOINTS.JOBS.BASE, { params });
    return response.data;
  } catch (error) {
    console.error('Search jobs error:', error);
    throw error;
  }
};

// Get featured jobs
export const getFeaturedJobs = async (limit = 6) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.JOBS.BASE, {
      params: { featured: true, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get featured jobs error:', error);
    throw error;
  }
};

// Get recent jobs
export const getRecentJobs = async (limit = 10) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.JOBS.BASE, {
      params: { sortBy: 'createdAt', sortOrder: 'desc', limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get recent jobs error:', error);
    throw error;
  }
};

// Get jobs by company
export const getJobsByCompany = async (companyId, filters = {}) => {
  try {
    const params = { company: companyId, ...filters };
    const response = await httpClient.get(API_ENDPOINTS.JOBS.BASE, { params });
    return response.data;
  } catch (error) {
    console.error('Get jobs by company error:', error);
    throw error;
  }
};

// Get job statistics
export const getJobStats = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.JOBS.BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get job stats error:', error);
    throw error;
  }
};

// Get job categories
export const getJobCategories = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.JOBS.BASE}/categories`);
    return response.data;
  } catch (error) {
    console.error('Get job categories error:', error);
    throw error;
  }
};

// Get job locations
export const getJobLocations = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.JOBS.BASE}/locations`);
    return response.data;
  } catch (error) {
    console.error('Get job locations error:', error);
    throw error;
  }
};

// Jobs API object for easier imports
const jobsAPI = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
  applyForJob,
  searchJobs,
  getFeaturedJobs,
  getRecentJobs,
  getJobsByCompany,
  getJobStats,
  getJobCategories,
  getJobLocations,
};

export default jobsAPI;
