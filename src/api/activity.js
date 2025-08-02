/**
 * Activity API Service
 * Handles system activity and audit log API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get recent activity (Admin only)
export const getRecentActivity = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ACTIVITY.BASE, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get recent activity error:', error);
    throw error;
  }
};

// Get activity by type
export const getActivityByType = async (activityType, filters = {}) => {
  try {
    const params = { type: activityType, ...filters };
    const response = await httpClient.get(API_ENDPOINTS.ACTIVITY.BASE, { params });
    return response.data;
  } catch (error) {
    console.error('Get activity by type error:', error);
    throw error;
  }
};

// Get user activity
export const getUserActivity = async (userId, filters = {}) => {
  try {
    const params = { userId, ...filters };
    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/user`, { params });
    return response.data;
  } catch (error) {
    console.error('Get user activity error:', error);
    throw error;
  }
};

// Get system activity statistics
export const getActivityStats = async (timeRange = '7d') => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/stats`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Get activity stats error:', error);
    throw error;
  }
};

// Get activity timeline
export const getActivityTimeline = async (filters = {}) => {
  try {
    const {
      startDate,
      endDate,
      activityTypes = [],
      userIds = [],
      page = 1,
      limit = 50,
      sortOrder = 'desc'
    } = filters;

    const params = {
      startDate,
      endDate,
      activityTypes: Array.isArray(activityTypes) ? activityTypes.join(',') : activityTypes,
      userIds: Array.isArray(userIds) ? userIds.join(',') : userIds,
      page,
      limit,
      sortOrder
    };

    // Remove empty parameters
    Object.keys(params).forEach(key => {
      if (!params[key] || params[key] === '') {
        delete params[key];
      }
    });

    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/timeline`, { params });
    return response.data;
  } catch (error) {
    console.error('Get activity timeline error:', error);
    throw error;
  }
};

// Log custom activity
export const logActivity = async (activityData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.ACTIVITY.BASE, activityData);
    return response.data;
  } catch (error) {
    console.error('Log activity error:', error);
    throw error;
  }
};

// Get activity types
export const getActivityTypes = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/types`);
    return response.data;
  } catch (error) {
    console.error('Get activity types error:', error);
    throw error;
  }
};

// Search activities
export const searchActivities = async (searchParams) => {
  try {
    const {
      query = '',
      activityType = '',
      userId = '',
      startDate = '',
      endDate = '',
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = searchParams;

    const params = {
      q: query,
      activityType,
      userId,
      startDate,
      endDate,
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

    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Search activities error:', error);
    throw error;
  }
};

// Get dashboard activity summary
export const getDashboardActivitySummary = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/dashboard-summary`);
    return response.data;
  } catch (error) {
    console.error('Get dashboard activity summary error:', error);
    throw error;
  }
};

// Get activity by entity (job, application, etc.)
export const getActivityByEntity = async (entityType, entityId, filters = {}) => {
  try {
    const params = { entityType, entityId, ...filters };
    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/entity`, { params });
    return response.data;
  } catch (error) {
    console.error('Get activity by entity error:', error);
    throw error;
  }
};

// Mark activities as read
export const markActivitiesAsRead = async (activityIds) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.ACTIVITY.BASE}/mark-read`, {
      activityIds
    });
    return response.data;
  } catch (error) {
    console.error('Mark activities as read error:', error);
    throw error;
  }
};

// Delete activities (Admin only)
export const deleteActivities = async (activityIds) => {
  try {
    const response = await httpClient.delete(`${API_ENDPOINTS.ACTIVITY.BASE}/bulk-delete`, {
      data: { activityIds }
    });
    return response.data;
  } catch (error) {
    console.error('Delete activities error:', error);
    throw error;
  }
};

// Export activity data
export const exportActivityData = async (format = 'csv', filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/export`, {
      params: { format, ...filters },
      responseType: 'blob' // For file download
    });
    return response.data;
  } catch (error) {
    console.error('Export activity data error:', error);
    throw error;
  }
};

// Get activity metrics for charts
export const getActivityMetrics = async (timeRange = '30d', groupBy = 'day') => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ACTIVITY.BASE}/metrics`, {
      params: { timeRange, groupBy }
    });
    return response.data;
  } catch (error) {
    console.error('Get activity metrics error:', error);
    throw error;
  }
};

// Activity API object for easier imports
const activityAPI = {
  getRecentActivity,
  getActivityByType,
  getUserActivity,
  getActivityStats,
  getActivityTimeline,
  logActivity,
  getActivityTypes,
  searchActivities,
  getDashboardActivitySummary,
  getActivityByEntity,
  markActivitiesAsRead,
  deleteActivities,
  exportActivityData,
  getActivityMetrics,
};

export default activityAPI;
