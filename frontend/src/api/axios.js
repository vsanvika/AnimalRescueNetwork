import axios from 'axios';

// VITE_API_URL should point to the server root (no trailing slash)
const rawApiUrl = import.meta.env.VITE_API_URL || window.location.origin || 'http://localhost:5000';
const normalizedApiUrl = rawApiUrl.replace(/\/$/, '').replace(/\/api$/, '');
const apiBaseUrl = `${normalizedApiUrl}/api`;
const API = axios.create({
  // Append /api here so every request automatically goes to the correct namespace
  baseURL: apiBaseUrl,
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

// Retry once without /api if the backend is mounted at the root path in production
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config._retry || error.response?.status !== 404) {
      return Promise.reject(error);
    }

    config._retry = true;
    const retryConfig = {
      ...config,
      baseURL: normalizedApiUrl,
    };

    return axios(retryConfig);
  }
);

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
