"""
Unit tests for logging system
Tests Logger, LogRotator, and sensitive information filtering
"""

import pytest
import tempfile
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from utils.logger import Logger, filter_sensitive_info, get_logger
from utils.log_rotator import LogRotator
from utils.log_config import LogConfig, Environment


class TestSensitiveInfoFilter:
    """Tests for sensitive information filtering"""
    
    def test_filter_api_key(self):
        """测试过滤API key"""
        message = "Using api_key=sk-1234567890abcdef for authentication"
        filtered = filter_sensitive_info(message)
        assert "sk-1234567890abcdef" not in filtered
        assert "api_key=***" in filtered
    
    def test_filter_password(self):
        """测试过滤密码"""
        message = 'Login with password="mySecretPass123"'
        filtered = filter_sensitive_info(message)
        assert "mySecretPass123" not in filtered
        assert "password=***" in filtered
    
    def test_filter_token(self):
        """测试过滤token"""
        message = "Authorization token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
        filtered = filter_sensitive_info(message)
        assert "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" not in filtered
        assert "token=***" in filtered
    
    def test_filter_bearer_token(self):
        """测试过滤Bearer token"""
        message = "Authorization: Bearer abc123def456ghi789"
        filtered = filter_sensitive_info(message)
        assert "abc123def456ghi789" not in filtered
        assert "bearer ***" in filtered.lower()
    
    def test_no_sensitive_info(self):
        """测试无敏感信息的消息"""
        message = "This is a normal log message"
        filtered = filter_sensitive_info(message)
        assert filtered == message


class TestLogger:
    """Tests for Logger class"""
    
    def setup_method(self):
        """每个测试前重置Logger"""
        Logger.reset()
        self.temp_dir = tempfile.mkdtemp()
    
    def teardown_method(self):
        """每个测试后清理"""
        Logger.reset()
        if Path(self.temp_dir).exists():
            shutil.rmtree(self.temp_dir)
    
    def test_logger_singleton(self):
        """测试Logger单例模式"""
        logger1 = Logger.get_logger(log_dir=self.temp_dir)
        logger2 = Logger.get_logger(log_dir=self.temp_dir)
        assert logger1 is logger2
    
    def test_logger_initialization(self):
        """测试Logger初始化"""
        logger = Logger(log_dir=self.temp_dir, log_level="DEBUG")
        assert logger.log_dir == Path(self.temp_dir)
        assert logger.log_level == "DEBUG"
        assert logger.log_dir.exists()
    
    def test_log_levels(self):
        """测试不同日志级别"""
        logger = Logger(log_dir=self.temp_dir, log_level="DEBUG")
        
        # 这些不应该抛出异常
        logger.debug("Debug message")
        logger.info("Info message")
        logger.warning("Warning message")
        logger.error("Error message")
        logger.critical("Critical message")
    
    def test_log_with_context(self):
        """测试带上下文的日志"""
        logger = Logger(log_dir=self.temp_dir)
        logger.info("User action", user_id=123, action="login")
    
    def test_get_logger_convenience(self):
        """测试便捷函数"""
        logger = get_logger(log_dir=self.temp_dir)
        assert isinstance(logger, Logger)


