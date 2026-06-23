import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { JobCard } from './JobCard';
import { Job } from '@/types/job.types';
import { EmptyState } from '@/components/common/EmptyState';

interface JobListProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
}

export const JobList = ({ jobs, onDelete, onAnalyze }: JobListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={onDelete}
              onAnalyze={onAnalyze}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description={
            searchTerm
              ? 'Try adjusting your search terms'
              : 'Add your first job to get started with resume matching'
          }
        />
      )}
    </div>
  );
};