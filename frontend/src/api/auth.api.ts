import apiClient from './client';
import { LoginCredentials, RegisterData, AuthTokens, User } from '@/types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post<AuthTokens>('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_tokens');
  },
};