"""
Authentication event logging

Requirements: 5.5, 7.4
"""
import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Optional


class AuthLogger:
    """
    Logger for authentication events
    
    Logs all authentication-related events to a dedicated log file
    for security auditing and monitoring.
    """
    
    def __init__(self, log_dir: str = "logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
        # Create dedicated auth log file
        self.log_file = self.log_dir / "auth_events.log"
        
        # Configure logger
        self.logger = logging.getLogger("auth_events")
        self.logger.setLevel(logging.INFO)
        
        # Remove existing handlers to avoid duplicates
        self.logger.handlers.clear()
        
        # File handler
        file_handler = logging.FileHandler(self.log_file)
        file_handler.setLevel(logging.INFO)
        
        # JSON formatter for structured logging
        formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(formatter)
        
        self.logger.addHandler(file_handler)
    
    def _log_event(
        self,
        event_type: str,
        user_id: Optional[int],
        email: Optional[str],
        ip_address: str,
        success: bool,
        details: Optional[str] = None,
    ) -> None:
        """Log an authentication event"""
        event = {
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "user_id": user_id,
            "email": email,
            "ip_address": ip_address,
            "success": success,
            "details": details,
        }
        
        log_message = json.dumps(event)
        
        if success:
            self.logger.info(log_message)
        else:
            self.logger.warning(log_message)
    
    def log_login_attempt(
        self,
        email: str,
        ip_address: str,
        success: bool,
        user_id: Optional[int] = None,
        details: Optional[str] = None,
    ) -> None:
        """Log a login attempt"""
        self._log_event(
            event_type="login",
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=success,
            details=details,
        )
    
    def log_registration(
        self,
        email: str,
        ip_address: str,
        success: bool,
        user_id: Optional[int] = None,
        details: Optional[str] = None,
    ) -> None:
        """Log a registration attempt"""
        self._log_event(
            event_type="registration",
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=success,
            details=details,
        )
    
    def log_logout(
        self,
        user_id: int,
        email: str,
        ip_address: str,
    ) -> None:
        """Log a logout event"""
        self._log_event(
            event_type="logout",
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=True,
        )
    
    def log_profile_update(
        self,
        user_id: int,
        email: str,
        ip_address: str,
        changes: str,
        success: bool,
        details: Optional[str] = None,
    ) -> None:
        """Log a profile update"""
        self._log_event(
            event_type="profile_update",
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=success,
            details=f"Changes: {changes}" + (f" - {details}" if details else ""),
        )
    
    def log_password_change(
        self,
        user_id: int,
        email: str,
        ip_address: str,
        success: bool,
        details: Optional[str] = None,
    ) -> None:
        """Log a password change"""
        self._log_event(
            event_type="password_change",
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=success,
            details=details,
        )


# Global auth logger instance
auth_logger = AuthLogger()
