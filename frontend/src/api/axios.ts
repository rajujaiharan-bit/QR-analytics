import axios from 'axios';

// Relative API base so requests go to current domain on all devices (mobile phones, tunnels, cloud deployments)
const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qr_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('qr_token');
      localStorage.removeItem('qr_user');
    }
    return Promise.reject(error);
  }
);
