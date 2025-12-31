"""
File Management Utilities for Life Assistant System
Handles all file operations for daily logs, templates, and knowledge base
"""

import os
import shutil
from datetime import datetime
from typing import Optional, Dict, Any, Union
import configparser


class FileManager:
    def __init__(
        self, 
        config: Optional[Dict[str, Any]] = None, 
        config_path: str = "config/config.ini"
    ) -> None:
        """
        Initialize FileManager with configuration

        Args:
            config: Configuration dictionary (preferred)
            config_path: Path to config.ini file (fallback)
        """
        if config:
            self.config_dict = config
            self.config = None
        else:
            self.config = configparser.ConfigParser()
            self.config.read(config_path)
            self.config_dict = {
                'data': dict(self.config['data']) if 'data' in self.config else {}
            }

        # Get paths from config
        if config:
            self.base_dir = self.config_dict.get('base_dir', '.')
            self.logs_dir = self.config_dict.get('logs_dir', 'data/daily_logs')
            self.vector_db_dir = self.config_dict.get('vector_db_dir', 'data/vector_db')
        elif self.config and 'data' in self.config:
            self.base_dir = self.config['data']['base_dir']
            self.logs_dir = self.config['data']['logs_dir']
            self.vector_db_dir = self.config['data']['vector_db_dir']
        else:
            # Fallback defaults
            self.base_dir = '.'
            self.logs_dir = 'data/daily_logs'
            self.vector_db_dir = 'data/vector_db'

    def get_today_dir(self) -> str:
        """
        Get today's log directory path (YYYY-MM-DD format)

        Returns:
            str: Full path to today's directory
        """
        today = datetime.now().strftime("%Y-%m-%d")
        today_dir = os.path.join(self.base_dir, self.logs_dir, today)

        # Create directory if it doesn't exist
        os.makedirs(today_dir, exist_ok=True)

        return today_dir

    def get_template_path(self, template_name: str) -> str:
        """
        Get path to a template file

        Args:
            template_name: Name of template (e.g., 'news', 'work')

        Returns:
            str: Path to template file
        """
        return os.path.join(self.base_dir, "templates", f"{template_name}_template.md")

    def save_daily_file(self, file_type: str, content: str, date: Optional[str] = None, custom_filename: Optional[str] = None) -> bool:
        """
        Save daily content to appropriate file

        Args:
            file_type: Type of file (news, outfit, work, life, review)
            content: Content to save
            date: Optional specific date (YYYY-MM-DD), defaults to today
            custom_filename: Optional custom filename (with extension)

        Returns:
            bool: Success status
        """
        try:
            if date:
                target_dir = os.path.join(self.base_dir, self.logs_dir, date)
                os.makedirs(target_dir, exist_ok=True)
            else:
                target_dir = self.get_today_dir()

            if custom_filename:
                filename = custom_filename
            else:
                filename = {
                    'news': '新闻简报.md',
                    'outfit': '今日穿搭.md',
                    'work': '今日工作.md',
                    'life': '今日生活.md',
                    'review': '今日复盘.md'
                }.get(file_type, f'{file_type}.txt')

            filepath = os.path.join(target_dir, filename)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"✅ Saved: {filepath}")
            return True

        except Exception as e:
            print(f"❌ Error saving file: {e}")
            return False

    def read_daily_file(self, file_type: str, date: Optional[str] = None) -> Optional[str]:
        """
        Read content from daily file

        Args:
            file_type: Type of file (news, outfit, work, life, review)
            date: Optional specific date (YYYY-MM-DD), defaults to today

        Returns:
            str: File content or None if file doesn't exist
        """
        try:
            if date:
                target_dir = os.path.join(self.base_dir, self.logs_dir, date)
            else:
                target_dir = self.get_today_dir()

            filename = {
                'news': '新闻简报.md',
                'outfit': '今日穿搭.md',
                'work': '今日工作.md',
                'life': '今日生活.md',
                'review': '今日复盘.md'
            }.get(file_type, f'{file_type}.txt')

            filepath = os.path.join(target_dir, filename)

            if not os.path.exists(filepath):
                return None

            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()

        except Exception as e:
            print(f"❌ Error reading file: {e}")
            return None

    def list_daily_dirs(self, limit: int = 30) -> list[str]:
        """
        List available daily log directories

        Args:
            limit: Maximum number of directories to return

        Returns:
            list: Sorted list of directory names (newest first)
        """
        try:
            logs_path = os.path.join(self.base_dir, self.logs_dir)
            if not os.path.exists(logs_path):
                return []

            dirs = [d for d in os.listdir(logs_path)
                    if os.path.isdir(os.path.join(logs_path, d))
                    and self._is_valid_date(d)]

            dirs.sort(reverse=True)
            return dirs[:limit]

        except Exception as e:
            print(f"Error listing directories: {e}")
            return []

    def _is_valid_date(self, date_str: str) -> bool:
        """Check if string is valid YYYY-MM-DD format"""
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
            return True
        except ValueError:
            return False

    def backup_data(self, backup_dir: str) -> bool:
        """
        Backup data directory

        Args:
            backup_dir: Directory to save backup

        Returns:
            bool: Success status
        """
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = os.path.join(backup_dir, f"backup_{timestamp}")

            shutil.copytree(
                os.path.join(self.base_dir, "data"),
                backup_path,
                dirs_exist_ok=True
            )

            print(f"✅ Backup created: {backup_path}")
            return True

        except Exception as e:
            print(f"❌ Backup failed: {e}")
            return False
