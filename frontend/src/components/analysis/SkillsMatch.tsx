import { Check, X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillsMatchProps {
  matched: string[];
  missing: string[];
}

export const SkillsMatch = ({ matched, missing }: SkillsMatchProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Matched Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full bg-green-100 p-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <h4 className="font-semibold text-sm">Matched Skills ({matched.length})</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.length > 0 ? (
              matched.map((skill, idx) => (
                <Badge key={idx} className="bg-green-50 text-green-700 hover:bg-green-100">
                  <Check className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No matched skills</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full bg-red-100 p-1">
              <X className="h-4 w-4 text-red-600" />
            </div>
            <h4 className="font-semibold text-sm">Missing Skills ({missing.length})</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.length > 0 ? (
              missing.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-red-700 border-red-300">
                  <Plus className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-green-600">All required skills present! 🎉</p>
            )}
          </div>
        </div>

        {/* Match Rate */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Match Rate</span>
            <span className="text-sm font-bold text-primary">
              {matched.length + missing.length > 0
                ? ((matched.length / (matched.length + missing.length)) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${
                  matched.length + missing.length > 0
                    ? (matched.length / (matched.length + missing.length)) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};