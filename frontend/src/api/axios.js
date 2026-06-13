import axios from 'axios';

const API = axios.create({
  // VITE_API_URL should point to the server root (no /api)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Attach JWT token and ensure all requests are prefixed with /api
API.interceptors.request.use((config) => {
  // Add /api prefix if not already present
  if (!config.url.startsWith('/api')) {
    config.url = `/api${config.url}`;
  }
  const user = JSON.parse(localStorage.getItem('arn_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 globally
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
