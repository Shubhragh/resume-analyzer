import { useState } from 'react';
import { Plus, Sparkles, FileText, Upload, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { ResumeCard } from '@/components/resume/ResumeCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useResume } from '@/hooks/useResume';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

export const Resumes = () => {
  const { resumes, isLoading } = useResume();
  const [uploadOpen, setUploadOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Calculate stats
  const totalResumes = resumes.length;
  const analyzedCount = resumes.filter(r => r.status === 'completed').length;
  const avgScore = resumes.length > 0 
    ? Math.round(resumes.reduce((acc, r) => acc + (r.ats_score || 0), 0) / resumes.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            <span className="text-gray-900">My </span>
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Resumes
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and optimize your resumes for different opportunities
          </p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl shadow-lg shadow-gray-900/10 h-11 px-6 group">
              <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              Upload Resume
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl border-gray-200 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Upload New Resume
              </DialogTitle>
            </DialogHeader>
            <ResumeUpload />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {totalResumes > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Resumes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalResumes}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Analyzed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analyzedCount}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{avgScore}%</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resumes Grid */}
      {totalResumes > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      ) : (
        <div className="pt-8">
          <EmptyState
            title="No resumes yet"
            description="Upload your first resume to get started with AI-powered analysis"
            actionLabel="Upload Resume"
            onAction={() => setUploadOpen(true)}
          />
        </div>
      )}
    </div>
  );
};