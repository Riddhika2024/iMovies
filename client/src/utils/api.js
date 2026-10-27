import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized or expired session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: If token expired, clear credentials
      // Don't auto-redirect on login check
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && !window.location.pathname.includes('/landing')) {
        // can notify or keep state clean
      }
    }
    return Promise.reject(error);
  }
);

export default api;
