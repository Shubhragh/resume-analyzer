import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Suggestion } from '@/types/analysis.types';
import { getPriorityColor, cn } from '@/lib/utils';

interface SuggestionsProps {
  suggestions: Suggestion[];
}

const PriorityIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'high':
      return <AlertCircle className="h-4 w-4" />;
    case 'medium':
      return <Info className="h-4 w-4" />;
    default:
      return <CheckCircle2 className="h-4 w-4" />;
  }
};

export const Suggestions = ({ suggestions }: SuggestionsProps) => {
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - 
           priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Improvement Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedSuggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn('rounded-full p-1', getPriorityColor(suggestion.priority))}>
                  <PriorityIcon priority={suggestion.priority} />
                </div>
                <div>
                  <h4 className="font-semibold">{suggestion.title}</h4>
                  <Badge
                    variant="outline"
                    className={cn('mt-1 text-xs', getPriorityColor(suggestion.priority))}
                  >
                    {suggestion.priority} priority
                  </Badge>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {suggestion.category}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Action Items:
              </p>
              <ul className="space-y-1.5">
                {suggestion.action_items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {suggestions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>Great job! No critical suggestions at this time.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};