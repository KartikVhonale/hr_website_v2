/**
 * Admin API Service
 * Handles all admin-specific API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get all jobs (Admin view)
export const getAllJobs = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN.JOBS, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Admin get all jobs error:', error);
    throw error;
  }
};

// Get job by ID (Admin view)
export const getJobById = async (jobId) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN.JOB_BY_ID(jobId));
    return response.data;
  } catch (error) {
    console.error('Admin get job by ID error:', error);
    throw error;
  }
};

// Create job (Admin)
export const createJob = async (jobData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.ADMIN.JOBS, jobData);
    return response.data;
  } catch (error) {
    console.error('Admin create job error:', error);
    throw error;
  }
};

// Update job (Admin)
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.ADMIN.JOB_BY_ID(jobId), jobData);
    return response.data;
  } catch (error) {
    console.error('Admin update job error:', error);
    throw error;
  }
};

// Delete job (Admin)
export const deleteJob = async (jobId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.ADMIN.JOB_BY_ID(jobId));
    return response.data;
  } catch (error) {
    console.error('Admin delete job error:', error);
    throw error;
  }
};

// Get all users (Admin)
export const getAllUsers = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN.USERS, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Admin get all users error:', error);
    throw error;
  }
};

// Get user by ID (Admin)
export const getUserById = async (userId) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ADMIN.USER_BY_ID(userId));
    return response.data;
  } catch (error) {
    console.error('Admin get user by ID error:', error);
    throw error;
  }
};

// Update user (Admin)
export const updateUser = async (userId, userData) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.ADMIN.USER_BY_ID(userId), userData);
    return response.data;
  } catch (error) {
    console.error('Admin update user error:', error);
    throw error;
  }
};

// Delete user (Admin)
export const deleteUser = async (userId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(userId));
    return response.data;
  } catch (error) {
    console.error('Admin delete user error:', error);
    throw error;
  }
};

// Update user status (Admin)
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.ADMIN.USER_BY_ID(userId)}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Admin update user status error:', error);
    throw error;
  }
};

// Authorize employer (Admin)
export const authorizeEmployer = async (userId) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.ADMIN.USER_BY_ID(userId)}/authorize`);
    return response.data;
  } catch (error) {
    console.error('Admin authorize employer error:', error);
    throw error;
  }
};

// Get admin dashboard data
export const getDashboardData = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.BASE}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Admin get dashboard data error:', error);
    throw error;
  }
};

// Get system statistics
export const getSystemStats = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Admin get system stats error:', error);
    throw error;
  }
};

// Get all applications (Admin view)
export const getAllApplications = async (filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.BASE}/applications`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Admin get all applications error:', error);
    throw error;
  }
};

// Get all articles (Admin view)
export const getAllArticles = async (filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.BASE}/articles`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Admin get all articles error:', error);
    throw error;
  }
};

// Get all contacts (Admin view)
export const getAllContacts = async (filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.BASE}/contacts`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Admin get all contacts error:', error);
    throw error;
  }
};

// Update contact status (Admin)
export const updateContactStatus = async (contactId, status) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.ADMIN.BASE}/contacts/${contactId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Admin update contact status error:', error);
    throw error;
  }
};

// Delete contact (Admin)
export const deleteContact = async (contactId) => {
  try {
    const response = await httpClient.delete(`${API_ENDPOINTS.ADMIN.BASE}/contacts/${contactId}`);
    return response.data;
  } catch (error) {
    console.error('Admin delete contact error:', error);
    throw error;
  }
};

// Get system logs (Admin)
export const getSystemLogs = async (filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.BASE}/logs`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Admin get system logs error:', error);
    throw error;
  }
};

// Backup system data (Admin)
export const backupSystemData = async () => {
  try {
    const response = await httpClient.post(`${API_ENDPOINTS.ADMIN.BASE}/backup`);
    return response.data;
  } catch (error) {
    console.error('Admin backup system data error:', error);
    throw error;
  }
};

// Get system settings (Admin)
export const getSystemSettings = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ADMIN.BASE}/settings`);
    return response.data;
  } catch (error) {
    console.error('Admin get system settings error:', error);
    throw error;
  }
};

// Update system settings (Admin)
export const updateSystemSettings = async (settings) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.ADMIN.BASE}/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Admin update system settings error:', error);
    throw error;
  }
};

// Send system notification (Admin)
export const sendSystemNotification = async (notificationData) => {
  try {
    const response = await httpClient.post(`${API_ENDPOINTS.ADMIN.BASE}/notifications`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Admin send system notification error:', error);
    throw error;
  }
};

// Admin API object for easier imports
const adminAPI = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  authorizeEmployer,
  getDashboardData,
  getSystemStats,
  getAllApplications,
  getAllArticles,
  getAllContacts,
  updateContactStatus,
  deleteContact,
  getSystemLogs,
  backupSystemData,
  getSystemSettings,
  updateSystemSettings,
  sendSystemNotification,
};

export default adminAPI;
