from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import redis.asyncio as redis
from app.config import settings
import time

class RateLimiter:
    def __init__(self):
        self.redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
        self.rate_limit = settings.RATE_LIMIT_PER_MINUTE
    
    async def check_rate_limit(self, request: Request, user_id: str = None):
        """Check if request exceeds rate limit"""
        
        # Use IP or user_id as identifier
        identifier = user_id or request.client.host
        key = f"rate_limit:{identifier}"
        
        current_time = int(time.time())
        window_start = current_time - 60  # 1 minute window
        
        # Add current request
        await self.redis_client.zadd(key, {str(current_time): current_time})
        
        # Remove old requests outside window
        await self.redis_client.zremrangebyscore(key, 0, window_start)
        
        # Count requests in current window
        request_count = await self.redis_client.zcard(key)
        
        # Set expiry
        await self.redis_client.expire(key, 60)
        
        if request_count > self.rate_limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later."
            )
        
        return True

rate_limiter = RateLimiter()