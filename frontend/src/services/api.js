import axios from 'axios';

const API_BASE_URL = 'http://localhost:8917';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const progressAPI = {
  // Get all progress data
  getAll: () => api.get('/progress'),
  
  // Get progress for specific date
  getByDate: (date) => api.get(`/progress/${date}`),
  
  // Get progress history
  getHistory: () => api.get('/progress/history'),
  
  // Get statistics
  getStats: () => api.get('/progress/stats'),
  
  // Update progress for specific date
  update: (date, tasks) => api.put(`/progress/${date}`, { tasks }),
  
  // Increment water intake
  incrementWater: (date, amount) => api.post(`/progress/${date}/water`, { amount }),
};

export default api;