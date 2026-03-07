import axios from 'axios';

// In dev: Vite proxy forwards /api → localhost:5000
// In prod: set VITE_API_URL to your Railway backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
