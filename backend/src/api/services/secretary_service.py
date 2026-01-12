"""Service layer for AI Secretary agents."""
import sys
import os
from pathlib import Path

# Add backend/src to path for imports
backend_src = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_src))

from typing import Optional
import configparser


class SecretaryService:
    """Service for executing AI secretary agents via API."""

    def __init__(self, config_path: str = None):
        """Initialize secretary service with config."""
        if config_path is None:
            # 查找 config 文件
            backend_dir = Path(__file__).parent.parent.parent.parent
            config_path = backend_dir / "config" / "config.ini"
        
        self.config = configparser.ConfigParser()
        if os.path.exists(config_path):
            self.config.read(config_path)
        
        self.config_dict = {
            'llm': dict(self.config['llm']) if 'llm' in self.config else {},
            'data': dict(self.config['data']) if 'data' in self.config else {},
            'weather': dict(self.config['weather']) if 'weather' in self.config else {},
            'news': dict(self.config['news']) if 'news' in self.config else {}
        }

    def run_news(self, db_session=None) -> dict:
        """
        Run news secretary agent.
        
        Args:
            db_session: Optional database session for storing articles
        
        Returns:
            dict with success, summary, and error fields
        """
        try:
            from agents.news_secretary import NewsSecretary
            agent = NewsSecretary(self.config_dict)
            summary = agent.run(save_to_file=True, db_session=db_session)
            
            return {
                "success": True,
                "summary": summary,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "summary": None,
                "error": str(e)
            }

    def run_work(self) -> dict:
        """
        Run work secretary agent.
        
        Returns:
            dict with success, summary, and error fields
        """
        try:
            from agents.work_secretary import WorkSecretary
            agent = WorkSecretary(self.config_dict)
            summary = agent.run(save_to_file=True)
            
            return {
                "success": True,
                "summary": summary,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "summary": None,
                "error": str(e)
            }

    def run_outfit(self) -> dict:
        """
        Run outfit secretary agent.
        
        Returns:
            dict with success, summary, and error fields
        """
        try:
            from agents.outfit_secretary import OutfitSecretary
            agent = OutfitSecretary(self.config_dict)
            summary = agent.run(save_to_file=True)
            
            return {
                "success": True,
                "summary": summary,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "summary": None,
                "error": str(e)
            }

    def run_life(self) -> dict:
        """
        Run life secretary agent.
        
        Returns:
            dict with success, summary, and error fields
        """
        try:
            from agents.life_secretary import LifeSecretary
            agent = LifeSecretary(self.config_dict)
            summary = agent.run(save_to_file=True)
            
            return {
                "success": True,
                "summary": summary,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "summary": None,
                "error": str(e)
            }

    def run_review(self) -> dict:
        """
        Run review secretary agent.
        
        Returns:
            dict with success, summary, and error fields
        """
        try:
            from agents.review_secretary import ReviewSecretary
            agent = ReviewSecretary(self.config_dict)
            summary = agent.run(save_to_file=True)
            
            return {
                "success": True,
                "summary": summary,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "summary": None,
                "error": str(e)
            }


# Singleton instance
_service: Optional[SecretaryService] = None


def get_secretary_service() -> SecretaryService:
    """Get or create singleton secretary service instance."""
    global _service
    if _service is None:
        _service = SecretaryService()
    return _service



