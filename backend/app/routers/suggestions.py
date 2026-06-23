from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
from app.database import get_db
from app.models.user import User
from app.schemas.analysis import ComparisonResult
from app.routers.auth import get_current_user
from app.services.resume_service import resume_service
from app.services.job_service import job_service
from app.services.suggestion_service import suggestion_service
from app.services.company_service import company_service
from app.services.ai_service import ai_service
from pydantic import BaseModel

router = APIRouter(prefix="/suggestions", tags=["Suggestions"])

class SuggestionResponse(BaseModel):
    category: str
    priority: str
    title: str
    description: str
    action_items: List[str]

@router.get("/resume/{resume_id}", response_model=List[SuggestionResponse])
async def get_resume_suggestions(
    resume_id: str,
    job_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get improvement suggestions for resume"""
    
    resume = await resume_service.get_resume(db, resume_id, current_user.id)
    
    job = None
    if job_id:
        job = await job_service.get_job(db, job_id, current_user.id)
    
    suggestions = await suggestion_service.generate_improvement_suggestions(
        db,
        resume,
        job,
        None
    )
    
    return suggestions

@router.get("/company/{resume_id}/{company_id}", response_model=List[SuggestionResponse])
async def get_company_suggestions(
    resume_id: str,
    company_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get company-specific customization suggestions"""
    
    resume = await resume_service.get_resume(db, resume_id, current_user.id)
    
    suggestions = await suggestion_service.generate_company_specific_suggestions(
        db,
        resume,
        company_id
    )
    
    return suggestions

@router.post("/compare", response_model=ComparisonResult)
async def compare_resume_with_job(
    resume_id: str,
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Compare resume with job description"""
    
    resume = await resume_service.get_resume(db, resume_id, current_user.id)
    job = await job_service.get_job(db, job_id, current_user.id)
    
    comparison = await ai_service.compare_resume_with_job(
        resume.raw_text,
        job.description
    )
    
    return ComparisonResult(
        resume_id=resume.id,
        job_id=job.id,
        match_percentage=comparison.get('match_percentage', 0),
        key_matches=comparison.get('strengths', []),
        gaps=[g['gap'] for g in comparison.get('gaps', [])],
        recommendations=comparison.get('recommendations', [])
    )

@router.get("/ats/{resume_id}")
async def get_ats_optimization(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get ATS optimization suggestions"""
    
    resume = await resume_service.get_resume(db, resume_id, current_user.id)
    
    ats_analysis = await ai_service.optimize_for_ats(resume.raw_text)
    
    return ats_analysis