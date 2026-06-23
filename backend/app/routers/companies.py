from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.company import Company
from app.services.company_service import company_service
from app.routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/companies", tags=["Companies"])

class CompanyCreate(BaseModel):
    name: str
    domain: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None
    culture: Optional[str] = None
    values: Optional[List[str]] = None
    tech_stack: Optional[List[str]] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    careers_page: Optional[str] = None

class CompanyResponse(BaseModel):
    id: str
    name: str
    domain: Optional[str]
    industry: Optional[str]
    size: Optional[str]
    description: Optional[str]
    website: Optional[str]
    
    class Config:
        from_attributes = True

@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_data: CompanyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new company"""
    
    company = await company_service.create_company(
        db, 
        company_data.model_dump()
    )
    return company

@router.get("/search", response_model=List[CompanyResponse])
async def search_companies(
    q: str,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Search companies"""
    
    companies = await company_service.search_companies(db, q, skip, limit)
    return companies

@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific company"""
    
    company = await company_service.get_company(db, company_id)
    return company