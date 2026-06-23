from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    company_id = Column(String, ForeignKey("companies.id"), nullable=True)
    
    title = Column(String, nullable=False)
    company_name = Column(String)
    description = Column(Text)
    requirements = Column(Text)
    
    # Parsed Data
    required_skills = Column(JSON)
    preferred_skills = Column(JSON)
    required_experience = Column(JSON)
    education_requirements = Column(JSON)
    
    # Job Details
    location = Column(String)
    job_type = Column(String)  # Full-time, Part-time, Contract
    salary_range = Column(JSON)
    remote_option = Column(String)  # Remote, Hybrid, On-site
    
    # External Links
    job_url = Column(String)
    application_deadline = Column(DateTime(timezone=True))
    
    # Metadata
    status = Column(String, default="active")  # active, applied, closed
    priority = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    company = relationship("Company", back_populates="jobs")
    analyses = relationship("Analysis", back_populates="job", cascade="all, delete-orphan")