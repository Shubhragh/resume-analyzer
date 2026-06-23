from sqlalchemy import Column, String, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    name = Column(String, unique=True, nullable=False, index=True)
    domain = Column(String)
    industry = Column(String)
    size = Column(String)  # Startup, Small, Medium, Large, Enterprise
    
    description = Column(Text)
    culture = Column(Text)
    values = Column(JSON)
    
    # Preferences
    preferred_keywords = Column(JSON)
    tech_stack = Column(JSON)
    hiring_criteria = Column(JSON)
    
    # Contact & Links
    website = Column(String)
    linkedin = Column(String)
    careers_page = Column(String)
    
    # Metadata
    logo_url = Column(String)
    location = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    jobs = relationship("Job", back_populates="company")