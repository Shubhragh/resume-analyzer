from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, Float, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    resume_id = Column(String, ForeignKey("resumes.id", ondelete="CASCADE"))
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True)
    
    # Scores (0-100)
    overall_score = Column(Float)
    ats_score = Column(Float)
    keyword_match_score = Column(Float)
    experience_match_score = Column(Float)
    skill_match_score = Column(Float)
    education_match_score = Column(Float)
    
    # Detailed Analysis
    matched_skills = Column(JSON)
    missing_skills = Column(JSON)
    matched_keywords = Column(JSON)
    missing_keywords = Column(JSON)
    
    # Strengths & Weaknesses
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    improvement_areas = Column(JSON)
    
    # Suggestions
    suggestions = Column(JSON)
    recommended_changes = Column(JSON)
    optimized_sections = Column(JSON)
    
    # AI Insights
    ai_summary = Column(Text)
    ai_recommendations = Column(JSON)
    competitive_analysis = Column(JSON)
    
    # Metadata
    analysis_type = Column(String)  # general, job-specific, company-specific
    version = Column(Integer, default=1)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    job = relationship("Job", back_populates="analyses")