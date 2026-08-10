import axios from 'axios';
import { config } from './config';

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((req) => {
  const token = localStorage.getItem('wudapp:token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wudapp:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
