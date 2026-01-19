"""
File Repository for reading daily log files.
Handles file system operations for agent content.
"""

from pathlib import Path
from datetime import date, datetime
from typing import Optional, List, Dict
import logging

logger = logging.getLogger(__name__)

# Map agent types to Chinese file names
AGENT_FILE_MAP = {
    "news": "新闻简报.md",
    "work": "今日工作.md",
    "outfit": "今日穿搭.md",
    "life": "今日生活.md",
    "review": "今日复盘.md",
}

ALLOWED_AGENTS = list(AGENT_FILE_MAP.keys())


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

    def _get_file_path(self, agent: str, target_date: date) -> Path:
        if agent not in ALLOWED_AGENTS:
            raise ValueError(f"Invalid agent type: {agent}")

        date_str = target_date.strftime("%Y-%m-%d")
        filename = AGENT_FILE_MAP[agent]
        return self.data_dir / date_str / filename

    def read_content(self, agent: str, target_date: date) -> str:
        file_path = self._get_file_path(agent, target_date)

        if not file_path.exists():
            raise FileNotFoundError(f"No {agent} log found for {target_date}")

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            logger.info(f"Read {agent} log for {target_date}")
            return content
        except Exception as e:
            logger.error(f"Failed to read {file_path}: {e}")
            raise FileReadError(f"Failed to read file: {e}")

    def file_exists(self, agent: str, target_date: date) -> bool:
        try:
            file_path = self._get_file_path(agent, target_date)
            return file_path.exists()
        except ValueError:
            return False

    def list_available_dates(self, agent: str) -> List[date]:
        if agent not in ALLOWED_AGENTS:
            return []

        available_dates = []
        filename = AGENT_FILE_MAP[agent]

        if not self.data_dir.exists():
            return []

        for date_dir in self.data_dir.iterdir():
            if not date_dir.is_dir():
                continue

            file_path = date_dir / filename
            if file_path.exists():
                try:
                    date_obj = datetime.strptime(date_dir.name, "%Y-%m-%d").date()
                    available_dates.append(date_obj)
                except ValueError:
                    logger.warning(f"Invalid date directory: {date_dir.name}")
                    continue

        available_dates.sort(reverse=True)
        return available_dates

    def get_latest_date(self, agent: str) -> Optional[date]:
        dates = self.list_available_dates(agent)
        return dates[0] if dates else None

    def write_content(self, agent: str, target_date: date, content: str) -> None:
        file_path = self._get_file_path(agent, target_date)
        file_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            logger.info(f"Wrote {agent} log for {target_date}")
        except Exception as e:
            logger.error(f"Failed to write {file_path}: {e}")
            raise FileReadError(f"Failed to write file: {e}")
