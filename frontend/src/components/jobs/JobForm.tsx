import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateJob } from '@/types/job.types';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company_name: z.string().min(1, 'Company name is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional(),
  location: z.string().optional(),
  job_type: z.string().optional(),
  remote_option: z.string().optional(),
  job_url: z.string().url().optional().or(z.literal('')),
});

interface JobFormProps {
  onSubmit: (data: CreateJob) => void;
  isLoading?: boolean;
}

export const JobForm = ({ onSubmit, isLoading }: JobFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateJob>({
    resolver: zodResolver(jobSchema),
  });

  const handleFormSubmit = (data: CreateJob) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Senior Software Engineer"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                {...register('company_name')}
                placeholder="e.g., Google"
              />
              {errors.company_name && (
                <p className="text-xs text-destructive">{errors.company_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <textarea
              id="description"
              {...register('description')}
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Paste the full job description here..."
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (Optional)</Label>
            <textarea
              id="requirements"
              {...register('requirements')}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="List specific requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type</Label>
              <select
                id="job_type"
                {...register('job_type')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="remote_option">Remote Option</Label>
              <select
                id="remote_option"
                {...register('remote_option')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select option</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_url">Job URL</Label>
              <Input
                id="job_url"
                {...register('job_url')}
                placeholder="https://..."
                type="url"
              />
              {errors.job_url && (
                <p className="text-xs text-destructive">{errors.job_url.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Adding...' : 'Add Job'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};