from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisCreate, AnalysisResponse
from app.routers.auth import get_current_user
from app.services.resume_service import resume_service
from app.services.job_service import job_service
from app.services.ai_service import ai_service
from app.services.suggestion_service import suggestion_service
from sqlalchemy import select, and_
import uuid
from loguru import logger

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.post("/", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def create_analysis(
    analysis_data: AnalysisCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new resume analysis"""
    
    # Get resume
    resume = await resume_service.get_resume(
        db, 
        analysis_data.resume_id, 
        current_user.id
    )
    
    # Get job if provided
    job = None
    job_description = None
    if analysis_data.job_id:
        job = await job_service.get_job(
            db, 
            analysis_data.job_id, 
            current_user.id
        )
        job_description = f"{job.description}\n{job.requirements or ''}"
    
    # Perform AI analysis
    try:
        ai_analysis = await ai_service.analyze_resume(
            resume.raw_text,
            job_description
        )
    except Exception as e:
        logger.error(f"AI analysis failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Analysis failed. Please try again."
        )
    
    # Generate suggestions
    suggestions = await suggestion_service.generate_improvement_suggestions(
        db,
        resume,
        job,
        None
    )
    
    # Create analysis record
    new_analysis = Analysis(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        resume_id=resume.id,
        job_id=job.id if job else None,
        overall_score=ai_analysis.get('overall_score', 0),
        ats_score=ai_analysis.get('ats_score', 0),
        keyword_match_score=ai_analysis.get('keyword_match_score', 0),
        experience_match_score=ai_analysis.get('experience_match_score', 0),
        skill_match_score=ai_analysis.get('skill_match_score', 0),
        education_match_score=ai_analysis.get('education_match_score', 0),
        matched_skills=ai_analysis.get('matched_skills', []),
        missing_skills=ai_analysis.get('missing_skills', []),
        matched_keywords=ai_analysis.get('matched_keywords', []),
        missing_keywords=ai_analysis.get('missing_keywords', []),
        strengths=ai_analysis.get('strengths', []),
        weaknesses=ai_analysis.get('weaknesses', []),
        improvement_areas=ai_analysis.get('improvement_areas', []),
        suggestions=suggestions,
        ai_summary=ai_analysis.get('summary', ''),
        analysis_type=analysis_data.analysis_type,
    )
    
    db.add(new_analysis)
    await db.commit()
    await db.refresh(new_analysis)
    
    logger.info(f"Analysis created: {new_analysis.id}")
    
    # Format response
    from app.schemas.analysis import ScoreBreakdown, Suggestion
    
    scores = ScoreBreakdown(
        overall_score=new_analysis.overall_score,
        ats_score=new_analysis.ats_score,
        keyword_match_score=new_analysis.keyword_match_score,
        experience_match_score=new_analysis.experience_match_score,
        skill_match_score=new_analysis.skill_match_score,
        education_match_score=new_analysis.education_match_score,
    )
    
    formatted_suggestions = [
        Suggestion(**s) for s in suggestions
    ]
    
    return AnalysisResponse(
        id=new_analysis.id,
        resume_id=new_analysis.resume_id,
        job_id=new_analysis.job_id,
        scores=scores,
        matched_skills=new_analysis.matched_skills,
        missing_skills=new_analysis.missing_skills,
        strengths=new_analysis.strengths,
        weaknesses=new_analysis.weaknesses,
        suggestions=formatted_suggestions,
        ai_summary=new_analysis.ai_summary,
        analysis_type=new_analysis.analysis_type,
        created_at=new_analysis.created_at,
    )

@router.get("/", response_model=List[AnalysisResponse])
async def get_analyses(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all analyses for current user"""
    
    result = await db.execute(
        select(Analysis)
        .where(Analysis.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .order_by(Analysis.created_at.desc())
    )
    
    analyses = result.scalars().all()
    
    from app.schemas.analysis import ScoreBreakdown, Suggestion
    
    response_list = []
    for analysis in analyses:
        scores = ScoreBreakdown(
            overall_score=analysis.overall_score,
            ats_score=analysis.ats_score,
            keyword_match_score=analysis.keyword_match_score,
            experience_match_score=analysis.experience_match_score,
            skill_match_score=analysis.skill_match_score,
            education_match_score=analysis.education_match_score,
        )
        
        suggestions = [Suggestion(**s) for s in (analysis.suggestions or [])]
        
        response_list.append(AnalysisResponse(
            id=analysis.id,
            resume_id=analysis.resume_id,
            job_id=analysis.job_id,
            scores=scores,
            matched_skills=analysis.matched_skills or [],
            missing_skills=analysis.missing_skills or [],
            strengths=analysis.strengths or [],
            weaknesses=analysis.weaknesses or [],
            suggestions=suggestions,
            ai_summary=analysis.ai_summary or '',
            analysis_type=analysis.analysis_type,
            created_at=analysis.created_at,
        ))
    
    return response_list

@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific analysis"""
    
    result = await db.execute(
        select(Analysis).where(
            and_(
                Analysis.id == analysis_id,
                Analysis.user_id == current_user.id
            )
        )
    )
    
    analysis = result.scalar_one_or_none()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    from app.schemas.analysis import ScoreBreakdown, Suggestion
    
    scores = ScoreBreakdown(
        overall_score=analysis.overall_score,
        ats_score=analysis.ats_score,
        keyword_match_score=analysis.keyword_match_score,
        experience_match_score=analysis.experience_match_score,
        skill_match_score=analysis.skill_match_score,
        education_match_score=analysis.education_match_score,
    )
    
    suggestions = [Suggestion(**s) for s in (analysis.suggestions or [])]
    
    return AnalysisResponse(
        id=analysis.id,
        resume_id=analysis.resume_id,
        job_id=analysis.job_id,
        scores=scores,
        matched_skills=analysis.matched_skills or [],
        missing_skills=analysis.missing_skills or [],
        strengths=analysis.strengths or [],
        weaknesses=analysis.weaknesses or [],
        suggestions=suggestions,
        ai_summary=analysis.ai_summary or '',
        analysis_type=analysis.analysis_type,
        created_at=analysis.created_at,
    )