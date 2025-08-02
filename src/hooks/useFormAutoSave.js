/**
 * Custom hook for form auto-save using cookie storage
 * Automatically saves and restores form data
 */

import { useState, useEffect, useCallback } from 'react';
import userPreferences from '../utils/userPreferences.js';

export const useFormAutoSave = (formId, initialData = {}, options = {}) => {
  const {
    autoSaveDelay = 2000, // 2 seconds delay
    clearOnSubmit = true,
    enableAutoSave = true
  } = options;

  const [formData, setFormData] = useState(() => {
    // Try to restore from cookie storage
    const savedData = userPreferences.getFormData(formId);
    return savedData ? { ...initialData, ...savedData } : initialData;
  });

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save form data to cookies
  useEffect(() => {
    if (!enableAutoSave) return;

    const timeoutId = setTimeout(() => {
      setIsAutoSaving(true);
      userPreferences.saveFormData(formId, formData);
      setLastSaved(new Date());
      setIsAutoSaving(false);
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [formData, formId, autoSaveDelay, enableAutoSave]);

  // Update form data
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Update single field
  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  // Clear form data
  const clearFormData = useCallback(() => {
    setFormData(initialData);
    userPreferences.clearFormData(formId);
    setLastSaved(null);
  }, [formId, initialData]);

  // Submit handler that optionally clears saved data
  const handleSubmit = useCallback((submitFn) => {
    return async (...args) => {
      try {
        const result = await submitFn(...args);
        
        if (clearOnSubmit) {
          clearFormData();
        }
        
        return result;
      } catch (error) {
        // Don't clear on error
        throw error;
      }
    };
  }, [clearOnSubmit, clearFormData]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    const savedData = userPreferences.getFormData(formId);
    return savedData && JSON.stringify(savedData) !== JSON.stringify(initialData);
  }, [formId, initialData]);

  return {
    formData,
    updateFormData,
    updateField,
    clearFormData,
    handleSubmit,
    isAutoSaving,
    lastSaved,
    hasUnsavedChanges
  };
};

// Hook for managing search filters with cookie persistence
export const useSearchFilters = (searchType = 'jobs') => {
  const [filters, setFilters] = useState(() => {
    return userPreferences.getJobSearchFilters();
  });

  const [sortOptions, setSortOptions] = useState(() => {
    return userPreferences.getJobSearchSort();
  });

  // Update filters and save to cookies
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    userPreferences.setJobSearchFilters(updatedFilters);
  }, [filters]);

  // Update sort options and save to cookies
  const updateSort = useCallback((sortBy, sortOrder = 'desc') => {
    const sortOptions = { sortBy, sortOrder };
    setSortOptions(sortOptions);
    userPreferences.setJobSearchSort(sortBy, sortOrder);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const defaultFilters = {
      location: '',
      jobType: '',
      experienceLevel: '',
      skills: []
    };
    setFilters(defaultFilters);
    userPreferences.setJobSearchFilters(defaultFilters);
  }, []);

  // Add to search history
  const addToSearchHistory = useCallback((query) => {
    userPreferences.addSearchHistory(query, searchType);
  }, [searchType]);

  // Get search history
  const getSearchHistory = useCallback(() => {
    return userPreferences.getSearchHistory(searchType);
  }, [searchType]);

  return {
    filters,
    sortOptions,
    updateFilters,
    updateSort,
    clearFilters,
    addToSearchHistory,
    getSearchHistory
  };
};

// Hook for managing recently viewed items
export const useRecentlyViewed = (itemType) => {
  const [recentItems, setRecentItems] = useState(() => {
    return userPreferences.getRecentlyViewed(itemType);
  });

  const addRecentItem = useCallback((item) => {
    userPreferences.addRecentlyViewed(itemType, item);
    setRecentItems(userPreferences.getRecentlyViewed(itemType));
  }, [itemType]);

  const clearRecentItems = useCallback(() => {
    userPreferences.clearRecentItems?.(itemType);
    setRecentItems([]);
  }, [itemType]);

  return {
    recentItems,
    addRecentItem,
    clearRecentItems
  };
};

