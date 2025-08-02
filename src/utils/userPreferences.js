/**
 * User Preferences Management using Cookie Storage
 * Handles dashboard settings, filters, and user-specific configurations
 */

import cookieCache from './cookieCache.js';

class UserPreferences {
  constructor() {
    this.prefix = 'user_pref_';
  }

  // Dashboard preferences
  setDashboardLayout(layout) {
    return cookieCache.setUserPreference('dashboard_layout', layout);
  }

  getDashboardLayout() {
    return cookieCache.getUserPreference('dashboard_layout') || 'grid';
  }

  setActiveSection(section) {
    return cookieCache.setSessionData('active_section', section);
  }

  getActiveSection() {
    return cookieCache.getSessionData('active_section') || 'overview';
  }

  // Job search preferences
  setJobSearchFilters(filters) {
    return cookieCache.setUserPreference('job_search_filters', filters);
  }

  getJobSearchFilters() {
    return cookieCache.getUserPreference('job_search_filters') || {
      location: '',
      jobType: '',
      experienceLevel: '',
      skills: []
    };
  }

  setJobSearchSort(sortBy, sortOrder = 'desc') {
    return cookieCache.setUserPreference('job_search_sort', { sortBy, sortOrder });
  }

  getJobSearchSort() {
    return cookieCache.getUserPreference('job_search_sort') || { sortBy: 'createdAt', sortOrder: 'desc' };
  }

  // Application management preferences
  setApplicationFilters(filters) {
    return cookieCache.setUserPreference('application_filters', filters);
  }

  getApplicationFilters() {
    return cookieCache.getUserPreference('application_filters') || {
      status: 'all',
      dateRange: 'all'
    };
  }

  // Theme and display preferences
  setTheme(theme) {
    return cookieCache.setUserPreference('theme', theme);
  }

  getTheme() {
    return cookieCache.getUserPreference('theme') || 'light';
  }

  setLanguage(language) {
    return cookieCache.setUserPreference('language', language);
  }

  getLanguage() {
    return cookieCache.getUserPreference('language') || 'en';
  }

  // Notification preferences
  setNotificationSettings(settings) {
    return cookieCache.setUserPreference('notifications', settings);
  }

  getNotificationSettings() {
    return cookieCache.getUserPreference('notifications') || {
      email: true,
      browser: true,
      jobAlerts: true,
      applicationUpdates: true
    };
  }

  // Recently viewed items
  addRecentlyViewed(type, item) {
    const key = `recent_${type}`;
    const recent = cookieCache.getSessionData(key) || [];
    
    // Remove if already exists
    const filtered = recent.filter(r => r.id !== item.id);
    
    // Add to beginning
    filtered.unshift({
      ...item,
      viewedAt: Date.now()
    });
    
    // Keep only last 10 items
    const limited = filtered.slice(0, 10);
    
    return cookieCache.setSessionData(key, limited);
  }

  getRecentlyViewed(type) {
    return cookieCache.getSessionData(`recent_${type}`) || [];
  }

  // Search history
  addSearchHistory(query, type = 'jobs') {
    const key = `search_history_${type}`;
    const history = cookieCache.getUserPreference(key) || [];
    
    // Remove if already exists
    const filtered = history.filter(h => h.query !== query);
    
    // Add to beginning
    filtered.unshift({
      query,
      searchedAt: Date.now()
    });
    
    // Keep only last 20 searches
    const limited = filtered.slice(0, 20);
    
    return cookieCache.setUserPreference(key, limited);
  }

  getSearchHistory(type = 'jobs') {
    return cookieCache.getUserPreference(`search_history_${type}`) || [];
  }

  clearSearchHistory(type = 'jobs') {
    return cookieCache.delete(`pref_search_history_${type}`);
  }

  // Form auto-save
  saveFormData(formId, data) {
    return cookieCache.setSessionData(`form_${formId}`, data);
  }

  getFormData(formId) {
    return cookieCache.getSessionData(`form_${formId}`);
  }

  clearFormData(formId) {
    return cookieCache.delete(`session_form_${formId}`);
  }

  // Table/List view preferences
  setTableColumns(tableId, columns) {
    return cookieCache.setUserPreference(`table_columns_${tableId}`, columns);
  }

  getTableColumns(tableId) {
    return cookieCache.getUserPreference(`table_columns_${tableId}`);
  }

  setTablePageSize(tableId, pageSize) {
    return cookieCache.setUserPreference(`table_pagesize_${tableId}`, pageSize);
  }

  getTablePageSize(tableId) {
    return cookieCache.getUserPreference(`table_pagesize_${tableId}`) || 10;
  }

