"""
File Repository for reading daily log files.
Handles file system operations for secretary content.
"""
from pathlib import Path
from datetime import date, datetime
from typing import Optional, List, Dict
import logging

logger = logging.getLogger(__name__)

# Map secretary types to Chinese file names
SECRETARY_FILE_MAP = {
    "news": "新闻简报.md",
    "work": "今日工作.md",
    "outfit": "今日穿搭.md",
    "life": "今日生活.md",
    "review": "今日复盘.md"
}

ALLOWED_SECRETARIES = list(SECRETARY_FILE_MAP.keys())


class FileNotFoundError(Exception):
    """Raised when a daily log file is not found."""
    pass


class FileReadError(Exception):
    """Raised when a file cannot be read."""
    pass


class FileRepository:
    """Repository for file system operations on daily logs."""
    
    def __init__(self, data_dir: str = "data/daily_logs"):
        self.data_dir = Path(data_dir)
        if not self.data_dir.exists():
            logger.warning(f"Data directory does not exist: {self.data_dir}")
    
    def _get_file_path(self, secretary: str, target_date: date) -> Path:
        """
        Get the file path for a secretary's log on a specific date.
        
        Args:
            secretary: Secretary type (news, work, outfit, life, review)
            target_date: Date of the log
            
        Returns:
            Path to the log file
            
        Raises:
            ValueError: If secretary type is invalid
        """
        if secretary not in ALLOWED_SECRETARIES:
            raise ValueError(f"Invalid secretary type: {secretary}")
        
        date_str = target_date.strftime("%Y-%m-%d")
        filename = SECRETARY_FILE_MAP[secretary]
        return self.data_dir / date_str / filename
    
    def read_content(self, secretary: str, target_date: date) -> str:
        """
        Read the content of a secretary's log file.
        
        Args:
            secretary: Secretary type
            target_date: Date of the log
            
        Returns:
            Content of the file as string
            
        Raises:
            FileNotFoundError: If file doesn't exist
            FileReadError: If file cannot be read
        """
        file_path = self._get_file_path(secretary, target_date)
        
        if not file_path.exists():
            raise FileNotFoundError(
                f"No {secretary} log found for {target_date}"
            )
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            logger.info(f"Read {secretary} log for {target_date}")
            return content
        except Exception as e:
            logger.error(f"Failed to read {file_path}: {e}")
            raise FileReadError(f"Failed to read file: {e}")
    
    def file_exists(self, secretary: str, target_date: date) -> bool:
        """
        Check if a log file exists for a specific date.
        
        Args:
            secretary: Secretary type
            target_date: Date to check
            
        Returns:
            True if file exists, False otherwise
        """
        try:
            file_path = self._get_file_path(secretary, target_date)
            return file_path.exists()
        except ValueError:
            return False
    
    def list_available_dates(self, secretary: str) -> List[date]:
        """
        List all dates that have content for a secretary.
        
        Args:
            secretary: Secretary type
            
        Returns:
            List of dates with available content
        """
        if secretary not in ALLOWED_SECRETARIES:
            return []
        
        available_dates = []
        filename = SECRETARY_FILE_MAP[secretary]
        
        # Iterate through date directories
        if not self.data_dir.exists():
            return []
        
        for date_dir in self.data_dir.iterdir():
            if not date_dir.is_dir():
                continue
            
            # Check if file exists in this date directory
            file_path = date_dir / filename
            if file_path.exists():
                try:
                    # Parse date from directory name (YYYY-MM-DD)
                    date_obj = datetime.strptime(date_dir.name, "%Y-%m-%d").date()
                    available_dates.append(date_obj)
                except ValueError:
                    logger.warning(f"Invalid date directory: {date_dir.name}")
                    continue
        
        # Sort dates in descending order (newest first)
        available_dates.sort(reverse=True)
        return available_dates
    
    def get_latest_date(self, secretary: str) -> Optional[date]:
        """
        Get the most recent date with content for a secretary.
        
        Args:
            secretary: Secretary type
            
        Returns:
            Most recent date with content, or None if no content exists
        """
        dates = self.list_available_dates(secretary)
        return dates[0] if dates else None
    
    def write_content(self, secretary: str, target_date: date, content: str) -> None:
        """
        Write content to a secretary's log file.
        
        Args:
            secretary: Secretary type
            target_date: Date of the log
            content: Content to write
            
        Raises:
            ValueError: If secretary type is invalid
            FileReadError: If file cannot be written
        """
        file_path = self._get_file_path(secretary, target_date)
        
        # Create directory if it doesn't exist
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"Wrote {secretary} log for {target_date}")
        except Exception as e:
            logger.error(f"Failed to write {file_path}: {e}")
            raise FileReadError(f"Failed to write file: {e}")
