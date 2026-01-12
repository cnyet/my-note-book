"""
Environment-specific logging configuration
"""

import os
from typing import Dict, Any
from enum import Enum


class Environment(str, Enum):
    """环境枚举"""
    DEVELOPMENT = "development"
    PRODUCTION = "production"
    TESTING = "testing"


class LogConfig:
    """日志配置管理"""
    
    # 开发环境配置
    DEVELOPMENT_CONFIG: Dict[str, Any] = {
        'log_level': 'DEBUG',
        'log_dir': 'logs',
        'console_output': True,
        'file_output': True,
        'colored_output': True,
        'json_format': False,
        'max_size_mb': 10,
        'max_age_days': 7,
        'backup_count': 5,
        'compress': False,
    }
    
    # 生产环境配置
    PRODUCTION_CONFIG: Dict[str, Any] = {
        'log_level': 'INFO',
        'log_dir': 'logs',
        'console_output': False,
        'file_output': True,
        'colored_output': False,
        'json_format': True,
        'max_size_mb': 50,
        'max_age_days': 30,
        'backup_count': 20,
        'compress': True,
    }
    
    # 测试环境配置
    TESTING_CONFIG: Dict[str, Any] = {
        'log_level': 'WARNING',
        'log_dir': 'logs/test',
        'console_output': False,
        'file_output': False,
        'colored_output': False,
        'json_format': False,
        'max_size_mb': 5,
        'max_age_days': 1,
        'backup_count': 2,
        'compress': False,
    }
    
    @classmethod
    def get_config(cls, environment: str = None) -> Dict[str, Any]:
        """
        获取指定环境的配置
        
        Args:
            environment: 环境名称，如果为None则从环境变量读取
            
        Returns:
            配置字典
        """
        if environment is None:
            environment = os.getenv('APP_ENV', 'development')
        
        env = environment.lower()
        
        if env == Environment.PRODUCTION:
            return cls.PRODUCTION_CONFIG.copy()
        elif env == Environment.TESTING:
            return cls.TESTING_CONFIG.copy()
        else:
            return cls.DEVELOPMENT_CONFIG.copy()
    
    @classmethod
    def get_log_level(cls, environment: str = None) -> str:
        """获取日志级别"""
        config = cls.get_config(environment)
        return config['log_level']
    
    @classmethod
    def get_log_dir(cls, environment: str = None) -> str:
        """获取日志目录"""
        config = cls.get_config(environment)
        return config['log_dir']
    
    @classmethod
    def should_use_json(cls, environment: str = None) -> bool:
        """是否使用JSON格式"""
        config = cls.get_config(environment)
        return config['json_format']
    
    @classmethod
    def should_compress(cls, environment: str = None) -> bool:
        """是否压缩日志"""
        config = cls.get_config(environment)
        return config['compress']
