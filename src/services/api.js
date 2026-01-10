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
  // Authentication
  login: async (idToken) => {
    const response = await api.post('/auth/login/', { id_token: idToken });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  verifyToken: async (idToken) => {
    const response = await api.post('/auth/verify-token/', { id_token: idToken });
    return response.data;
  },

  // Users/Students
  registerUser: async (payload) => {
    const response = await api.post('/users/register/', payload);
    return response.data;
  },

  listStudents: async () => {
    const response = await api.get('/users/students/');
    return response.data;
  },

  getStudent: async (uid) => {
    const response = await api.get(`/users/students/${uid}/`);
    return response.data;
  },

  deleteStudent: async (uid) => {
    const response = await api.delete(`/users/students/${uid}/delete/`);
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

  getAttendanceHistory: async (params = {}) => {
    const response = await api.get('/attendance/history/', { params });
    return response.data;
  },

  getTodayAttendance: async () => {
    const response = await api.get('/attendance/today/');
    return response.data;
  },

  getAttendanceStats: async () => {
    const response = await api.get('/attendance/stats/');
    return response.data;
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats/');
    return response.data;
  },

  getRecentActivity: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-activity/', { params: { limit } });
    return response.data;
  },
};

export default api;

