/**
 * HTTP Client utility using native fetch API
 * Replacement for axios to avoid import issues in Vercel
 *
 * @deprecated This file is deprecated. Use the new API structure in ../api/httpClient.js
 * This file is kept for backward compatibility during migration.
 */

// Re-export everything from the new location
export { default } from '../api/httpClient.js';
export * from '../api/httpClient.js';
