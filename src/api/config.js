/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

// Base API URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    BASE: '/api/auth',
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    USERS: '/api/auth/users',
  },

  // Job endpoints
  JOBS: {
    BASE: '/api/jobs',
    BY_ID: (id) => `/api/jobs/${id}`,
    APPLICATIONS: (jobId) => `/api/jobs/${jobId}/applications`,
  },

  // Application endpoints
  APPLICATIONS: {
    BASE: '/api/applications',
    BY_ID: (id) => `/api/applications/${id}`,
    UPDATE_STATUS: (id) => `/api/applications/${id}`,
  },

  // Article endpoints
  ARTICLES: {
    BASE: '/api/articles',
    BY_ID: (id) => `/api/articles/${id}`,
    LIKE: (id) => `/api/articles/${id}/like`,
  },

  // Contact endpoints
  CONTACT: {
    BASE: '/api/contact',
  },

  // Admin endpoints
  ADMIN: {
    BASE: '/api/admin',
    JOBS: '/api/admin/jobs',
    JOB_BY_ID: (id) => `/api/admin/jobs/${id}`,
    USERS: '/api/admin/users',
    USER_BY_ID: (id) => `/api/admin/users/${id}`,
  },

  // Employer endpoints
  EMPLOYER: {
    BASE: '/api/employer',
    PROFILE: '/api/employer/profile',
    JOBS: '/api/employer/jobs',
    JOB_APPLICATIONS: (jobId) => `/api/employer/jobs/${jobId}/applications`,
    APPLICATIONS: '/api/employer/applications',
    APPLICATION_BY_ID: (id) => `/api/employer/applications/${id}`,
    SAVED_CANDIDATES: '/api/employer/saved-candidates',
    SAVE_CANDIDATE: (id) => `/api/employer/saved-candidates/${id}`,
  },

  // Jobseeker endpoints
  JOBSEEKER: {
    BASE: '/api/jobseeker',
    PROFILE: '/api/jobseeker/profile',
    SAVED_JOBS: '/api/jobseeker/saved-jobs',
    SAVE_JOB: (id) => `/api/jobseeker/saved-jobs/${id}`,
    APPLIED_JOBS: '/api/jobseeker/applied-jobs',
    UPLOAD_RESUME: '/api/jobseeker/upload-resume',
    RESUME: '/api/jobseeker/resume',
  },

  // User endpoints
  USERS: {
    BASE: '/api/users',
    SAVED_CANDIDATES: '/api/users/saved-candidates',
    SAVE_CANDIDATE: (id) => `/api/users/save-candidate/${id}`,
    UPDATE_CANDIDATE_STATUS: (id) => `/api/users/update-candidate-status/${id}`,
    UPDATE_CANDIDATE_NOTES: (id) => `/api/users/update-candidate-notes/${id}`,
  },

  // Team endpoints
  TEAM: {
    BASE: '/api/team',
    BY_ID: (id) => `/api/team/${id}`,
    SEARCH: '/api/team/search',
    STATS: '/api/team/stats',
    DEPARTMENTS: '/api/team/departments',
    ROLES: '/api/team/roles',
    EXPORT: '/api/team/export',
  },

  // Activity endpoints
  ACTIVITY: {
    BASE: '/api/activity',
    USER: '/api/activity/user',
    STATS: '/api/activity/stats',
    TIMELINE: '/api/activity/timeline',
    TYPES: '/api/activity/types',
    SEARCH: '/api/activity/search',
    DASHBOARD_SUMMARY: '/api/activity/dashboard-summary',
    ENTITY: '/api/activity/entity',
    EXPORT: '/api/activity/export',
    METRICS: '/api/activity/metrics',
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    BY_ID: (id) => `/api/notifications/${id}`,
    MARK_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/mark-all-read',
    DELETE_ALL: '/api/notifications/delete-all',
    UNREAD_COUNT: '/api/notifications/unread-count',
    BULK_SEND: '/api/notifications/bulk-send',
    PREFERENCES: '/api/notifications/preferences',
    SEARCH: '/api/notifications/search',
    STATS: '/api/notifications/stats',
    PUSH_SUBSCRIBE: '/api/notifications/push-subscribe',
    PUSH_UNSUBSCRIBE: '/api/notifications/push-unsubscribe',
    TEST: '/api/notifications/test',
    TEMPLATES: '/api/notifications/templates',
    BULK_MARK_READ: '/api/notifications/bulk-mark-read',
    BULK_DELETE: '/api/notifications/bulk-delete',
  },
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Auth header helper
export const getAuthHeaders = (token) => ({
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${token}`,
});

// Multipart form data headers (for file uploads)
export const getMultipartHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  // Don't set Content-Type for multipart, let browser set it with boundary
});
