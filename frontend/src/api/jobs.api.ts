import apiClient from './client';
import { Job, JobDetail, CreateJob } from '@/types/job.types';

export const jobsApi = {
  create: async (data: CreateJob): Promise<Job> => {
    const response = await apiClient.post<Job>('/jobs/', data);
    return response.data;
  },

  getAll: async (status?: string, skip = 0, limit = 20): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/jobs/', {
      params: { status, skip, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<JobDetail> => {
    const response = await apiClient.get<JobDetail>(`/jobs/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Job>): Promise<Job> => {
    const response = await apiClient.put<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/jobs/${id}`);
  },

  search: async (query: string): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/jobs/search', {
      params: { q: query },
    });
    return response.data;
  },
};