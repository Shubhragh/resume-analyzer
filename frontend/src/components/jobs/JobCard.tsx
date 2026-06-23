import { MapPin, Briefcase, ExternalLink, Trash2, TrendingUp } from 'lucide-react';
import { Job } from '@/types/job.types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
}

export const JobCard = ({ job, onDelete, onAnalyze }: JobCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
            <p className="text-muted-foreground font-medium">{job.company_name}</p>
          </div>
          <Badge
            variant={job.status === 'active' ? 'default' : 'secondary'}
            className="ml-2"
          >
            {job.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {job.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          )}
          {job.job_type && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{job.job_type}</span>
            </div>
          )}
        </div>

        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.required_skills.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.required_skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.required_skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Added {formatDate(job.created_at)}
        </p>
      </CardContent>

      <CardFooter className="border-t pt-4 gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onAnalyze(job.id)}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Analyze Match
        </Button>
        {job.job_url && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(job.job_url, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(job.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
};