import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
  // Auth
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Fingerprint
  enrollFingerprint: async () => {
    const response = await api.post('/fingerprint/enroll');
    return response.data;
  },

  scanFingerprint: async () => {
    const response = await api.post('/fingerprint/scan');
    return response.data;
  },

  // Students
  getStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  addStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Courses
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  addCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Attendance
  getAttendance: async () => {
    const response = await api.get('/attendance');
    return response.data;
  },

  getTodayAttendance: async () => {
    const response = await api.get('/attendance/today');
    return response.data;
  },
};

export default api;
