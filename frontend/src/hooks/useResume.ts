import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '@/api/resume.api';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeUploadData } from '@/types/resume.types';
import { toast } from 'sonner';

export const useResume = () => {
  const queryClient = useQueryClient();
  const { setResumes, addResume, removeResume } = useResumeStore();

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.getAll(),
    onSuccess: (data) => setResumes(data),
  });

  const uploadMutation = useMutation({
    mutationFn: resumeApi.upload,
    onSuccess: (newResume) => {
      addResume(newResume);
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Upload failed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: resumeApi.delete,
    onSuccess: (_, id) => {
      removeResume(id);
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Delete failed');
    },
  });

  const setPrimaryMutation = useMutation({
    mutationFn: resumeApi.setPrimary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Primary resume updated');
    },
  });

  return {
    resumes,
    isLoading,
    uploadResume: uploadMutation.mutate,
    deleteResume: deleteMutation.mutate,
    setPrimary: setPrimaryMutation.mutate,
    isUploading: uploadMutation.isPending,
  };
};