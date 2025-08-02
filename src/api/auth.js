/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Login user
export const login = async (credentials) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Store token and user data on successful login
    if (response.data.success && response.data.token) {
      httpClient.setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register new user
export const signup = async (userData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
    
    // Store token and user data on successful signup
    if (response.data.success && response.data.token) {
      httpClient.setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with local logout even if server request fails
  } finally {
    // Always clear local storage
    httpClient.setAuthToken(null);
    localStorage.removeItem('user');
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
    
    // Update local user data if successful
    if (response.data.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (resetData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// Admin: Get all users
export const getAllUsers = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.AUTH.USERS);
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

// Admin: Update user status
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.AUTH.USERS}/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Update user status error:', error);
    throw error;
  }
};

// Admin: Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await httpClient.delete(`${API_ENDPOINTS.AUTH.USERS}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Admin: Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.AUTH.USERS}/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Admin: Authorize employer
export const authorizeEmployer = async (userId) => {
  try {
    const response = await httpClient.put(`${API_ENDPOINTS.AUTH.USERS}/${userId}/authorize`);
    return response.data;
  } catch (error) {
    console.error('Authorize employer error:', error);
    throw error;
  }
};

// Admin: Create user
export const createUser = async (userData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.AUTH.USERS, userData);
    return response.data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = httpClient.getAuthToken();
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Auth API object for easier imports
const authAPI = {
  login,
  signup,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  resetPassword,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUser,
  authorizeEmployer,
  createUser,
  isAuthenticated,
  getCurrentUser,
};

export default authAPI;
