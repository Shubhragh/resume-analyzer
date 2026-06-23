import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = localStorage.getItem('auth_tokens');
    if (tokens) {
      try {
        const { access_token } = JSON.parse(tokens);
        config.headers.Authorization = `Bearer ${access_token}`;
      } catch (error) {
        console.error('Error parsing auth tokens:', error);
        localStorage.removeItem('auth_tokens');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we're already on an auth endpoint
      const isAuthEndpoint = originalRequest.url?.includes('/auth/');
      
      if (!isAuthEndpoint) {
        // Clear tokens and redirect to login
        localStorage.removeItem('auth_tokens');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;