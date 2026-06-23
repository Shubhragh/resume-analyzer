import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analysisApi } from '@/api/analysis.api';
import { CreateAnalysis } from '@/types/analysis.types';
import { toast } from 'sonner';

export const useAnalysis = (resumeId?: string) => {
  const queryClient = useQueryClient();

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: () => analysisApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: analysisApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      toast.success('Analysis completed!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Analysis failed');
    },
  });

  const createAnalysis = (data: CreateAnalysis) => {
    createMutation.mutate(data);
  };

  return {
    analyses,
    isLoading,
    createAnalysis,
    isAnalyzing: createMutation.isPending,
  };
};