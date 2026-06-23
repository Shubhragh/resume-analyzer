from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

class ResumeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    structured_data: Optional[Dict[str, Any]] = None
    skills: Optional[List[str]] = None
    is_primary: Optional[bool] = None

class ParsedSection(BaseModel):
    type: str
    content: str
    metadata: Optional[Dict[str, Any]] = None

class ResumeResponse(ResumeBase):
    id: str
    user_id: str
    file_path: Optional[str] = None
    file_type: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    is_primary: bool
    version: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ResumeDetail(ResumeResponse):
    raw_text: Optional[str] = None
    structured_data: Optional[Dict[str, Any]] = None
    certifications: Optional[List[Dict[str, Any]]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    contact_info: Optional[Dict[str, Any]] = None