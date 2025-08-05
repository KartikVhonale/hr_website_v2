/**
 * Applications API Service
 * Handles all job application-related API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get all applications (Admin view)
export const getAllApplications = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.APPLICATIONS.BASE, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all applications error:', error);
    throw error;
  }
};

// Get application by ID
export const getApplicationById = async (applicationId) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.APPLICATIONS.BY_ID(applicationId));
    return response.data;
  } catch (error) {
    console.error('Get application by ID error:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (applicationId, status, notes = '') => {
  try {
    const response = await httpClient.put(
      API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId),
      { status, notes }
    );
    return response.data;
  } catch (error) {
    console.error('Update application status error:', error);
    throw error;
  }
};

// Delete application
export const deleteApplication = async (applicationId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.APPLICATIONS.BY_ID(applicationId));
    return response.data;
  } catch (error) {
    console.error('Delete application error:', error);
    throw error;
  }
};

// Get applications for a specific job (Employer view)
export const getApplicationsForJob = async (jobId, filters = {}) => {
  try {
    const response = await httpClient.get(
      API_ENDPOINTS.JOBS.APPLICATIONS(jobId),
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Get applications for job error:', error);
    throw error;
  }
};

// Get user's applications (Jobseeker view)
export const getUserApplications = async (filters = {}) => {
  try {
    const response = await httpClient.get(
      API_ENDPOINTS.JOBSEEKER.APPLIED_JOBS,
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Get user applications error:', error);
    throw error;
  }
};

// Submit job application
export const submitApplication = async (jobId, applicationData) => {
  try {
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add text fields
    Object.keys(applicationData).forEach(key => {
      if (key !== 'resume' && key !== 'coverLetter' && applicationData[key] !== undefined) {
        formData.append(key, applicationData[key]);
      }
    });
    
    // Add files if present
    if (applicationData.resume) {
      formData.append('resume', applicationData.resume);
    }
    
    // Add cover letter as a text field
    if (applicationData.coverLetter) {
      formData.append('coverLetter', applicationData.coverLetter);
    }

    const response = await httpClient.post(
      API_ENDPOINTS.JOBS.APPLICATIONS(jobId),
      formData
    );
    return response.data;
  } catch (error) {
    console.error('Submit application error:', error);
    throw error;
  }
};

// Withdraw application
export const withdrawApplication = async (applicationId) => {
  try {
    const response = await httpClient.put(
      API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId),
      { status: 'withdrawn' }
    );
    return response.data;
  } catch (error) {
    console.error('Withdraw application error:', error);
    throw error;
  }
};

// Get application statistics
export const getApplicationStats = async (filters = {}) => {
  try {
    const response = await httpClient.get(
      `${API_ENDPOINTS.APPLICATIONS.BASE}/stats`,
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Get application stats error:', error);
    throw error;
  }
};

// Get application status history
export const getApplicationHistory = async (applicationId) => {
  try {
    const response = await httpClient.get(
      `${API_ENDPOINTS.APPLICATIONS.BY_ID(applicationId)}/history`
    );
    return response.data;
  } catch (error) {
    console.error('Get application history error:', error);
    throw error;
  }
};

// Bulk update application statuses
export const bulkUpdateApplications = async (applicationIds, status, notes = '') => {
  try {
    const response = await httpClient.put(
      `${API_ENDPOINTS.APPLICATIONS.BASE}/bulk-update`,
      { applicationIds, status, notes }
    );
    return response.data;
  } catch (error) {
    console.error('Bulk update applications error:', error);
    throw error;
  }
};

// Schedule interview for application
export const scheduleInterview = async (applicationId, interviewData) => {
  try {
    const response = await httpClient.post(
      `${API_ENDPOINTS.APPLICATIONS.BY_ID(applicationId)}/interview`,
      interviewData
    );
    return response.data;
  } catch (error) {
    console.error('Schedule interview error:', error);
    throw error;
  }
};

// Add notes to application
export const addApplicationNotes = async (applicationId, notes) => {
  try {
    const response = await httpClient.post(
      `${API_ENDPOINTS.APPLICATIONS.BY_ID(applicationId)}/notes`,
      { notes }
    );
    return response.data;
  } catch (error) {
    console.error('Add application notes error:', error);
    throw error;
  }
};

// Rate/Score application
export const rateApplication = async (applicationId, rating, feedback = '') => {
  try {
    const response = await httpClient.put(
      `${API_ENDPOINTS.APPLICATIONS.BY_ID(applicationId)}/rating`,
      { rating, feedback }
    );
    return response.data;
  } catch (error) {
    console.error('Rate application error:', error);
    throw error;
  }
};

// Applications API object for easier imports
const applicationsAPI = {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationsForJob,
  getUserApplications,
  submitApplication,
  withdrawApplication,
  getApplicationStats,
  getApplicationHistory,
  bulkUpdateApplications,
  scheduleInterview,
  addApplicationNotes,
  rateApplication,
};

export default applicationsAPI;
