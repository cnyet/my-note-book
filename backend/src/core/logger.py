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
    """
    过滤消息中的敏感信息
    
    Args:
        message: 原始消息
        
    Returns:
        过滤后的消息
    """
    filtered = message
    for pattern, replacement in SENSITIVE_PATTERNS:
        filtered = pattern.sub(replacement, filtered)
    return filtered


def add_sensitive_filter(
    logger: Any, 
    method_name: str, 
    event_dict: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Structlog处理器：过滤事件字典中的敏感信息
    
    Args:
        logger: Logger实例
        method_name: 方法名
        event_dict: 事件字典
        
    Returns:
        过滤后的事件字典
    """
    if 'event' in event_dict and isinstance(event_dict['event'], str):
        event_dict['event'] = filter_sensitive_info(event_dict['event'])
    
    # 过滤其他字段
    for key, value in event_dict.items():
        if isinstance(value, str):
            event_dict[key] = filter_sensitive_info(value)
    
    return event_dict


class Logger:
    """
    统一日志管理器
    
    提供结构化日志、敏感信息过滤、日志轮转等功能
    """
    
    _instance: Optional['Logger'] = None
    _initialized: bool = False
    
    def __init__(
        self,
        log_dir: str = "logs",
        log_level: str = "INFO",
        environment: str = "development"
    ) -> None:
        """
        初始化日志管理器
        
        Args:
            log_dir: 日志目录
            log_level: 日志级别
            environment: 环境（development/production）
        """
        # 避免重复初始化
        if Logger._initialized:
            return
        
        self.log_dir = Path(log_dir)
        self.log_level = log_level.upper()
        self.environment = environment
        
        # 创建日志目录
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
        # 配置structlog
        self._configure_structlog()
        
        # 获取logger
        self.logger = structlog.get_logger()
        
        Logger._initialized = True
    
    def _configure_structlog(self) -> None:
        """配置structlog"""
        # 配置标准库logging
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
        
        # 配置structlog处理器链
        processors: List[Any] = [
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            add_sensitive_filter,  # 敏感信息过滤
        ]
        
        # 开发环境使用彩色输出
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
        """记录DEBUG级别日志"""
        self.logger.debug(message, **kwargs)
    
    def info(self, message: str, **kwargs: Any) -> None:
        """记录INFO级别日志"""
        self.logger.info(message, **kwargs)
    
    def warning(self, message: str, **kwargs: Any) -> None:
        """记录WARNING级别日志"""
        self.logger.warning(message, **kwargs)
    
    def error(self, message: str, **kwargs: Any) -> None:
        """记录ERROR级别日志"""
        self.logger.error(message, **kwargs)
    
    def critical(self, message: str, **kwargs: Any) -> None:
        """记录CRITICAL级别日志"""
        self.logger.critical(message, **kwargs)
    
    def log(self, level: str, message: str, **kwargs: Any) -> None:
        """
        通用日志记录方法
        
        Args:
            level: 日志级别
            message: 日志消息
            **kwargs: 额外的上下文信息
        """
        level_method = getattr(self.logger, level.lower(), self.logger.info)
        level_method(message, **kwargs)
    
    @classmethod
    def get_logger(
        cls,
        log_dir: str = "logs",
        log_level: str = "INFO",
        environment: str = "development"
    ) -> 'Logger':
        """
        获取Logger实例（工厂方法）
        
        Args:
            log_dir: 日志目录
            log_level: 日志级别
            environment: 环境
            
        Returns:
            Logger实例
        """
        if cls._instance is None:
            cls._instance = cls(log_dir, log_level, environment)
        return cls._instance
    
    @classmethod
    def reset(cls) -> None:
        """重置Logger实例（主要用于测试）"""
        cls._instance = None
        cls._initialized = False


# 便捷函数
def get_logger(
    log_dir: str = "logs",
    log_level: str = "INFO",
    environment: str = "development"
) -> Logger:
    """
    获取Logger实例的便捷函数
    
    Args:
        log_dir: 日志目录
        log_level: 日志级别
        environment: 环境
        
    Returns:
        Logger实例
    """
    return Logger.get_logger(log_dir, log_level, environment)
