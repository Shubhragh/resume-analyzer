from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from fastapi import HTTPException, status
from typing import List, Optional
from app.models.job import Job
from app.models.company import Company
from app.schemas.job import JobCreate, JobUpdate
from app.services.ai_service import ai_service
from loguru import logger
import uuid

class JobService:
    
    async def create_job(
        self,
        db: AsyncSession,
        user_id: str,
        job_data: JobCreate
    ) -> Job:
        """Create new job posting"""
        
        # Extract skills and requirements using AI
        combined_text = f"{job_data.description}\n{job_data.requirements or ''}"
        
        required_skills = []
        try:
            required_skills = await ai_service.extract_skills(combined_text)
        except Exception as e:
            logger.error(f"Skill extraction failed: {str(e)}")
        
        new_job = Job(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title=job_data.title,
            company_name=job_data.company_name,
            description=job_data.description,
            requirements=job_data.requirements,
            required_skills=required_skills,
            company_id=job_data.company_id,
            location=job_data.location,
            job_type=job_data.job_type,
            remote_option=job_data.remote_option,
            job_url=job_data.job_url,
        )
        
        db.add(new_job)
        await db.commit()
        await db.refresh(new_job)
        
        logger.info(f"Job created: {new_job.id} for user {user_id}")
        return new_job
    
    async def get_user_jobs(
        self,
        db: AsyncSession,
        user_id: str,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[Job]:
        """Get all jobs for a user"""
        
        query = select(Job).where(Job.user_id == user_id)
        
        if status:
            query = query.where(Job.status == status)
        
        query = query.offset(skip).limit(limit).order_by(Job.created_at.desc())
        
        result = await db.execute(query)
        return result.scalars().all()
    
    async def get_job(
        self,
        db: AsyncSession,
        job_id: str,
        user_id: str
    ) -> Job:
        """Get specific job"""
        
        result = await db.execute(
            select(Job).where(
                and_(
                    Job.id == job_id,
                    Job.user_id == user_id
                )
            )
        )
        
        job = result.scalar_one_or_none()
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        return job
    
    async def update_job(
        self,
        db: AsyncSession,
        job_id: str,
        user_id: str,
        update_data: JobUpdate
    ) -> Job:
        """Update job"""
        
        job = await self.get_job(db, job_id, user_id)
        
        update_dict = update_data.model_dump(exclude_unset=True)
        
        for field, value in update_dict.items():
            setattr(job, field, value)
        
        await db.commit()
        await db.refresh(job)
        
        logger.info(f"Job updated: {job_id}")
        return job
    
    async def delete_job(
        self,
        db: AsyncSession,
        job_id: str,
        user_id: str
    ) -> bool:
        """Delete job"""
        
        job = await self.get_job(db, job_id, user_id)
        
        await db.delete(job)
        await db.commit()
        
        logger.info(f"Job deleted: {job_id}")
        return True
    
    async def search_jobs(
        self,
        db: AsyncSession,
        user_id: str,
        query: str,
        skip: int = 0,
        limit: int = 20
    ) -> List[Job]:
        """Search jobs by title or company"""
        
        result = await db.execute(
            select(Job).where(
                and_(
                    Job.user_id == user_id,
                    or_(
                        Job.title.ilike(f"%{query}%"),
                        Job.company_name.ilike(f"%{query}%")
                    )
                )
            )
            .offset(skip)
            .limit(limit)
        )
        
        return result.scalars().all()

# Singleton
job_service = JobService()