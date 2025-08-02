/**
 * Utility functions for handling PDF URLs from Cloudinary
 *
 * @deprecated This file has been moved to ../api/utils.js
 * This file is kept for backward compatibility during migration.
 */

// Re-export from the new location
export * from '../api/utils.js';

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
