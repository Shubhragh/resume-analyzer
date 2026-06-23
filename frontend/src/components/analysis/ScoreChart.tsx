import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreBreakdown } from '@/types/analysis.types';

interface ScoreChartProps {
  scores: ScoreBreakdown;
}

export const ScoreChart = ({ scores }: ScoreChartProps) => {
  const data = [
    { subject: 'ATS', score: scores.ats_score, fullMark: 100 },
    { subject: 'Keywords', score: scores.keyword_match_score, fullMark: 100 },
    { subject: 'Skills', score: scores.skill_match_score, fullMark: 100 },
    { subject: 'Experience', score: scores.experience_match_score, fullMark: 100 },
    { subject: 'Education', score: scores.education_match_score, fullMark: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};