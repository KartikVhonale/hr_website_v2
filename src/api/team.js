/**
 * Team API Service
 * Handles team member management API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get all team members
export const getAllTeamMembers = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.TEAM.BASE, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all team members error:', error);
    throw error;
  }
};

// Get team member by ID
export const getTeamMemberById = async (memberId) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.TEAM.BASE}/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Get team member by ID error:', error);
    throw error;
  }
};

// Create new team member (Admin only)
export const createTeamMember = async (memberData) => {
  try {
    // Handle file upload for member photo
    const formData = new FormData();
    
    // Add text fields
    Object.keys(memberData).forEach(key => {
      if (key !== 'photo' && memberData[key] !== undefined) {
        formData.append(key, memberData[key]);
      }
    });
    
    // Add photo file if present
    if (memberData.photo) {
      formData.append('photo', memberData.photo);
    }

    const response = await httpClient.post(API_ENDPOINTS.TEAM.BASE, formData);
    return response.data;
  } catch (error) {
    console.error('Create team member error:', error);
    throw error;
  }
};

// Update team member (Admin only)
export const updateTeamMember = async (memberId, memberData) => {
  try {
    // Handle file upload for member photo
    const formData = new FormData();
    
    // Add text fields
    Object.keys(memberData).forEach(key => {
      if (key !== 'photo' && memberData[key] !== undefined) {
        formData.append(key, memberData[key]);
      }
    });
    
    // Add photo file if present
    if (memberData.photo) {
      formData.append('photo', memberData.photo);
    }

    const response = await httpClient.put(`${API_ENDPOINTS.TEAM.BASE}/${memberId}`, formData);
    return response.data;
  } catch (error) {
    console.error('Update team member error:', error);
    throw error;
  }
};

// Delete team member (Admin only)
export const deleteTeamMember = async (memberId) => {
  try {
    const response = await httpClient.delete(`${API_ENDPOINTS.TEAM.BASE}/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Delete team member error:', error);
    throw error;
  }
};

// Get team members by department
export const getTeamMembersByDepartment = async (department) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.TEAM.BASE, {
      params: { department }
    });
    return response.data;
  } catch (error) {
    console.error('Get team members by department error:', error);
    throw error;
  }
};

// Get team members by role
export const getTeamMembersByRole = async (role) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.TEAM.BASE, {
      params: { role }
    });
    return response.data;
  } catch (error) {
    console.error('Get team members by role error:', error);
    throw error;
  }
};

// Search team members
export const searchTeamMembers = async (searchParams) => {
  try {
    const {
      query = '',
      department = '',
      role = '',
      status = 'active',
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = searchParams;

    const params = {
      q: query,
      department,
      role,
      status,
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

    const response = await httpClient.get(`${API_ENDPOINTS.TEAM.BASE}/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Search team members error:', error);
    throw error;
  }
};

// Get team statistics
export const getTeamStats = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.TEAM.BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get team stats error:', error);
    throw error;
  }
};

// Get team departments
export const getTeamDepartments = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.TEAM.BASE}/departments`);
    return response.data;
  } catch (error) {
    console.error('Get team departments error:', error);
    throw error;
  }
};

// Get team roles
export const getTeamRoles = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.TEAM.BASE}/roles`);
    return response.data;
  } catch (error) {
    console.error('Get team roles error:', error);
    throw error;
  }
};

// Update team member status
export const updateTeamMemberStatus = async (memberId, status) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.TEAM.BASE}/${memberId}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    console.error('Update team member status error:', error);
    throw error;
  }
};

// Bulk update team members
export const bulkUpdateTeamMembers = async (memberIds, updateData) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.TEAM.BASE}/bulk-update`, {
      memberIds,
      ...updateData
    });
    return response.data;
  } catch (error) {
    console.error('Bulk update team members error:', error);
    throw error;
  }
};

// Export team data
export const exportTeamData = async (format = 'csv', filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.TEAM.BASE}/export`, {
      params: { format, ...filters },
      responseType: 'blob' // For file download
    });
    return response.data;
  } catch (error) {
    console.error('Export team data error:', error);
    throw error;
  }
};

// Team API object for easier imports
const teamAPI = {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMembersByDepartment,
  getTeamMembersByRole,
  searchTeamMembers,
  getTeamStats,
  getTeamDepartments,
  getTeamRoles,
  updateTeamMemberStatus,
  bulkUpdateTeamMembers,
  exportTeamData,
};

export default teamAPI;
