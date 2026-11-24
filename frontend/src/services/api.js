import axios from 'axios';

// Base API URL configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BACKEND_SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodie_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, token might have expired
      // Do not clear token immediately on login attempts
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('foodie_token');
        localStorage.removeItem('foodie_user');
      }
    }
    return Promise.reject(error);
  }
);

// Helper to format image URLs (handles uploads from backend as well as absolute URLs)
export const formatImageUrl = (img) => {
  if (!img) {
    return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';
  }
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  if (img.startsWith('/uploads/')) {
    return `${BACKEND_SERVER_URL}${img}`;
  }
  if (img.startsWith('uploads/')) {
    return `${BACKEND_SERVER_URL}/${img}`;
  }
  return `${BACKEND_SERVER_URL}/uploads/${img}`;
};

// ==================== AUTH API ====================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

// ==================== RECIPES API ====================
export const recipeAPI = {
  getRecipes: (params) => api.get('/recipes', { params }),
  getRecipeById: (id) => api.get(`/recipes/${id}`),
  createRecipe: (formData) =>
    api.post('/recipes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateRecipe: (id, formData) =>
    api.put(`/recipes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  deleteRecipe: (id) => api.delete(`/recipes/${id}`)
};

// ==================== CATEGORIES API ====================
export const categoryAPI = {
  getCategories: () => api.get('/categories')
};

// ==================== FAVORITES API ====================
export const favoriteAPI = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (recipeId) => api.post(`/favorites/${recipeId}`),
  removeFavorite: (recipeId) => api.delete(`/favorites/${recipeId}`)
};

// ==================== REVIEWS API ====================
export const reviewAPI = {
  getRecipeReviews: (recipeId) => api.get(`/reviews/${recipeId}`),
  getAllReviews: (params) => api.get('/reviews', { params }),
  createOrUpdateReview: (recipeId, data) => api.post(`/reviews/${recipeId}`, data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

// ==================== USER API ====================
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (formData) =>
    api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default api;
