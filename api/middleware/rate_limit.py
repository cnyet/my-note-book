"""
Rate limiting middleware for authentication endpoints

Requirements: 7.3
"""
from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import Request, HTTPException, status
from collections import defaultdict
import threading


class RateLimiter:
    """
    Simple in-memory rate limiter for failed login attempts
    
    Tracks failed login attempts per IP address and enforces
    a limit of 5 failed attempts per 15 minutes.
    """
    
    def __init__(self, max_attempts: int = 5, window_minutes: int = 15):
        self.max_attempts = max_attempts
        self.window_minutes = window_minutes
        # Store failed attempts: {ip: [(timestamp, email), ...]}
        self.failed_attempts: Dict[str, List[tuple]] = defaultdict(list)
        self.lock = threading.Lock()
    
    def _clean_old_attempts(self, ip: str) -> None:
        """Remove attempts older than the time window"""
        cutoff_time = datetime.now() - timedelta(minutes=self.window_minutes)
        
        with self.lock:
            if ip in self.failed_attempts:
                self.failed_attempts[ip] = [
                    (timestamp, email)
                    for timestamp, email in self.failed_attempts[ip]
                    if timestamp > cutoff_time
                ]
                
                # Remove IP if no recent attempts
                if not self.failed_attempts[ip]:
                    del self.failed_attempts[ip]
    
    def check_rate_limit(self, ip: str) -> None:
        """
        Check if IP has exceeded rate limit
        
        Raises HTTPException if rate limit exceeded
        """
        self._clean_old_attempts(ip)
        
        with self.lock:
            attempt_count = len(self.failed_attempts.get(ip, []))
        
        if attempt_count >= self.max_attempts:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many failed login attempts. Please try again in {self.window_minutes} minutes.",
            )
    
    def record_failed_attempt(self, ip: str, email: str) -> None:
        """Record a failed login attempt"""
        self._clean_old_attempts(ip)
        
        with self.lock:
            self.failed_attempts[ip].append((datetime.now(), email))
    
    def clear_failed_attempts(self, ip: str) -> None:
        """Clear failed attempts for an IP (called on successful login)"""
        with self.lock:
            if ip in self.failed_attempts:
                del self.failed_attempts[ip]
    
    def get_attempt_count(self, ip: str) -> int:
        """Get current attempt count for an IP"""
        self._clean_old_attempts(ip)
        
        with self.lock:
            return len(self.failed_attempts.get(ip, []))


# Global rate limiter instance
rate_limiter = RateLimiter()


def get_client_ip(request: Request) -> str:
    """
    Extract client IP address from request
    
    Handles X-Forwarded-For header for proxied requests
    """
    # Check X-Forwarded-For header (for proxied requests)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # Take the first IP in the chain
        return forwarded.split(",")[0].strip()
    
    # Fall back to direct client IP
    return request.client.host if request.client else "unknown"
