import { FileText, Star, Trash2, Eye } from 'lucide-react';
import { Resume } from '@/types/resume.types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useResume } from '@/hooks/useResume';
import { useNavigate } from 'react-router-dom';

interface ResumeCardProps {
  resume: Resume;
}

export const ResumeCard = ({ resume }: ResumeCardProps) => {
  const navigate = useNavigate();
  const { deleteResume, setPrimary } = useResume();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/resumes/${resume.id}`);
  };

  const handleSetPrimary = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPrimary(resume.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteResume(resume.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{resume.title}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(resume.created_at)}
              </p>
            </div>
          </div>
          {resume.is_primary && (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              <Star className="h-3 w-3 mr-1" />
              Primary
            </Badge>
          )}
        </div>

        {resume.skills && resume.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resume.skills.slice(0, 4).map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {resume.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{resume.skills.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleView}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        {!resume.is_primary && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetPrimary}
          >
            <Star className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
};