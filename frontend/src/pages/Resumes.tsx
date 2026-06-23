import { useState } from 'react';
import { Plus } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and optimize your resumes for different opportunities
          </p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Resume</DialogTitle>
            </DialogHeader>
            <ResumeUpload />
          </DialogContent>
        </Dialog>
      </div>

      {resumes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No resumes yet"
          description="Upload your first resume to get started with AI-powered analysis"
          actionLabel="Upload Resume"
          onAction={() => setUploadOpen(true)}
        />
      )}
    </div>
  );
};