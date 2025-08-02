/**
 * API Index - Central export for all API services
 * This file provides a single entry point for all API functionality
 */

// Import all API services
import authAPI from './auth.js';
import jobsAPI from './jobs.js';
import applicationsAPI from './applications.js';
import articlesAPI from './articles.js';
import jobseekerAPI from './jobseeker.js';
import employerAPI from './employer.js';
import adminAPI from './admin.js';
import contactAPI from './contact.js';
import usersAPI from './users.js';
import teamAPI from './team.js';
import activityAPI from './activity.js';
import notificationsAPI from './notifications.js';

// Import HTTP client and configuration
import httpClient from './httpClient.js';
import { API_ENDPOINTS, API_BASE_URL } from './config.js';

// Export individual API services
export {
  authAPI,
  jobsAPI,
  applicationsAPI,
  articlesAPI,
  jobseekerAPI,
  employerAPI,
  adminAPI,
  contactAPI,
  usersAPI,
  teamAPI,
  activityAPI,
  notificationsAPI,
};

// Export HTTP client and config
export {
  httpClient,
  API_ENDPOINTS,
  API_BASE_URL,
};

// Export individual functions for backward compatibility
export {
  // Auth functions
  login,
  signup,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  resetPassword,
  isAuthenticated,
  getCurrentUser,
} from './auth.js';

export {
  // Jobs functions
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs,
  getFeaturedJobs,
  getRecentJobs,
} from './jobs.js';

export {
  // Applications functions
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  submitApplication,
  withdrawApplication,
} from './applications.js';

export {
  // Articles functions
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleLike,
  getFeaturedArticles,
  getRecentArticles,
} from './articles.js';

export {
  // Jobseeker functions
  getJobseekerProfile,
  updateJobseekerProfile,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getAppliedJobs,
  uploadResume,
  deleteResume,
} from './jobseeker.js';

export {
  // Employer functions
  getEmployerProfile,
  updateEmployerProfile,
  getPostedJobs,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getApplicationsForJob,
  getSavedCandidates as getEmployerSavedCandidates,
  saveCandidate as employerSaveCandidate,
  unsaveCandidate as employerUnsaveCandidate,
} from './employer.js';

export {
  // Contact functions
  submitContactForm,
} from './contact.js';

export {
  // Users functions
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
} from './users.js';

export {
  // Team functions
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  searchTeamMembers,
} from './team.js';

export {
  // Activity functions
  getRecentActivity,
  getActivityByType,
  getUserActivity,
  getActivityStats,
  logActivity,
} from './activity.js';

export {
  // Notifications functions
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  updateNotificationPreferences,
} from './notifications.js';

// Default export - Main API object with all services
const API = {
  // Authentication
  auth: authAPI,
  
  // Jobs
  jobs: jobsAPI,
  
  // Applications
  applications: applicationsAPI,
  
  // Articles
  articles: articlesAPI,
  
  // Jobseeker
  jobseeker: jobseekerAPI,
  
  // Employer
  employer: employerAPI,
  
  // Admin
  admin: adminAPI,
  
  // Contact
  contact: contactAPI,

  // Users
  users: usersAPI,

  // Team
  team: teamAPI,

  // Activity
  activity: activityAPI,

  // Notifications
  notifications: notificationsAPI,

  // HTTP Client
  client: httpClient,
  
  // Configuration
  config: {
    baseURL: API_BASE_URL,
    endpoints: API_ENDPOINTS,
  },
  
  // Utility functions
  utils: {
    setAuthToken: httpClient.setAuthToken,
    getAuthToken: httpClient.getAuthToken,
    isAuthenticated: authAPI.isAuthenticated,
    getCurrentUser: authAPI.getCurrentUser,
  },
};

export default API;
