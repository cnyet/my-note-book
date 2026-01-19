"""
Logging utilities for AI Life Assistant
Provides structured logging with sensitive information filtering
"""

import os
import re
import logging
import structlog
from typing import Optional, Dict, Any, List
from datetime import datetime
from pathlib import Path

# 敏感信息模式
SENSITIVE_PATTERNS = [
    (re.compile(r'api[_-]?key["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_-]{10,})["\']?', re.IGNORECASE), 'api_key=***'),
    (re.compile(r'password["\']?\s*[:=]\s*["\']?([^\s"\']+)["\']?', re.IGNORECASE), 'password=***'),
    (re.compile(r'token["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_-]{10,})["\']?', re.IGNORECASE), 'token=***'),
    (re.compile(r'secret["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_-]{10,})["\']?', re.IGNORECASE), 'secret=***'),
    (re.compile(r'bearer\s+([a-zA-Z0-9_-]{10,})', re.IGNORECASE), 'bearer ***'),
]

def filter_sensitive_info(message: str) -> str:
    filtered = message
    for pattern, replacement in SENSITIVE_PATTERNS:
        filtered = pattern.sub(replacement, filtered)
    return filtered

def add_sensitive_filter(logger: Any, method_name: str, event_dict: Dict[str, Any]) -> Dict[str, Any]:
    if 'event' in event_dict and isinstance(event_dict['event'], str):
        event_dict['event'] = filter_sensitive_info(event_dict['event'])
    for key, value in event_dict.items():
        if isinstance(value, str):
            event_dict[key] = filter_sensitive_info(value)
    return event_dict

class Logger:
    _initialized: bool = False
    
    def __init__(
        self,
        name: str = "Root",
        log_dir: str = "logs",
        log_level: str = "INFO",
        environment: str = "development"
    ) -> None:
        self.name = name
        self.log_dir = Path(log_dir)
        self.log_level = log_level.upper()
        self.environment = environment
        
        if not Logger._initialized:
            self.log_dir.mkdir(parents=True, exist_ok=True)
            self._configure_structlog()
            Logger._initialized = True
        
        self.logger = structlog.get_logger(name)
    
    def _configure_structlog(self) -> None:
        logging.basicConfig(
            format="%(message)s",
            level=getattr(logging, self.log_level),
            handlers=[
                logging.StreamHandler(),
                logging.FileHandler(
                    self.log_dir / f"app_{datetime.now().strftime('%Y%m%d')}.log"
                )
            ]
        )
        
        processors: List[Any] = [
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            add_sensitive_filter,
        ]
        
        if self.environment == "development":
            processors.append(structlog.dev.ConsoleRenderer())
        else:
            processors.append(structlog.processors.JSONRenderer())
        
        structlog.configure(
            processors=processors,
            wrapper_class=structlog.stdlib.BoundLogger,
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            cache_logger_on_first_use=True,
        )
    
    def debug(self, message: str, **kwargs: Any) -> None:
        self.logger.debug(message, **kwargs)
    
    def info(self, message: str, **kwargs: Any) -> None:
        self.logger.info(message, **kwargs)
    
    def warning(self, message: str, **kwargs: Any) -> None:
        self.logger.warning(message, **kwargs)
    
    def error(self, message: str, **kwargs: Any) -> None:
        self.logger.error(message, **kwargs)
    
    def critical(self, message: str, **kwargs: Any) -> None:
        self.logger.critical(message, **kwargs)

def get_logger(name: str = "Root") -> Logger:
    return Logger(name=name)
