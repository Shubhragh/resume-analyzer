from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, Boolean, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    
    title = Column(String, nullable=False)
    file_path = Column(String)
    file_type = Column(String)
    
    # Parsed Content
    raw_text = Column(Text)
    structured_data = Column(JSON)  # Parsed sections
    
    # Extracted Information
    skills = Column(JSON)
    experience = Column(JSON)
    education = Column(JSON)
    certifications = Column(JSON)
    projects = Column(JSON)
    contact_info = Column(JSON)
    
    # Metadata
    is_primary = Column(Boolean, default=False)
    version = Column(Integer, default=1)
    parent_resume_id = Column(String, ForeignKey("resumes.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume", cascade="all, delete-orphan")
    versions = relationship("Resume", remote_side=[id])