import { useState } from 'react';
import { Plus, Briefcase, Sparkles, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobForm } from '@/components/jobs/JobForm';
import { JobList } from '@/components/jobs/JobList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs.api';
import { CreateJob } from '@/types/job.types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const Jobs = () => {
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: jobsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job added successfully!');
      setFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to add job');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: jobsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete job');
    },
  });

  const handleCreateJob = (data: CreateJob) => {
    createMutation.mutate(data);
  };

  const handleDeleteJob = (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAnalyzeJob = (jobId: string) => {
    navigate(`/comparison?job=${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Job Tracking
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Save job descriptions and compare them with your resumes
              </p>
            </div>
          </div>

          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl shadow-lg shadow-gray-900/10 h-12 px-6">
                <Plus className="mr-2 h-5 w-5" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Add New Job</DialogTitle>
              </DialogHeader>
              <JobForm
                onSubmit={handleCreateJob}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {jobs.length > 0 ? (
          <JobList
            jobs={jobs}
            onDelete={handleDeleteJob}
            onAnalyze={handleAnalyzeJob}
          />
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-blue-200/50 blur-2xl rounded-full"></div>
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200 flex items-center justify-center mx-auto">
                  <Briefcase className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs yet</h3>
                <p className="text-gray-500">
                  Add job descriptions to compare with your resumes and get tailored suggestions
                </p>
              </div>
              
              <Button
                size="lg"
                onClick={() => setFormOpen(true)}
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-2xl shadow-xl shadow-gray-900/10 h-14 px-8"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Job
              </Button>

              {/* Info Card */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-2 border-blue-100 rounded-2xl text-left">
                <div className="flex gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-900">Why track jobs?</h4>
                </div>
                <ul className="text-sm text-blue-800 space-y-2 ml-11">
                  <li>• Compare resumes with job requirements</li>
                  <li>• Get personalized optimization tips</li>
                  <li>• Track application-ready resumes</li>
                  <li>• Improve your match score</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};