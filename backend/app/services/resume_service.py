from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import HTTPException, status, UploadFile
from typing import List, Optional, Dict, Any
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeCreate, ResumeUpdate
from app.services.parser_service import parser_service
from app.services.ai_service import ai_service
from pathlib import Path
import aiofiles
import uuid
from loguru import logger
from app.config import settings

class ResumeService:
    
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(exist_ok=True)
    
    async def create_resume(
        self,
        db: AsyncSession,
        user: User,
        resume_data: ResumeCreate,
        file: Optional[UploadFile] = None
    ) -> Resume:
        """Create new resume with optional file upload"""
        
        resume_id = str(uuid.uuid4())
        file_path = None
        parsed_data = None
        
        # Handle file upload
        if file:
            file_path = await self._save_file(file, user.id, resume_id)
            
            # Parse resume
            try:
                parsed_data = await parser_service.parse_resume(file_path)
            except Exception as e:
                logger.error(f"Resume parsing failed: {str(e)}")
                # Continue even if parsing fails
        
        # Extract skills using AI
        skills = []
        if parsed_data and parsed_data.get('raw_text'):
            try:
                skills = await ai_service.extract_skills(parsed_data['raw_text'])
            except Exception as e:
                logger.error(f"Skill extraction failed: {str(e)}")
        
        # Create resume record
        new_resume = Resume(
            id=resume_id,
            user_id=user.id,
            title=resume_data.title,
            file_path=file_path,
            file_type=file.content_type if file else None,
            raw_text=parsed_data.get('raw_text') if parsed_data else None,
            structured_data=parsed_data.get('structured_data') if parsed_data else None,
            skills=skills,
            contact_info=parsed_data.get('contact_info') if parsed_data else None,
        )
        
        db.add(new_resume)
        await db.commit()
        await db.refresh(new_resume)
        
        logger.info(f"Resume created: {new_resume.id} for user {user.id}")
        return new_resume
    
    async def get_user_resumes(
        self,
        db: AsyncSession,
        user_id: str,
        skip: int = 0,
        limit: int = 10
    ) -> List[Resume]:
        """Get all resumes for a user"""
        
        result = await db.execute(
            select(Resume)
            .where(Resume.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(Resume.created_at.desc())
        )
        
        return result.scalars().all()
    
    async def get_resume(
        self,
        db: AsyncSession,
        resume_id: str,
        user_id: str
    ) -> Resume:
        """Get specific resume"""
        
        result = await db.execute(
            select(Resume).where(
                and_(
                    Resume.id == resume_id,
                    Resume.user_id == user_id
                )
            )
        )
        
        resume = result.scalar_one_or_none()
        
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found"
            )
        
        return resume
    
    async def update_resume(
        self,
        db: AsyncSession,
        resume_id: str,
        user_id: str,
        update_data: ResumeUpdate
    ) -> Resume:
        """Update resume"""
        
        resume = await self.get_resume(db, resume_id, user_id)
        
        update_dict = update_data.model_dump(exclude_unset=True)
        
        for field, value in update_dict.items():
            setattr(resume, field, value)
        
        await db.commit()
        await db.refresh(resume)
        
        logger.info(f"Resume updated: {resume_id}")
        return resume
    
    async def delete_resume(
        self,
        db: AsyncSession,
        resume_id: str,
        user_id: str
    ) -> bool:
        """Delete resume"""
        
        resume = await self.get_resume(db, resume_id, user_id)
        
        # Delete file if exists
        if resume.file_path:
            file_path = Path(resume.file_path)
            if file_path.exists():
                file_path.unlink()
        
        await db.delete(resume)
        await db.commit()
        
        logger.info(f"Resume deleted: {resume_id}")
        return True
    
    async def set_primary_resume(
        self,
        db: AsyncSession,
        resume_id: str,
        user_id: str
    ) -> Resume:
        """Set resume as primary"""
        
        # Unset current primary
        await db.execute(
            select(Resume).where(
                and_(
                    Resume.user_id == user_id,
                    Resume.is_primary == True
                )
            )
        )
        
        current_primary = (await db.execute(
            select(Resume).where(
                and_(
                    Resume.user_id == user_id,
                    Resume.is_primary == True
                )
            )
        )).scalar_one_or_none()
        
        if current_primary:
            current_primary.is_primary = False
        
        # Set new primary
        resume = await self.get_resume(db, resume_id, user_id)
        resume.is_primary = True
        
        await db.commit()
        await db.refresh(resume)
        
        return resume
    
    async def create_resume_version(
        self,
        db: AsyncSession,
        parent_resume_id: str,
        user_id: str,
        title: str,
        customizations: Dict[str, Any]
    ) -> Resume:
        """Create a customized version of existing resume"""
        
        parent_resume = await self.get_resume(db, parent_resume_id, user_id)
        
        new_version = Resume(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title=title,
            parent_resume_id=parent_resume_id,
            version=parent_resume.version + 1,
            raw_text=parent_resume.raw_text,
            structured_data={**parent_resume.structured_data, **customizations},
            skills=parent_resume.skills,
            experience=parent_resume.experience,
            education=parent_resume.education,
            certifications=parent_resume.certifications,
            projects=parent_resume.projects,
            contact_info=parent_resume.contact_info,
        )
        
        db.add(new_version)
        await db.commit()
        await db.refresh(new_version)
        
        logger.info(f"Resume version created: {new_version.id}")
        return new_version
    
    async def _save_file(
        self,
        file: UploadFile,
        user_id: str,
        resume_id: str
    ) -> str:
        """Save uploaded file"""
        
        # Validate file
        if file.size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds {settings.MAX_UPLOAD_SIZE} bytes"
            )
        
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Allowed types: {settings.ALLOWED_EXTENSIONS}"
            )
        
        # Create user directory
        user_dir = self.upload_dir / user_id
        user_dir.mkdir(exist_ok=True)
        
        # Save file
        file_name = f"{resume_id}{file_extension}"
        file_path = user_dir / file_name
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return str(file_path)

# Singleton
resume_service = ResumeService()