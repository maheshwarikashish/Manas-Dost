import axios from 'axios';

// Create a new Axios instance with a base URL
const api = axios.create({
  baseURL: 'https://manas-dost-2.onrender.com',
});

// This interceptor automatically attaches the auth token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;