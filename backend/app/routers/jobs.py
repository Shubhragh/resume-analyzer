from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobDetail
from app.services.job_service import job_service
from app.routers.auth import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new job posting"""
    
    job = await job_service.create_job(db, current_user.id, job_data)
    return job

@router.get("/", response_model=List[JobResponse])
async def get_jobs(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all jobs for current user"""
    
    jobs = await job_service.get_user_jobs(
        db, 
        current_user.id, 
        status, 
        skip, 
        limit
    )
    return jobs

@router.get("/search", response_model=List[JobResponse])
async def search_jobs(
    q: str,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Search jobs by title or company"""
    
    jobs = await job_service.search_jobs(
        db, 
        current_user.id, 
        q, 
        skip, 
        limit
    )
    return jobs

@router.get("/{job_id}", response_model=JobDetail)
async def get_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific job"""
    
    job = await job_service.get_job(db, job_id, current_user.id)
    return job

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    update_data: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update job"""
    
    job = await job_service.update_job(
        db, 
        job_id, 
        current_user.id, 
        update_data
    )
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete job"""
    
    await job_service.delete_job(db, job_id, current_user.id)
    return None