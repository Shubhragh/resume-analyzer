export interface ScoreBreakdown {
  overall_score: number;
  ats_score: number;
  keyword_match_score: number;
  experience_match_score: number;
  skill_match_score: number;
  education_match_score: number;
}

export interface Suggestion {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action_items: string[];
}

export interface Analysis {
  id: string;
  resume_id: string;
  job_id?: string;
  scores: ScoreBreakdown;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: Suggestion[];
  ai_summary: string;
  analysis_type: string;
  created_at: string;
}

export interface CreateAnalysis {
  resume_id: string;
  job_id?: string;
  analysis_type?: string;
}