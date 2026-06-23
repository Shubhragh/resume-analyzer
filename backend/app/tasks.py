from celery import Task
from app.celery_app import celery_app
from app.database import AsyncSessionLocal
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.services.ai_service import ai_service
from app.services.parser_service import parser_service
from loguru import logger
from datetime import datetime, timedelta
from pathlib import Path
import asyncio

class DatabaseTask(Task):
    """Base task with database session"""
    _db = None
    
    @property
    def db(self):
        if self._db is None:
            self._db = AsyncSessionLocal()
        return self._db
    
    def after_return(self, *args, **kwargs):
        if self._db is not None:
            asyncio.run(self._db.close())
            self._db = None

@celery_app.task(name='app.tasks.process_resume_upload', base=DatabaseTask)
def process_resume_upload(resume_id: str):
    """Process uploaded resume in background"""
    
    async def _process():
        async with AsyncSessionLocal() as db:
            try:
                from sqlalchemy import select
                result = await db.execute(
                    select(Resume).where(Resume.id == resume_id)
                )
                resume = result.scalar_one_or_none()
                
                if not resume or not resume.file_path:
                    logger.error(f"Resume not found: {resume_id}")
                    return
                
                # Parse resume
                parsed_data = await parser_service.parse_resume(resume.file_path)
                
                # Extract skills using AI
                skills = await ai_service.extract_skills(parsed_data['raw_text'])
                
                # Update resume
                resume.raw_text = parsed_data.get('raw_text')
                resume.structured_data = parsed_data.get('structured_data')
                resume.skills = skills
                resume.contact_info = parsed_data.get('contact_info')
                
                await db.commit()
                
                logger.info(f"Resume processed successfully: {resume_id}")
                
            except Exception as e:
                logger.error(f"Resume processing failed: {str(e)}")
                await db.rollback()
    
    asyncio.run(_process())

@celery_app.task(name='app.tasks.generate_deep_analysis', base=DatabaseTask)
def generate_deep_analysis(resume_id: str, job_id: str = None):
    """Generate comprehensive AI analysis in background"""
    
    async def _analyze():
        async with AsyncSessionLocal() as db:
            try:
                from sqlalchemy import select
                
                # Get resume
                result = await db.execute(
                    select(Resume).where(Resume.id == resume_id)
                )
                resume = result.scalar_one_or_none()
                
                if not resume:
                    logger.error(f"Resume not found: {resume_id}")
                    return
                
                # Get job if provided
                job_description = None
                if job_id:
                    from app.models.job import Job
                    result = await db.execute(
                        select(Job).where(Job.id == job_id)
                    )
                    job = result.scalar_one_or_none()
                    if job:
                        job_description = f"{job.description}\n{job.requirements or ''}"
                
                # Perform AI analysis
                ai_analysis = await ai_service.analyze_resume(
                    resume.raw_text,
                    job_description
                )
                
                # ATS optimization
                ats_analysis = await ai_service.optimize_for_ats(resume.raw_text)
                
                # Create analysis record
                import uuid
                new_analysis = Analysis(
                    id=str(uuid.uuid4()),
                    user_id=resume.user_id,
                    resume_id=resume.id,
                    job_id=job_id,
                    overall_score=ai_analysis.get('overall_score', 0),
                    ats_score=ats_analysis.get('ats_score', 0),
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
                    ai_summary=ai_analysis.get('summary', ''),
                    analysis_type='comprehensive',
                )
                
                db.add(new_analysis)
                await db.commit()
                
                logger.info(f"Deep analysis completed: {resume_id}")
                
            except Exception as e:
                logger.error(f"Deep analysis failed: {str(e)}")
                await db.rollback()
    
    asyncio.run(_analyze())

@celery_app.task(name='app.tasks.cleanup_old_files')
def cleanup_old_files():
    """Clean up old uploaded files (30+ days)"""
    
    async def _cleanup():
        async with AsyncSessionLocal() as db:
            try:
                from sqlalchemy import select, and_
                from app.config import settings
                
                cutoff_date = datetime.utcnow() - timedelta(days=30)
                
                result = await db.execute(
                    select(Resume).where(
                        and_(
                            Resume.created_at < cutoff_date,
                            Resume.is_primary == False
                        )
                    )
                )
                
                old_resumes = result.scalars().all()
                
                for resume in old_resumes:
                    if resume.file_path:
                        file_path = Path(resume.file_path)
                        if file_path.exists():
                            file_path.unlink()
                            logger.info(f"Deleted old file: {resume.file_path}")
                
                logger.info(f"Cleaned up {len(old_resumes)} old files")
                
            except Exception as e:
                logger.error(f"Cleanup failed: {str(e)}")
    
    asyncio.run(_cleanup())

@celery_app.task(name='app.tasks.update_analytics')
def update_analytics():
    """Update system analytics and metrics"""
    
    async def _update():
        async with AsyncSessionLocal() as db:
            try:
                from sqlalchemy import select, func
                
                # Count total users
                result = await db.execute(
                    select(func.count()).select_from(Resume)
                )
                total_resumes = result.scalar()
                
                result = await db.execute(
                    select(func.count()).select_from(Analysis)
                )
                total_analyses = result.scalar()
                
                logger.info(f"Analytics: {total_resumes} resumes, {total_analyses} analyses")
                
                # Store in Redis or database analytics table
                # Implementation depends on your analytics requirements
                
            except Exception as e:
                logger.error(f"Analytics update failed: {str(e)}")
    
    asyncio.run(_update())

@celery_app.task(name='app.tasks.send_email_notification')
def send_email_notification(user_email: str, subject: str, body: str):
    """Send email notification"""
    
    from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
    from app.config import settings
    
    async def _send():
        try:
            conf = ConnectionConfig(
                MAIL_USERNAME=settings.MAIL_USERNAME,
                MAIL_PASSWORD=settings.MAIL_PASSWORD,
                MAIL_FROM=settings.MAIL_FROM,
                MAIL_PORT=settings.MAIL_PORT,
                MAIL_SERVER=settings.MAIL_SERVER,
                MAIL_STARTTLS=settings.MAIL_TLS,
                MAIL_SSL_TLS=settings.MAIL_SSL,
                USE_CREDENTIALS=True
            )
            
            message = MessageSchema(
                subject=subject,
                recipients=[user_email],
                body=body,
                subtype="html"
            )
            
            fm = FastMail(conf)
            await fm.send_message(message)
            
            logger.info(f"Email sent to: {user_email}")
            
        except Exception as e:
            logger.error(f"Email sending failed: {str(e)}")
    
    asyncio.run(_send())