import apiClient from './client';
import { Analysis, CreateAnalysis } from '@/types/analysis.types';

export const analysisApi = {
  create: async (data: CreateAnalysis): Promise<Analysis> => {
    const response = await apiClient.post<Analysis>('/analysis/', data);
    return response.data;
  },

  getAll: async (skip = 0, limit = 10): Promise<Analysis[]> => {
    const response = await apiClient.get<Analysis[]>('/analysis/', {
      params: { skip, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Analysis> => {
    const response = await apiClient.get<Analysis>(`/analysis/${id}`);
    return response.data;
  },
};