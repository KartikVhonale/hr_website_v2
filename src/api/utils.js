/**
 * API Utility Functions
 * Common utility functions for API operations including PDF handling, file uploads, etc.
 */

/**
 * Ensures a Cloudinary URL serves a PDF file in proper PDF format
 * @param {string} url - Original Cloudinary URL
 * @returns {string} - URL formatted to serve as PDF
 */
export const ensurePdfFormat = (url) => {
  if (!url) return url;

  console.log('Original URL:', url);

  let pdfUrl = url;

  // URLs should now use image/upload for public access
  // If URL still contains 'raw/upload', replace with image/upload for better PDF handling
  if (pdfUrl.includes('/raw/upload/')) {
    pdfUrl = pdfUrl.replace('/raw/upload/', '/image/upload/');
    console.log('Converted raw URL to image URL:', pdfUrl);
  }

  // For image resource type with format=pdf, no additional transformations needed
  // The PDF format is already preserved by the backend configuration
  console.log('Final PDF URL:', pdfUrl);
  return pdfUrl;
};

/**
 * Generates a proper PDF download URL
 * @param {string} url - Original Cloudinary URL
 * @param {string} filename - Desired filename for download
 * @returns {string} - URL formatted for PDF download
 */
export const generatePdfDownloadUrl = (url, filename = 'resume.pdf') => {
  if (!url) return url;

  // First ensure the URL is in the correct format
  let downloadUrl = ensurePdfFormat(url);

  // Add fl_attachment flag for download behavior (simple approach)
  if (!downloadUrl.includes('fl_attachment')) {
    const urlParts = downloadUrl.split('/upload/');
    if (urlParts.length === 2) {
      downloadUrl = `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`;
      console.log('Added attachment flag for download:', downloadUrl);
    }
  }

  return downloadUrl;
};

/**
 * Validates if a URL is properly formatted for PDF viewing
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is properly formatted for PDF
 */
export const isPdfUrlValid = (url) => {
  if (!url) return false;

  // Check if URL ends with .pdf (format is handled by backend)
  const hasPdfFormat = url.endsWith('.pdf');

  // Check if URL is using image resource type (preferred for public access)
  const isImageResource = url.includes('/image/upload/');

  return hasPdfFormat && isImageResource;
};

/**
 * Extracts public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export const extractPublicId = (url) => {
  if (!url) return '';

  try {
    // Remove base URL and transformations
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return '';

    const pathPart = urlParts[1];
    
    // Remove transformations if present
    const pathSegments = pathPart.split('/');
    const publicIdWithExtension = pathSegments[pathSegments.length - 1];
    
    // Remove file extension
    const publicId = publicIdWithExtension.split('.')[0];
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};

/**
 * Logs detailed information about a PDF URL for debugging
 * @param {string} url - URL to analyze
 * @param {string} context - Context for logging (e.g., 'upload', 'view', 'download')
 */
export const debugPdfUrl = (url, context = 'general') => {
  console.log(`=== PDF URL DEBUG (${context.toUpperCase()}) ===`);
  console.log('URL:', url);
  console.log('Ends with .pdf:', url?.endsWith('.pdf'));
  console.log('Has attachment flag:', url?.includes('fl_attachment'));
  console.log('Is raw resource:', url?.includes('/raw/upload/'));
  console.log('Is image resource:', url?.includes('/image/upload/'));
  console.log('Public ID:', extractPublicId(url));
  console.log('Is valid PDF URL:', isPdfUrlValid(url));
  console.log('=====================================');
};

/**
 * Formats file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validates file type and size
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = [],
    maxSize = 10 * 1024 * 1024, // 10MB default
    minSize = 0
  } = options;

  const errors = [];

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size ${formatFileSize(file.size)} exceeds maximum allowed size of ${formatFileSize(maxSize)}`);
  }

  if (file.size < minSize) {
    errors.push(`File size ${formatFileSize(file.size)} is below minimum required size of ${formatFileSize(minSize)}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Creates a FormData object from an object
 * @param {Object} data - Data to convert
 * @param {FormData} formData - Existing FormData (optional)
 * @param {string} parentKey - Parent key for nested objects
 * @returns {FormData} - FormData object
 */
export const createFormData = (data, formData = new FormData(), parentKey = '') => {
  Object.keys(data).forEach(key => {
    const value = data[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(`${formKey}[${index}]`, item);
        } else if (typeof item === 'object') {
          createFormData({ [index]: item }, formData, formKey);
        } else {
          formData.append(`${formKey}[${index}]`, item);
        }
      });
    } else if (typeof value === 'object') {
      createFormData(value, formData, formKey);
    } else {
      formData.append(formKey, value);
    }
  });

  return formData;
};

/**
 * Debounce function for API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for API calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Retry function for failed API calls
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries
 * @returns {Promise} - Promise that resolves when function succeeds or all retries are exhausted
 */
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

/**
 * Converts query parameters object to URL search string
 * @param {Object} params - Query parameters
 * @returns {string} - URL search string
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};

/**
 * Parses URL search string to object
 * @param {string} searchString - URL search string
 * @returns {Object} - Parsed parameters object
 */
export const parseQueryString = (searchString) => {
  const params = {};
  const searchParams = new URLSearchParams(searchString);
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
};
