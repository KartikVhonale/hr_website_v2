/**
 * Users API Service
 * Handles user management and candidate-related API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get saved candidates
export const getSavedCandidates = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.USERS.SAVED_CANDIDATES, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get saved candidates error:', error);
    // Return empty array on error to prevent crashes
    return {
      success: true,
      data: []
    };
  }
};

// Save a candidate
export const saveCandidate = async (candidateId) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.USERS.SAVE_CANDIDATE(candidateId));
    return response.data;
  } catch (error) {
    console.error('Save candidate error:', error);
    throw error;
  }
};

// Remove saved candidate
export const removeSavedCandidate = async (candidateId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.USERS.SAVE_CANDIDATE(candidateId));
    return response.data;
  } catch (error) {
    console.error('Remove saved candidate error:', error);
    throw error;
  }
};

// Update candidate status
export const updateCandidateStatus = async (candidateId, status) => {
  try {
    const response = await httpClient.put(
      API_ENDPOINTS.USERS.UPDATE_CANDIDATE_STATUS(candidateId),
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Update candidate status error:', error);
    throw error;
  }
};

// Update candidate notes
export const updateCandidateNotes = async (candidateId, notes) => {
  try {
    const response = await httpClient.put(
      API_ENDPOINTS.USERS.UPDATE_CANDIDATE_NOTES(candidateId),
      { notes }
    );
    return response.data;
  } catch (error) {
    console.error('Update candidate notes error:', error);
    throw error;
  }
};

// Get all users (Admin only)
export const getAllUsers = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.USERS.BASE, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.USERS.BASE}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.USERS.BASE}/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await httpClient.delete(`${API_ENDPOINTS.USERS.BASE}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Search users/candidates
export const searchUsers = async (searchParams) => {
  try {
    const {
      query = '',
      role = '',
      status = '',
      skills = [],
      location = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = searchParams;

    const params = {
      q: query,
      role,
      status,
      skills: Array.isArray(skills) ? skills.join(',') : skills,
      location,
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

    const response = await httpClient.get(`${API_ENDPOINTS.USERS.BASE}/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.USERS.BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error;
  }
};

// Bulk update users
export const bulkUpdateUsers = async (userIds, updateData) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.USERS.BASE}/bulk-update`, {
      userIds,
      ...updateData
    });
    return response.data;
  } catch (error) {
    console.error('Bulk update users error:', error);
    throw error;
  }
};

// Export users data
export const exportUsers = async (format = 'csv', filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.USERS.BASE}/export`, {
      params: { format, ...filters },
      responseType: 'blob' // For file download
    });
    return response.data;
  } catch (error) {
    console.error('Export users error:', error);
    throw error;
  }
};

// Users API object for easier imports
const usersAPI = {
  getSavedCandidates,
  saveCandidate,
  removeSavedCandidate,
  updateCandidateStatus,
  updateCandidateNotes,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  getUserStats,
  bulkUpdateUsers,
  exportUsers,
};

export default usersAPI;
