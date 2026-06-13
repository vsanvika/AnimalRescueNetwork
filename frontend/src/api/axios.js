import axios from 'axios';

// VITE_API_URL should point to the server root (no trailing slash)
const API = axios.create({
  // Append /api here so every request automatically goes to the correct namespace
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('arn_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Global 401 handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('arn_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
