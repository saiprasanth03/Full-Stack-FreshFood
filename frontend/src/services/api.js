import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token injected from interceptor');
      } else {
        console.warn('UserInfo found but no token present');
      }
    } else {
      console.warn('No userInfo found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
