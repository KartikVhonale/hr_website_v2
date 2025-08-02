/**
 * Notifications API Service
 * Handles user notifications and system alerts API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get user notifications
export const getUserNotifications = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get user notifications error:', error);
    throw error;
  }
};

// Get notification by ID
export const getNotificationById = async (notificationId) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.NOTIFICATIONS.BY_ID(notificationId));
    return response.data;
  } catch (error) {
    console.error('Get notification by ID error:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
    return response.data;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return response.data;
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(notificationId));
    return response.data;
  } catch (error) {
    console.error('Delete notification error:', error);
    throw error;
  }
};

// Delete all notifications
export const deleteAllNotifications = async () => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
    return response.data;
  } catch (error) {
    console.error('Delete all notifications error:', error);
    throw error;
  }
};

// Get unread notification count
export const getUnreadNotificationCount = async () => {
  try {
    const response = await httpClient.get('/api/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error('Get unread notification count error:', error);
    throw error;
  }
};

// Get notifications by type
export const getNotificationsByType = async (notificationType, filters = {}) => {
  try {
    const params = { type: notificationType, ...filters };
    const response = await httpClient.get('/api/notifications', { params });
    return response.data;
  } catch (error) {
    console.error('Get notifications by type error:', error);
    throw error;
  }
};

// Create notification (Admin/System)
export const createNotification = async (notificationData) => {
  try {
    const response = await httpClient.post('/api/notifications', notificationData);
    return response.data;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Send bulk notifications (Admin)
export const sendBulkNotifications = async (notificationData) => {
  try {
    const response = await httpClient.post('/api/notifications/bulk-send', notificationData);
    return response.data;
  } catch (error) {
    console.error('Send bulk notifications error:', error);
    throw error;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await httpClient.put('/api/notifications/preferences', preferences);
    return response.data;
  } catch (error) {
    console.error('Update notification preferences error:', error);
    throw error;
  }
};

// Get notification preferences
export const getNotificationPreferences = async () => {
  try {
    const response = await httpClient.get('/api/notifications/preferences');
    return response.data;
  } catch (error) {
    console.error('Get notification preferences error:', error);
    throw error;
  }
};

// Search notifications
export const searchNotifications = async (searchParams) => {
  try {
    const {
      query = '',
      type = '',
      status = '',
      startDate = '',
      endDate = '',
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = searchParams;

    const params = {
      q: query,
      type,
      status,
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

    const response = await httpClient.get('/api/notifications/search', { params });
    return response.data;
  } catch (error) {
    console.error('Search notifications error:', error);
    throw error;
  }
};

// Get notification statistics
export const getNotificationStats = async () => {
  try {
    const response = await httpClient.get('/api/notifications/stats');
    return response.data;
  } catch (error) {
    console.error('Get notification stats error:', error);
    throw error;
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (subscription) => {
  try {
    const response = await httpClient.post('/api/notifications/push-subscribe', subscription);
    return response.data;
  } catch (error) {
    console.error('Subscribe to push notifications error:', error);
    throw error;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async () => {
  try {
    const response = await httpClient.delete('/api/notifications/push-unsubscribe');
    return response.data;
  } catch (error) {
    console.error('Unsubscribe from push notifications error:', error);
    throw error;
  }
};

// Test notification (Admin)
export const testNotification = async (testData) => {
  try {
    const response = await httpClient.post('/api/notifications/test', testData);
    return response.data;
  } catch (error) {
    console.error('Test notification error:', error);
    throw error;
  }
};

// Get notification templates (Admin)
export const getNotificationTemplates = async () => {
  try {
    const response = await httpClient.get('/api/notifications/templates');
    return response.data;
  } catch (error) {
    console.error('Get notification templates error:', error);
    throw error;
  }
};

// Bulk mark notifications as read
export const bulkMarkNotificationsAsRead = async (notificationIds) => {
  try {
    const response = await httpClient.put('/api/notifications/bulk-mark-read', {
      notificationIds
    });
    return response.data;
  } catch (error) {
    console.error('Bulk mark notifications as read error:', error);
    throw error;
  }
};

// Bulk delete notifications
export const bulkDeleteNotifications = async (notificationIds) => {
  try {
    const response = await httpClient.delete('/api/notifications/bulk-delete', {
      data: { notificationIds }
    });
    return response.data;
  } catch (error) {
    console.error('Bulk delete notifications error:', error);
    throw error;
  }
};

// Notifications API object for easier imports
const notificationsAPI = {
  getUserNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadNotificationCount,
  getNotificationsByType,
  createNotification,
  sendBulkNotifications,
  updateNotificationPreferences,
  getNotificationPreferences,
  searchNotifications,
  getNotificationStats,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  testNotification,
  getNotificationTemplates,
  bulkMarkNotificationsAsRead,
  bulkDeleteNotifications,
};

export default notificationsAPI;
