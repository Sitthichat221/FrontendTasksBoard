import axios from 'axios';

// Prefer Vite env var for deployment; fallback to local dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Log API URL for debugging
console.log('API URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const signup = (fullName, email, password) => {
  return api.post('/auth/signup', { fullName, email, password });
};

export const createTask = (taskData, token) => {
  return api.post('/tasks/create', taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyTasks = (token) => {
  return api.get('/tasks/mytasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTaskStatus = (taskId, status, token) => {
  return api.put(`/tasks/updateStatus/${taskId}`, status, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTask = (taskId, taskData, token) => {
  return api.put(`/tasks/update/${taskId}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTask = (taskId, token) => {
  return api.delete(`/tasks/delete/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const assignTask = (taskId, assignedToEmail, token) => {
  return api.post('/tasks/assign', {
    taskId,
    assignedToEmails: [assignedToEmail], 
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAssignedTasks = async (token) => {
  try {
    const response = await api.get('/tasks/assigned', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch assigned tasks');
  }
};

