import apiClient from './client';
import { Resume, ResumeDetail, ResumeUploadData } from '@/types/resume.types';

export const resumeApi = {
  upload: async (data: ResumeUploadData): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', data.file);

    const response = await apiClient.post<Resume>(
      `/resumes/?title=${encodeURIComponent(data.title)}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  getAll: async (skip = 0, limit = 10): Promise<Resume[]> => {
    const response = await apiClient.get<Resume[]>('/resumes/', {
      params: { skip, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<ResumeDetail> => {
    const response = await apiClient.get<ResumeDetail>(`/resumes/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Resume>): Promise<Resume> => {
    const response = await apiClient.put<Resume>(`/resumes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`);
  },

  setPrimary: async (id: string): Promise<Resume> => {
    const response = await apiClient.post<Resume>(`/resumes/${id}/set-primary`);
    return response.data;
  },
};