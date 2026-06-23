from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from typing import List, Optional, Dict, Any
from app.models.company import Company
from loguru import logger
import uuid

class CompanyService:
    
    async def create_company(
        self,
        db: AsyncSession,
        company_data: Dict[str, Any]
    ) -> Company:
        """Create or get company"""
        
        # Check if company exists
        result = await db.execute(
            select(Company).where(Company.name == company_data['name'])
        )
        existing_company = result.scalar_one_or_none()
        
        if existing_company:
            return existing_company
        
        new_company = Company(
            id=str(uuid.uuid4()),
            name=company_data['name'],
            domain=company_data.get('domain'),
            industry=company_data.get('industry'),
            size=company_data.get('size'),
            description=company_data.get('description'),
            culture=company_data.get('culture'),
            values=company_data.get('values', []),
            tech_stack=company_data.get('tech_stack', []),
            website=company_data.get('website'),
            linkedin=company_data.get('linkedin'),
            careers_page=company_data.get('careers_page'),
        )
        
        db.add(new_company)
        await db.commit()
        await db.refresh(new_company)
        
        logger.info(f"Company created: {new_company.name}")
        return new_company
    
    async def get_company(
        self,
        db: AsyncSession,
        company_id: str
    ) -> Company:
        """Get company by ID"""
        
        result = await db.execute(
            select(Company).where(Company.id == company_id)
        )
        
        company = result.scalar_one_or_none()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        return company
    
    async def get_company_by_name(
        self,
        db: AsyncSession,
        name: str
    ) -> Optional[Company]:
        """Get company by name"""
        
        result = await db.execute(
            select(Company).where(Company.name.ilike(f"%{name}%"))
        )
        
        return result.scalar_one_or_none()
    
    async def search_companies(
        self,
        db: AsyncSession,
        query: str,
        skip: int = 0,
        limit: int = 20
    ) -> List[Company]:
        """Search companies"""
        
        result = await db.execute(
            select(Company)
            .where(Company.name.ilike(f"%{query}%"))
            .offset(skip)
            .limit(limit)
        )
        
        return result.scalars().all()

# Singleton
company_service = CompanyService()