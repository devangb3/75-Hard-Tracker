import axios from 'axios';

// Create axios instance with default config (no baseURL, use relative URLs)
const api = axios.create({
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
  getAll: () => api.get('/api/progress'),
  
  // Get progress for specific date
  getByDate: (date) => api.get(`/api/progress/${date}`),
  
  // Get progress history
  getHistory: () => api.get('/api/progress/history'),
  
  // Get statistics
  getStats: () => api.get('/api/progress/stats'),
  
  // Update progress for specific date
  update: (date, tasks) => api.put(`/api/progress/${date}`, { tasks }),
  
  // Increment water intake
  incrementWater: (date, amount) => api.post(`/api/progress/${date}/water`, { amount }),
};

export const progressPicAPI = {
  // Upload a progress picture for a specific date
  upload: (date, file) => {
    const formData = new FormData();
    formData.append('file', file, 'progress.jpg');
    formData.append('user_id', 'demo_user');
    return api.post(`/api/progress/pic/${date}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // Fetch a progress picture for a specific date
  fetchByDate: (date) =>
    api.get(`/api/progress/pic/${date}`, { params: { user_id: 'demo_user' }, responseType: 'blob' }),
  // Fetch all progress pics for the gallery
  fetchAll: () => api.get('/api/progress/pics'),
};

export default api;