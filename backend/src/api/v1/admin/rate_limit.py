# backend/src/api/v1/admin/rate_limit.py
from functools import wraps
from typing import Callable
from fastapi import Request, HTTPException, status
from datetime import datetime, timedelta, timezone
import asyncio
from collections import defaultdict
from ....core.audit import audit_logger


class RateLimiter:
    """
    In-memory rate limiter using sliding window algorithm.
    For production, consider using Redis for distributed rate limiting.
    """

    def __init__(self):
        # Store request timestamps per IP: {ip: [timestamp1, timestamp2, ...]}
        self.requests: defaultdict[str, list[datetime]] = defaultdict(list)
        # Lock for thread safety
        self._lock = asyncio.Lock()

    async def is_allowed(
        self,
        key: str,
        max_requests: int,
        window_seconds: int
    ) -> bool:
        """Check if request is allowed under rate limit."""
        async with self._lock:
            now = datetime.now(timezone.utc)
            window_start = now - timedelta(seconds=window_seconds)

            # Clean old requests outside the window
            self.requests[key] = [
                ts for ts in self.requests[key]
                if ts > window_start
            ]

            # Check if limit exceeded
            if len(self.requests[key]) >= max_requests:
                return False

            # Add current request
            self.requests[key].append(now)
            return True


# Global rate limiter instance
limiter = RateLimiter()


def rate_limit(max_requests: int = 5, window_seconds: int = 60):
    """
    Rate limiting decorator for FastAPI endpoints.

    Args:
        max_requests: Maximum number of requests allowed
        window_seconds: Time window in seconds

    Example:
        @router.post("/login")
        @rate_limit(max_requests=5, window_seconds=60)
        async def login(...):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract request from kwargs or args
            request: Request | None = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request:
                # Try to get from kwargs (dependency injection)
                request = kwargs.get("request")

            if request:
                # Get client IP (handle proxy scenarios)
                forwarded = request.headers.get("X-Forwarded-For")
                if forwarded:
                    ip = forwarded.split(",")[0].strip()
                else:
                    ip = request.client.host if request.client else "unknown"

                # Check rate limit
                allowed = await limiter.is_allowed(
                    key=f"{request.url.path}:{ip}",
                    max_requests=max_requests,
                    window_seconds=window_seconds
                )

                if not allowed:
                    # Log rate limit exceeded
                    audit_logger.log_rate_limit_exceeded(
                        ip_address=ip,
                        endpoint=request.url.path
                    )

                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail=f"Rate limit exceeded. Maximum {max_requests} requests per {window_seconds} seconds.",
                        headers={
                            "Retry-After": str(window_seconds),
                            "X-RateLimit-Limit": str(max_requests),
                            "X-RateLimit-Window": str(window_seconds),
                        }
                    )

            return await func(*args, **kwargs)

        return wrapper

    return decorator
