/**
 * Articles API Service
 * Handles all article/blog-related API calls
 */

import httpClient from './httpClient.js';
import { API_ENDPOINTS } from './config.js';

// Get all articles with optional filters
export const getAllArticles = async (filters = {}) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ARTICLES.BASE, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all articles error:', error);
    throw error;
  }
};

// Get article by ID
export const getArticleById = async (articleId) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ARTICLES.BY_ID(articleId));
    return response.data;
  } catch (error) {
    console.error('Get article by ID error:', error);
    throw error;
  }
};

// Create new article
export const createArticle = async (articleData) => {
  try {
    // Handle file upload for article image
    const formData = new FormData();
    
    // Add text fields
    Object.keys(articleData).forEach(key => {
      if (key !== 'image' && articleData[key] !== undefined) {
        formData.append(key, articleData[key]);
      }
    });
    
    // Add image file if present
    if (articleData.image) {
      formData.append('image', articleData.image);
    }

    const response = await httpClient.post(API_ENDPOINTS.ARTICLES.BASE, formData);
    return response.data;
  } catch (error) {
    console.error('Create article error:', error);
    throw error;
  }
};

// Update article
export const updateArticle = async (articleId, articleData) => {
  try {
    // Handle file upload for article image
    const formData = new FormData();
    
    // Add text fields
    Object.keys(articleData).forEach(key => {
      if (key !== 'image' && articleData[key] !== undefined) {
        formData.append(key, articleData[key]);
      }
    });
    
    // Add image file if present
    if (articleData.image) {
      formData.append('image', articleData.image);
    }

    const response = await httpClient.put(API_ENDPOINTS.ARTICLES.BY_ID(articleId), formData);
    return response.data;
  } catch (error) {
    console.error('Update article error:', error);
    throw error;
  }
};

// Delete article
export const deleteArticle = async (articleId) => {
  try {
    const response = await httpClient.delete(API_ENDPOINTS.ARTICLES.BY_ID(articleId));
    return response.data;
  } catch (error) {
    console.error('Delete article error:', error);
    throw error;
  }
};

// Like/Unlike article
export const toggleArticleLike = async (articleId) => {
  try {
    const response = await httpClient.put(API_ENDPOINTS.ARTICLES.LIKE(articleId));
    return response.data;
  } catch (error) {
    console.error('Toggle article like error:', error);
    throw error;
  }
};

// Get featured articles
export const getFeaturedArticles = async (limit = 4) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ARTICLES.BASE, {
      params: { featured: true, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get featured articles error:', error);
    throw error;
  }
};

// Get recent articles
export const getRecentArticles = async (limit = 10) => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.ARTICLES.BASE, {
      params: { sortBy: 'createdAt', sortOrder: 'desc', limit }
    });
    return response.data;
  } catch (error) {
    console.error('Get recent articles error:', error);
    throw error;
  }
};

// Get articles by category
export const getArticlesByCategory = async (category, filters = {}) => {
  try {
    const params = { category, ...filters };
    const response = await httpClient.get(API_ENDPOINTS.ARTICLES.BASE, { params });
    return response.data;
  } catch (error) {
    console.error('Get articles by category error:', error);
    throw error;
  }
};

// Get articles by author
export const getArticlesByAuthor = async (authorId, filters = {}) => {
  try {
    const params = { author: authorId, ...filters };
    const response = await httpClient.get(API_ENDPOINTS.ARTICLES.BASE, { params });
    return response.data;
  } catch (error) {
    console.error('Get articles by author error:', error);
    throw error;
  }
};

// Search articles
export const searchArticles = async (searchParams) => {
  try {
    const {
      query = '',
      category = '',
      author = '',
      tags = [],
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = searchParams;

    const params = {
      q: query,
      category,
      author,
      tags: Array.isArray(tags) ? tags.join(',') : tags,
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

    const response = await httpClient.get(API_ENDPOINTS.ARTICLES.BASE, { params });
    return response.data;
  } catch (error) {
    console.error('Search articles error:', error);
    throw error;
  }
};

// Get article categories
export const getArticleCategories = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ARTICLES.BASE}/categories`);
    return response.data;
  } catch (error) {
    console.error('Get article categories error:', error);
    throw error;
  }
};

// Get article tags
export const getArticleTags = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ARTICLES.BASE}/tags`);
    return response.data;
  } catch (error) {
    console.error('Get article tags error:', error);
    throw error;
  }
};

// Get article statistics
export const getArticleStats = async () => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.ARTICLES.BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get article stats error:', error);
    throw error;
  }
};

// Add comment to article
export const addArticleComment = async (articleId, commentData) => {
  try {
    const response = await httpClient.post(
      `${API_ENDPOINTS.ARTICLES.BY_ID(articleId)}/comments`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error('Add article comment error:', error);
    throw error;
  }
};

// Get article comments
export const getArticleComments = async (articleId, filters = {}) => {
  try {
    const response = await httpClient.get(
      `${API_ENDPOINTS.ARTICLES.BY_ID(articleId)}/comments`,
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Get article comments error:', error);
    throw error;
  }
};

// Articles API object for easier imports
const articlesAPI = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleLike,
  getFeaturedArticles,
  getRecentArticles,
  getArticlesByCategory,
  getArticlesByAuthor,
  searchArticles,
  getArticleCategories,
  getArticleTags,
  getArticleStats,
  addArticleComment,
  getArticleComments,
};

export default articlesAPI;
