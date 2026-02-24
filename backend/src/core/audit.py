# backend/src/core/audit.py
"""
Audit logging for security events.
Tracks: logins, failed attempts, password changes, admin actions.
"""
import logging
from datetime import datetime, timezone
from typing import Optional
from enum import Enum
import json


class AuditEventType(str, Enum):
    """Types of audit events."""
    LOGIN_SUCCESS = "login_success"
    LOGIN_FAILED = "login_failed"
    LOGOUT = "logout"
    PASSWORD_CHANGE = "password_change"
    PASSWORD_RESET = "password_reset"
    ADMIN_CREATED = "admin_created"
    ADMIN_DELETED = "admin_deleted"
    PERMISSION_DENIED = "permission_denied"
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"


class AuditLogger:
    """
    Audit logger for security events.
    Logs to file with structured JSON format.
    """

    def __init__(self, log_file: str = "logs/audit.log"):
        self.logger = logging.getLogger("audit")
        self.logger.setLevel(logging.INFO)

        # Prevent duplicate handlers
        if not self.logger.handlers:
            # File handler with JSON format
            handler = logging.FileHandler(log_file)
            handler.setFormatter(JSONFormatter())
            self.logger.addHandler(handler)

    def log(
        self,
        event_type: AuditEventType,
        username: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        success: bool = True,
        details: Optional[dict] = None,
    ):
        """Log an audit event."""
        event = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": event_type.value,
            "username": username,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "success": success,
            "details": details or {},
        }

        self.logger.info(json.dumps(event))

    def log_login_success(self, username: str, ip_address: str, user_agent: str = None):
        """Log successful login."""
        self.log(
            AuditEventType.LOGIN_SUCCESS,
            username=username,
            ip_address=ip_address,
            user_agent=user_agent,
            success=True
        )

    def log_login_failed(self, username: str, ip_address: str, user_agent: str = None, reason: str = "invalid_credentials"):
        """Log failed login attempt."""
        self.log(
            AuditEventType.LOGIN_FAILED,
            username=username,
            ip_address=ip_address,
            user_agent=user_agent,
            success=False,
            details={"reason": reason}
        )

    def log_rate_limit_exceeded(self, ip_address: str, endpoint: str):
        """Log rate limit exceeded."""
        self.log(
            AuditEventType.RATE_LIMIT_EXCEEDED,
            ip_address=ip_address,
            success=False,
            details={"endpoint": endpoint}
        )


class JSONFormatter(logging.Formatter):
    """JSON formatter for audit logs."""

    def format(self, record):
        log_entry = json.loads(record.getMessage())
        return json.dumps(log_entry)


# Global audit logger instance
audit_logger = AuditLogger()
