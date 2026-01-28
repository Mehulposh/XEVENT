import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const eventService = {
  getAll: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (eventData) => {
    const response = await api.post('/events', eventData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  getMyEvents: async () => {
    const response = await api.get('/events/my-events');
    return response.data;
  },
};

export const registrationService = {
  register: async (eventId) => {
    const response = await api.post(`/registration/events/${eventId}`);
    return response.data;
  },

  cancel: async (eventId) => {
    const response = await api.delete(`/registration/events/${eventId}`);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/registration/my-registrations');
    return response.data;
  },

  getEventParticipants: async (eventId) => {
    const response = await api.get(`/registration/events/${eventId}/participants`);
    return response.data;
  },
};

export const userService = {
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    localStorage.setItem('user', JSON.stringify(response.data.data));
    return response.data;
  },

  updateRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
};

export const adminService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  approveEvent: async (id, isApproved) => {
    const response = await api.patch(`/admin/events/${id}/approval`, { isApproved });
    return response.data;
  },
};

export default api;