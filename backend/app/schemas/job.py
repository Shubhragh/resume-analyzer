from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from typing import Optional, List, Dict, Any

class JobBase(BaseModel):
    title: str = Field(..., min_length=1)
    company_name: str
    description: str
    requirements: Optional[str] = None

class JobCreate(JobBase):
    company_id: Optional[str] = None
    job_url: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    remote_option: Optional[str] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[float] = None

class JobResponse(JobBase):
    id: str
    user_id: str
    company_id: Optional[str] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class JobDetail(JobResponse):
    required_experience: Optional[Dict[str, Any]] = None
    education_requirements: Optional[List[str]] = None
    salary_range: Optional[Dict[str, Any]] = None
    job_url: Optional[str] = None
    application_deadline: Optional[datetime] = None