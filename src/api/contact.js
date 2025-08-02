/**
 * Contact API Service
 * Handles all contact form and communication API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Submit contact form
export const submitContactForm = async (contactData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.CONTACT.BASE, contactData);
    return response.data;
  } catch (error) {
    console.error('Submit contact form error:', error);
    throw error;
  }
};

// Get all contact submissions (Admin only)
export const getAllContacts = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.CONTACT.BASE, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all contacts error:', error);
    throw error;
  }
};

// Get contact by ID (Admin only)
export const getContactById = async (contactId) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.CONTACT.BASE}/${contactId}`);
    return response.data;
  } catch (error) {
    console.error('Get contact by ID error:', error);
    throw error;
  }
};

// Update contact status (Admin only)
export const updateContactStatus = async (contactId, status, response = '') => {
  try {
    const result = await httpClient.put(`${API_ENDPOINTS.CONTACT.BASE}/${contactId}`, {
      status,
      response
    });
    return result.data;
  } catch (error) {
    console.error('Update contact status error:', error);
    throw error;
  }
};

// Delete contact (Admin only)
export const deleteContact = async (contactId) => {
  try {
    const response = await httpClient.delete(`${API_ENDPOINTS.CONTACT.BASE}/${contactId}`);
    return response.data;
  } catch (error) {
    console.error('Delete contact error:', error);
    throw error;
  }
};

// Send response to contact (Admin only)
export const sendContactResponse = async (contactId, responseData) => {
  try {
    const response = await httpClient.post(`${API_ENDPOINTS.CONTACT.BASE}/${contactId}/response`, responseData);
    return response.data;
  } catch (error) {
    console.error('Send contact response error:', error);
    throw error;
  }
};

// Get contact statistics (Admin only)
export const getContactStats = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.CONTACT.BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get contact stats error:', error);
    throw error;
  }
};

// Mark contact as read (Admin only)
export const markContactAsRead = async (contactId) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.CONTACT.BASE}/${contactId}/read`);
    return response.data;
  } catch (error) {
    console.error('Mark contact as read error:', error);
    throw error;
  }
};

// Bulk update contact statuses (Admin only)
export const bulkUpdateContacts = async (contactIds, status) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.CONTACT.BASE}/bulk-update`, {
      contactIds,
      status
    });
    return response.data;
  } catch (error) {
    console.error('Bulk update contacts error:', error);
    throw error;
  }
};

// Export contacts data (Admin only)
export const exportContacts = async (format = 'csv', filters = {}) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.CONTACT.BASE}/export`, {
      params: { format, ...filters },
      responseType: 'blob' // For file download
    });
    return response.data;
  } catch (error) {
    console.error('Export contacts error:', error);
    throw error;
  }
};

// Contact API object for easier imports
const contactAPI = {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  sendContactResponse,
  getContactStats,
  markContactAsRead,
  bulkUpdateContacts,
  exportContacts,
};

export default contactAPI;
