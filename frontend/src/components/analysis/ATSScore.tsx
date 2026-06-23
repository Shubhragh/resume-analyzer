import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ATSScoreProps {
  score: number;
  issues?: string[];
}

export const ATSScore = ({ score, issues = [] }: ATSScoreProps) => {
  const getStatus = () => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (score >= 60) return { text: 'Good', color: 'text-yellow-600', icon: AlertTriangle };
    return { text: 'Needs Improvement', color: 'text-red-600', icon: AlertTriangle };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          ATS Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground mb-1">ATS Score</p>
            <p className={cn('text-3xl font-bold', status.color)}>{score.toFixed(0)}%</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusIcon className={cn('h-8 w-8', status.color)} />
            <span className={cn('text-sm font-medium', status.color)}>{status.text}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Issues */}
        {issues.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Common ATS Issues:</p>
            <ul className="space-y-2">
              {issues.slice(0, 3).map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-900 mb-1">💡 ATS Tip</p>
          <p className="text-xs text-blue-800">
            Use standard section headings, avoid tables and images, and include relevant keywords
            from the job description.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};