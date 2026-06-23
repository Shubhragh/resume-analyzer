from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.routers.auth import get_current_user

async def get_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure user is active"""
    
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    
    return current_user

async def get_premium_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure user has premium access"""
    
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium subscription required"
        )
    
    return current_user