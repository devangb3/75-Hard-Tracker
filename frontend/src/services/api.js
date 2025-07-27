import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8917',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  getAll: () => api.get('/api/progress'),
  
  getByDate: (date) => api.get(`/api/progress/${date}`),
  
  getHistory: () => api.get('/api/progress/history'),
  
  getStats: () => api.get('/api/progress/stats'),
  
  update: (date, tasks) => api.put(`/api/progress/${date}`, { tasks }),
  
  incrementWater: (date, amount) => api.post(`/api/progress/${date}/water`, { amount }),
};

export const progressPicAPI = {
  upload: (date, file) => {
    const formData = new FormData();
    formData.append('file', file, 'progress.jpg');
    formData.append('user_id', 'demo_user');
    return api.post(`/api/progress/pic/${date}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  fetchByDate: (date) =>
    api.get(`/api/progress/pic/${date}`, { params: { user_id: 'demo_user' }, responseType: 'blob' }),
  fetchAll: () => api.get('/api/progress/pics'),
};

export default api;