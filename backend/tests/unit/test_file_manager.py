"""
Unit tests for FileManager
"""
import pytest
import os
from pathlib import Path
from datetime import datetime
from utils.file_manager import FileManager


class TestFileManagerInit:
    """测试FileManager初始化"""
    
    def test_init_with_config_dict(self, test_config):
        """测试使用配置字典初始化"""
        fm = FileManager(config=test_config['data'])
        assert fm.base_dir == '.'
        assert fm.logs_dir == 'test_data/daily_logs'
        assert fm.vector_db_dir == 'test_data/vector_db'
    
    def test_init_with_config_file(self, test_config_file):
        """测试使用配置文件初始化"""
        fm = FileManager(config_path=test_config_file)
        assert fm.base_dir == '.'
        assert 'daily_logs' in fm.logs_dir


class TestGetTodayDir:
    """测试获取今日目录"""
    
    def test_get_today_dir_creates_directory(self, test_config, temp_dir):
        """测试获取今日目录会创建目录"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        today_dir = fm.get_today_dir()
        
        assert os.path.exists(today_dir)
        # 验证目录包含daily_logs
        assert 'daily_logs' in today_dir
    
    def test_get_today_dir_returns_correct_path(self, test_config, temp_dir):
        """测试返回正确的路径格式"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        
        fm = FileManager(config=config)
        today_dir = fm.get_today_dir()
        
        # 验证路径包含日期格式
        assert 'daily_logs' in today_dir
        # 验证是绝对路径或相对路径
        assert os.path.isabs(today_dir) or today_dir.startswith('.')


class TestSaveDailyFile:
    """测试保存日志文件"""
    
    def test_save_news_file(self, test_config, temp_dir):
        """测试保存新闻文件"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        content = "# 今日新闻\n\n测试内容"
        
        result = fm.save_daily_file('news', content, date='2025-01-15')
        
        assert result is True
        file_path = os.path.join(temp_dir, 'daily_logs', '2025-01-15', '新闻简报.md')
        assert os.path.exists(file_path)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            saved_content = f.read()
        assert saved_content == content
    
    def test_save_work_file(self, test_config, temp_dir):
        """测试保存工作文件"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        content = "# 今日工作\n\n- [x] 任务1"
        
        result = fm.save_daily_file('work', content, date='2025-01-15')
        
        assert result is True
        # 验证文件在正确的位置
        file_path = Path(temp_dir) / 'daily_logs' / '2025-01-15' / '今日工作.md'
        assert file_path.exists()
    
    def test_save_with_custom_filename(self, test_config, temp_dir):
        """测试使用自定义文件名保存"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        content = "自定义内容"
        
        result = fm.save_daily_file(
            'custom',
            content,
            date='2025-01-15',
            custom_filename='自定义文件.md'
        )
        
        assert result is True
        file_path = Path(temp_dir) / 'daily_logs' / '2025-01-15' / '自定义文件.md'
        assert file_path.exists()
    
    def test_save_all_file_types(self, test_config, temp_dir):
        """测试保存所有类型的文件"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        file_types = ['news', 'work', 'outfit', 'life', 'review']
        
        for file_type in file_types:
            content = f"# {file_type} content"
            result = fm.save_daily_file(file_type, content, date='2025-01-15')
            assert result is True
        
        # 验证所有文件都已创建
        log_dir = Path(temp_dir) / 'daily_logs' / '2025-01-15'
        assert len(list(log_dir.glob('*.md'))) == 5
    
    def test_save_creates_directory_if_not_exists(self, test_config, temp_dir):
        """测试保存时自动创建不存在的目录"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        
        # 确保目录不存在
        target_dir = Path(temp_dir) / 'daily_logs' / '2025-12-31'
        assert not target_dir.exists()
        
        result = fm.save_daily_file('news', 'content', date='2025-12-31')
        
        assert result is True
        assert target_dir.exists()


class TestReadDailyFile:
    """测试读取日志文件"""
    
    def test_read_existing_file(self, test_config, sample_log_files):
        """测试读取存在的文件"""
        config = test_config['data'].copy()
        config['base_dir'] = str(sample_log_files.parent.parent)
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        content = fm.read_daily_file('news', date='2025-01-15')
        
        assert content is not None
        assert '今日新闻' in content
    
    def test_read_nonexistent_file(self, test_config, temp_dir):
        """测试读取不存在的文件返回None"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        
        fm = FileManager(config=config)
        content = fm.read_daily_file('news', date='2025-01-15')
        
        assert content is None
    
    def test_read_all_file_types(self, test_config, sample_log_files):
        """测试读取所有类型的文件"""
        config = test_config['data'].copy()
        config['base_dir'] = str(sample_log_files.parent.parent)
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        
        # 读取存在的文件
        news = fm.read_daily_file('news', date='2025-01-15')
        work = fm.read_daily_file('work', date='2025-01-15')
        life = fm.read_daily_file('life', date='2025-01-15')
        
        assert news is not None
        assert work is not None
        assert life is not None


