from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

class AnalysisCreate(BaseModel):
    resume_id: str
    job_id: Optional[str] = None
    analysis_type: str = "general"

class ScoreBreakdown(BaseModel):
    overall_score: float = Field(..., ge=0, le=100)
    ats_score: float = Field(..., ge=0, le=100)
    keyword_match_score: float = Field(..., ge=0, le=100)
    experience_match_score: float = Field(..., ge=0, le=100)
    skill_match_score: float = Field(..., ge=0, le=100)
    education_match_score: float = Field(..., ge=0, le=100)

class Suggestion(BaseModel):
    category: str
    priority: str  # high, medium, low
    title: str
    description: str
    action_items: List[str]

class AnalysisResponse(BaseModel):
    id: str
    resume_id: str
    job_id: Optional[str] = None
    scores: ScoreBreakdown
    matched_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[Suggestion]
    ai_summary: str
    analysis_type: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ComparisonResult(BaseModel):
    resume_id: str
    job_id: str
    match_percentage: float
    key_matches: List[str]
    gaps: List[str]
    recommendations: List[str]