  // Quick actions/shortcuts
  setQuickActions(actions) {
    return cookieCache.setUserPreference('quick_actions', actions);
  }

  getQuickActions() {
    return cookieCache.getUserPreference('quick_actions') || [];
  }

  // Onboarding and tour progress
  setOnboardingStep(step) {
    return cookieCache.setUserPreference('onboarding_step', step);
  }

  getOnboardingStep() {
    return cookieCache.getUserPreference('onboarding_step') || 0;
  }

  markOnboardingComplete() {
    return cookieCache.setUserPreference('onboarding_complete', true);
  }

  isOnboardingComplete() {
    return cookieCache.getUserPreference('onboarding_complete') || false;
  }

  // Feature flags and A/B testing
  setFeatureFlag(flag, value) {
    return cookieCache.setUserPreference(`feature_${flag}`, value);
  }

  getFeatureFlag(flag) {
    return cookieCache.getUserPreference(`feature_${flag}`);
  }

  // Analytics and usage tracking
  incrementUsageCount(feature) {
    const key = `usage_${feature}`;
    const current = cookieCache.getUserPreference(key) || 0;
    return cookieCache.setUserPreference(key, current + 1);
  }

  getUsageCount(feature) {
    return cookieCache.getUserPreference(`usage_${feature}`) || 0;
  }

  // Jobseeker-specific preferences
  setJobAlerts(alerts) {
    return cookieCache.setUserPreference('job_alerts', alerts);
  }

  getJobAlerts() {
    return cookieCache.getUserPreference('job_alerts') || {
      enabled: true,
      frequency: 'daily',
      keywords: [],
      locations: [],
      jobTypes: []
    };
  }

  setApplicationFilters(filters) {
    return cookieCache.setUserPreference('application_filters', filters);
  }

  getApplicationFilters() {
    return cookieCache.getUserPreference('application_filters') || {
      status: 'all',
      dateRange: 'all',
      company: ''
    };
  }

  setSavedJobsSort(sortBy, sortOrder = 'desc') {
    return cookieCache.setUserPreference('saved_jobs_sort', { sortBy, sortOrder });
  }

  getSavedJobsSort() {
    return cookieCache.getUserPreference('saved_jobs_sort') || { sortBy: 'savedAt', sortOrder: 'desc' };
  }

  // Interview preferences
  setInterviewPreferences(preferences) {
    return cookieCache.setUserPreference('interview_preferences', preferences);
  }

  getInterviewPreferences() {
    return cookieCache.getUserPreference('interview_preferences') || {
      preferredTimeSlots: [],
      availableDays: [],
      timezone: 'UTC',
      reminderSettings: {
        email: true,
        sms: false,
        browser: true
      }
    };
  }

  // Resume preferences
  setResumePreferences(preferences) {
    return cookieCache.setUserPreference('resume_preferences', preferences);
  }

  getResumePreferences() {
    return cookieCache.getUserPreference('resume_preferences') || {
      visibility: 'public',
      autoApply: false,
      template: 'modern',
      sections: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        certifications: true
      }
    };
  }

  // Career insights preferences
  setCareerInsightsPreferences(preferences) {
    return cookieCache.setUserPreference('career_insights', preferences);
  }

  getCareerInsightsPreferences() {
    return cookieCache.getUserPreference('career_insights') || {
      trackSalaryTrends: true,
      trackSkillDemand: true,
      trackCompanyRatings: true,
      preferredIndustries: [],
      careerGoals: []
    };
  }

  // Clear all preferences
  clearAllPreferences() {
    const keys = cookieCache.keys();
    let cleared = 0;

    keys.forEach(key => {
      if (key.startsWith('pref_')) {
        cookieCache.delete(key);
        cleared++;
      }
    });

    console.log(`Cleared ${cleared} user preferences`);
    return cleared;
  }

  // Export preferences for backup
  exportPreferences() {
    const keys = cookieCache.keys();
    const preferences = {};
    
    keys.forEach(key => {
      if (key.startsWith('pref_')) {
        const prefKey = key.replace('pref_', '');
        preferences[prefKey] = cookieCache.getUserPreference(prefKey);
      }
    });
    
    return preferences;
  }

  // Import preferences from backup
  importPreferences(preferences) {
    let imported = 0;
    
    Object.keys(preferences).forEach(key => {
      if (cookieCache.setUserPreference(key, preferences[key])) {
        imported++;
      }
    });
    
    console.log(`Imported ${imported} user preferences`);
    return imported;
  }
}

// Create singleton instance
const userPreferences = new UserPreferences();

export default userPreferences;
