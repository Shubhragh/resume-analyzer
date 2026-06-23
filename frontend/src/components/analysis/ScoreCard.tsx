import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getScoreColor, getScoreBgColor, cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  score: number;
  previousScore?: number;
  icon?: React.ReactNode;
}

export const ScoreCard = ({ title, score, previousScore, icon }: ScoreCardProps) => {
  const trend = previousScore ? score - previousScore : 0;
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <div className={cn('text-3xl font-bold', getScoreColor(score))}>
              {score.toFixed(1)}
            </div>
            <span className="text-muted-foreground text-sm">/100</span>
          </div>
          {previousScore && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
              )}
            >
              <TrendIcon className="h-4 w-4" />
              {Math.abs(trend).toFixed(1)}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-500 rounded-full',
              score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};