import axios from 'axios';

// Django backend base URL (no '/api' prefix for this project)
// Example: http://localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const apiService = {
  // Users
  registerUser: async (payload) => {
    const response = await api.post('/users/register/', payload);
    return response.data;
  },

  // Fingerprint (ESP32-style)
  verifyFingerprint: async (fingerprintId) => {
    const response = await api.get(`/fingerprint/verify/${fingerprintId}/`);
    return response.data;
  },

  enrollFingerprint: async (payload) => {
    const response = await api.post('/fingerprint/enroll/', payload);
    return response.data;
  },

  // Attendance (core loop)
  checkIn: async (payload) => {
    const response = await api.post('/attendance/check-in/', payload);
    return response.data;
  },
};

export default api;