class TestLogRotator:
    """Tests for LogRotator class"""
    
    def setup_method(self):
        """每个测试前创建临时目录"""
        self.temp_dir = tempfile.mkdtemp()
        self.rotator = LogRotator(
            log_dir=self.temp_dir,
            max_size_mb=1,
            max_age_days=7,
            backup_count=5
        )
    
    def teardown_method(self):
        """每个测试后清理"""
        if Path(self.temp_dir).exists():
            shutil.rmtree(self.temp_dir)
    
    def test_rotator_initialization(self):
        """测试LogRotator初始化"""
        assert self.rotator.log_dir == Path(self.temp_dir)
        assert self.rotator.max_size_bytes == 1 * 1024 * 1024
        assert self.rotator.max_age_days == 7
    
    def test_should_rotate_by_size(self):
        """测试按大小判断是否轮转"""
        log_file = Path(self.temp_dir) / "test.log"
        
        # 创建小文件
        log_file.write_text("small content")
        assert not self.rotator.should_rotate_by_size(log_file)
        
        # 创建大文件（超过1MB）
        log_file.write_bytes(b"x" * (2 * 1024 * 1024))
        assert self.rotator.should_rotate_by_size(log_file)
    
    def test_should_rotate_by_time(self):
        """测试按时间判断是否轮转"""
        # 今天的日志
        today = datetime.now().strftime('%Y%m%d')
        log_file = Path(self.temp_dir) / f"app_{today}.log"
        log_file.write_text("content")
        assert not self.rotator.should_rotate_by_time(log_file)
        
        # 昨天的日志
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y%m%d')
        old_log = Path(self.temp_dir) / f"app_{yesterday}.log"
        old_log.write_text("old content")
        assert self.rotator.should_rotate_by_time(old_log)
    
    def test_rotate_log(self):
        """测试日志轮转"""
        log_file = Path(self.temp_dir) / "test.log"
        log_file.write_text("test content")
        
        rotated = self.rotator.rotate_log(log_file)
        
        assert rotated is not None
        assert not log_file.exists()
        assert rotated.exists()
    
    def test_cleanup_old_logs(self):
        """测试清理旧日志"""
        # 创建旧日志文件
        old_date = datetime.now() - timedelta(days=10)
        old_log = Path(self.temp_dir) / "old.log"
        old_log.write_text("old")
        
        # 修改文件时间
        old_timestamp = old_date.timestamp()
        import os
        os.utime(old_log, (old_timestamp, old_timestamp))
        
        deleted = self.rotator.cleanup_old_logs()
        assert len(deleted) > 0
        assert not old_log.exists()
    
    def test_limit_backup_count(self):
        """测试限制备份数量"""
        # 创建多个备份文件
        for i in range(10):
            backup = Path(self.temp_dir) / f"app_2024010{i}_120000.log"
            backup.write_text(f"backup {i}")
        
        deleted = self.rotator.limit_backup_count()
        
        # 应该删除超出backup_count的文件
        remaining = list(Path(self.temp_dir).glob("*.log"))
        assert len(remaining) <= self.rotator.backup_count
    
    def test_get_log_stats(self):
        """测试获取日志统计"""
        # 创建一些日志文件
        for i in range(3):
            log = Path(self.temp_dir) / f"test{i}.log"
            log.write_text("x" * 1000)
        
        stats = self.rotator.get_log_stats()
        
        assert stats['total_files'] == 3
        assert stats['total_size_mb'] > 0
        assert stats['log_dir'] == str(self.rotator.log_dir)


class TestLogConfig:
    """Tests for LogConfig class"""
    
    def test_get_development_config(self):
        """测试获取开发环境配置"""
        config = LogConfig.get_config(Environment.DEVELOPMENT)
        assert config['log_level'] == 'DEBUG'
        assert config['colored_output'] is True
        assert config['json_format'] is False
    
    def test_get_production_config(self):
        """测试获取生产环境配置"""
        config = LogConfig.get_config(Environment.PRODUCTION)
        assert config['log_level'] == 'INFO'
        assert config['json_format'] is True
        assert config['compress'] is True
    
    def test_get_testing_config(self):
        """测试获取测试环境配置"""
        config = LogConfig.get_config(Environment.TESTING)
        assert config['log_level'] == 'WARNING'
        assert config['file_output'] is False
    
    def test_get_log_level(self):
        """测试获取日志级别"""
        level = LogConfig.get_log_level(Environment.DEVELOPMENT)
        assert level == 'DEBUG'
        
        level = LogConfig.get_log_level(Environment.PRODUCTION)
        assert level == 'INFO'
    
    def test_should_use_json(self):
        """测试是否使用JSON格式"""
        assert not LogConfig.should_use_json(Environment.DEVELOPMENT)
        assert LogConfig.should_use_json(Environment.PRODUCTION)
    
    def test_should_compress(self):
        """测试是否压缩"""
        assert not LogConfig.should_compress(Environment.DEVELOPMENT)
        assert LogConfig.should_compress(Environment.PRODUCTION)