// Hook for managing table/list preferences
export const useTablePreferences = (tableId) => {
  const [pageSize, setPageSize] = useState(() => {
    return userPreferences.getTablePageSize(tableId);
  });

  const [visibleColumns, setVisibleColumns] = useState(() => {
    return userPreferences.getTableColumns(tableId);
  });

  const updatePageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    userPreferences.setTablePageSize(tableId, newPageSize);
  }, [tableId]);

  const updateVisibleColumns = useCallback((columns) => {
    setVisibleColumns(columns);
    userPreferences.setTableColumns(tableId, columns);
  }, [tableId]);

  return {
    pageSize,
    visibleColumns,
    updatePageSize,
    updateVisibleColumns
  };
};

// Hook for theme and display preferences
export const useDisplayPreferences = () => {
  const [theme, setTheme] = useState(() => {
    return userPreferences.getTheme();
  });

  const [language, setLanguage] = useState(() => {
    return userPreferences.getLanguage();
  });

  const updateTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    userPreferences.setTheme(newTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  const updateLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    userPreferences.setLanguage(newLanguage);
  }, []);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return {
    theme,
    language,
    updateTheme,
    updateLanguage
  };
};

// Hook for managing job application forms
export const useJobApplicationForm = (jobId) => {
  const formId = `job-application-${jobId}`;

  const {
    formData,
    updateField,
    clearFormData,
    handleSubmit,
    isAutoSaving,
    lastSaved,
    hasUnsavedChanges
  } = useFormAutoSave(formId, {
    coverLetter: '',
    additionalInfo: '',
    expectedSalary: '',
    availableStartDate: '',
    portfolioLinks: [],
    references: []
  });

  return {
    formData,
    updateField,
    clearFormData,
    handleSubmit,
    isAutoSaving,
    lastSaved,
    hasUnsavedChanges
  };
};

// Hook for managing profile edit forms
export const useProfileEditForm = (initialData = {}) => {
  const {
    formData,
    updateFormData,
    updateField,
    clearFormData,
    handleSubmit,
    isAutoSaving,
    lastSaved
  } = useFormAutoSave('profile-edit-form', {
    name: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    ...initialData
  }, {
    autoSaveDelay: 3000, // 3 seconds for profile
    clearOnSubmit: false // Don't clear profile data on submit
  });

  return {
    formData,
    updateFormData,
    updateField,
    clearFormData,
    handleSubmit,
    isAutoSaving,
    lastSaved
  };
};

// Hook for managing job alerts and preferences
export const useJobAlertsPreferences = () => {
  const [alerts, setAlerts] = useState(() => {
    return userPreferences.getJobAlerts();
  });

  const updateAlerts = useCallback((newAlerts) => {
    const updatedAlerts = { ...alerts, ...newAlerts };
    setAlerts(updatedAlerts);
    userPreferences.setJobAlerts(updatedAlerts);
  }, [alerts]);

  const toggleAlert = useCallback((alertType) => {
    const updatedAlerts = {
      ...alerts,
      [alertType]: !alerts[alertType]
    };
    setAlerts(updatedAlerts);
    userPreferences.setJobAlerts(updatedAlerts);
  }, [alerts]);

  return {
    alerts,
    updateAlerts,
    toggleAlert
  };
};

// Hook for managing application tracking
export const useApplicationTracking = () => {
  const [filters, setFilters] = useState(() => {
    return userPreferences.getApplicationFilters();
  });

  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    userPreferences.setApplicationFilters(updatedFilters);
  }, [filters]);

  const clearFilters = useCallback(() => {
    const defaultFilters = {
      status: 'all',
      dateRange: 'all',
      company: ''
    };
    setFilters(defaultFilters);
    userPreferences.setApplicationFilters(defaultFilters);
  }, []);

  return {
    filters,
    updateFilters,
    clearFilters
  };
};

export default useFormAutoSave;
