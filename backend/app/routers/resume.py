from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.schemas.resume import (
    ResumeCreate, 
    ResumeUpdate, 
    ResumeResponse, 
    ResumeDetail
)
from app.services.resume_service import resume_service
from app.routers.auth import get_current_user

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    title: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload and create new resume"""
    
    resume_data = ResumeCreate(title=title)
    resume = await resume_service.create_resume(
        db, 
        current_user, 
        resume_data, 
        file
    )
    
    return resume

@router.get("/", response_model=List[ResumeResponse])
async def get_resumes(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all resumes for current user"""
    
    resumes = await resume_service.get_user_resumes(
        db, 
        current_user.id, 
        skip, 
        limit
    )
    
    return resumes

@router.get("/{resume_id}", response_model=ResumeDetail)
async def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific resume"""
    
    resume = await resume_service.get_resume(db, resume_id, current_user.id)
    return resume

@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: str,
    update_data: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update resume"""
    
    resume = await resume_service.update_resume(
        db, 
        resume_id, 
        current_user.id, 
        update_data
    )
    
    return resume

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete resume"""
    
    await resume_service.delete_resume(db, resume_id, current_user.id)
    return None

@router.post("/{resume_id}/set-primary", response_model=ResumeResponse)
async def set_primary_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Set resume as primary"""
    
    resume = await resume_service.set_primary_resume(
        db, 
        resume_id, 
        current_user.id
    )
    
    return resume

@router.post("/{resume_id}/create-version", response_model=ResumeResponse)
async def create_resume_version(
    resume_id: str,
    title: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create customized version of resume"""
    
    version = await resume_service.create_resume_version(
        db,
        resume_id,
        current_user.id,
        title,
        {}  # Customizations would come from request body
    )
    
    return version