class TestListDailyDirs:
    """测试列出日志目录"""
    
    def test_list_empty_directory(self, test_config, temp_dir):
        """测试空目录返回空列表"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        
        fm = FileManager(config=config)
        dirs = fm.list_daily_dirs()
        
        assert dirs == []
    
    def test_list_with_multiple_dates(self, test_config, temp_dir):
        """测试列出多个日期目录"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        
        # 创建多个日期目录
        dates = ['2025-01-10', '2025-01-15', '2025-01-20']
        for date in dates:
            fm.save_daily_file('news', 'content', date=date)
        
        dirs = fm.list_daily_dirs()
        
        assert len(dirs) == 3
        # 验证按日期倒序排列
        assert dirs[0] == '2025-01-20'
        assert dirs[1] == '2025-01-15'
        assert dirs[2] == '2025-01-10'
    
    def test_list_with_limit(self, test_config, temp_dir):
        """测试限制返回数量"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        fm = FileManager(config=config)
        
        # 创建5个日期目录
        for i in range(1, 6):
            date = f'2025-01-{i:02d}'
            fm.save_daily_file('news', 'content', date=date)
        
        dirs = fm.list_daily_dirs(limit=3)
        
        assert len(dirs) == 3
    
    def test_list_ignores_invalid_dates(self, test_config, temp_dir):
        """测试忽略无效的日期目录"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        config['logs_dir'] = 'daily_logs'
        
        # 创建有效和无效的目录
        log_dir = Path(temp_dir) / 'daily_logs'
        log_dir.mkdir(parents=True, exist_ok=True)
        
        (log_dir / '2025-01-15').mkdir()  # 有效
        (log_dir / 'invalid-date').mkdir()  # 无效
        (log_dir / '2025-01-20').mkdir()  # 有效
        
        fm = FileManager(config=config)
        dirs = fm.list_daily_dirs()
        
        assert len(dirs) == 2
        assert 'invalid-date' not in dirs


class TestIsValidDate:
    """测试日期验证"""
    
    def test_valid_date_formats(self, test_config):
        """测试有效的日期格式"""
        fm = FileManager(config=test_config['data'])
        
        valid_dates = [
            '2025-01-15',
            '2024-12-31',
            '2025-02-28',
        ]
        
        for date in valid_dates:
            assert fm._is_valid_date(date) is True
    
    def test_invalid_date_formats(self, test_config):
        """测试无效的日期格式"""
        fm = FileManager(config=test_config['data'])
        
        invalid_dates = [
            '2025-13-01',  # 无效月份
            '2025-01-32',  # 无效日期
            '25-01-15',    # 错误格式
            'invalid',     # 完全无效
            '2025/01/15',  # 错误分隔符
        ]
        
        for date in invalid_dates:
            assert fm._is_valid_date(date) is False


class TestBackupData:
    """测试数据备份"""
    
    def test_backup_creates_directory(self, test_config, temp_dir):
        """测试备份创建目录"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        
        # 创建一些测试数据
        data_dir = Path(temp_dir) / 'data'
        data_dir.mkdir()
        (data_dir / 'test.txt').write_text('test content')
        
        fm = FileManager(config=config)
        backup_dir = Path(temp_dir) / 'backups'
        backup_dir.mkdir()
        
        result = fm.backup_data(str(backup_dir))
        
        assert result is True
        # 验证备份目录已创建
        backup_dirs = list(backup_dir.glob('backup_*'))
        assert len(backup_dirs) > 0
    
    def test_backup_preserves_content(self, test_config, temp_dir):
        """测试备份保留内容"""
        config = test_config['data'].copy()
        config['base_dir'] = temp_dir
        
        # 创建测试数据
        data_dir = Path(temp_dir) / 'data'
        data_dir.mkdir()
        test_file = data_dir / 'test.txt'
        test_content = 'important data'
        test_file.write_text(test_content)
        
        fm = FileManager(config=config)
        backup_dir = Path(temp_dir) / 'backups'
        backup_dir.mkdir()
        
        fm.backup_data(str(backup_dir))
        
        # 验证备份内容
        backup_dirs = list(backup_dir.glob('backup_*'))
        backed_up_file = backup_dirs[0] / 'test.txt'
        assert backed_up_file.read_text() == test_content


class TestGetTemplatePath:
    """测试获取模板路径"""
    
    def test_get_template_path_format(self, test_config):
        """测试模板路径格式正确"""
        fm = FileManager(config=test_config['data'])
        
        path = fm.get_template_path('news')
        
        assert 'templates' in path
        assert 'news_template.md' in path
    
    def test_get_template_path_for_all_types(self, test_config):
        """测试所有类型的模板路径"""
        fm = FileManager(config=test_config['data'])
        
        templates = ['news', 'work', 'outfit', 'life', 'review']
        
        for template in templates:
            path = fm.get_template_path(template)
            assert f'{template}_template.md' in path
