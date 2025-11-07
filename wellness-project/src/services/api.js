// api.js

import axios from 'axios';

// Create a new Axios instance with a base URL
const api = axios.create({
  // 💡 FIX APPLIED HERE: Added '/api' to match the server-side base path
  baseURL: 'https://manas-dost-2.onrender.com/api', 
});

// This interceptor automatically attaches the auth token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      // Note: If you used 'Authorization: Bearer <token>', that's standard, 
      // but 'x-auth-token' is fine if your middleware expects it.
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;