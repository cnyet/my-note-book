"""Service layer for AI Agent agents."""

import sys
import os
from pathlib import Path

# Add backend/src to path for imports
backend_src = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_src))

from typing import Optional, Dict, Any
import configparser


class AgentService:
    """Service for executing AI agent agents via API."""

    def __init__(self, config_path: str = None):
        """Initialize agent service with config."""
        if config_path is None:
            backend_dir = Path(__file__).parent.parent.parent.parent
            config_path = backend_dir / "config" / "config.ini"

        self.config = configparser.ConfigParser()
        if os.path.exists(config_path):
            self.config.read(config_path)

        self.config_dict = {
            "llm": dict(self.config["llm"]) if "llm" in self.config else {},
            "data": dict(self.config["data"]) if "data" in self.config else {},
            "weather": dict(self.config["weather"]) if "weather" in self.config else {},
            "news": dict(self.config["news"]) if "news" in self.config else {},
        }

    def run_news(self, db_session=None) -> dict:
        """Run news agent agent."""
        try:
            from agents.news_agent import NewsAgent

            agent = NewsAgent(config_dict=self.config_dict)
            summary = agent.run(save_to_file=True, db_session=db_session)

            return {"success": True, "summary": summary, "error": None}
        except Exception as e:
            return {"success": False, "summary": None, "error": str(e)}

    def run_work(self) -> dict:
        """Run work agent agent."""
        try:
            from agents.work_agent import WorkAgent

            agent = WorkAgent(config_dict=self.config_dict)
            summary = agent.run(interactive=False, save_to_file=True)

            return {"success": True, "summary": summary, "error": None}
        except Exception as e:
            return {"success": False, "summary": None, "error": str(e)}

    def run_outfit(self) -> dict:
        """Run outfit agent agent."""
        try:
            from agents.outfit_agent import OutfitAgent

            agent = OutfitAgent(config_dict=self.config_dict)
            summary = agent.run(save_to_file=True)

            return {"success": True, "summary": summary, "error": None}
        except Exception as e:
            return {"success": False, "summary": None, "error": str(e)}

    def run_life(self) -> dict:
        """Run life agent agent."""
        try:
            from agents.life_agent import LifeAgent

            agent = LifeAgent(config_dict=self.config_dict)
            summary = agent.run(save_to_file=True)

            return {"success": True, "summary": summary, "error": None}
        except Exception as e:
            return {"success": False, "summary": None, "error": str(e)}

    def run_review(self) -> dict:
        """Run review agent agent."""
        try:
            from agents.review_agent import ReviewAgent

            agent = ReviewAgent(config_dict=self.config_dict)
            summary = agent.run(save_to_file=True)

            return {"success": True, "summary": summary, "error": None}
        except Exception as e:
            return {"success": False, "summary": None, "error": str(e)}


# Singleton instance
_service: Optional[AgentService] = None


def get_agent_service() -> AgentService:
    """Get or create singleton agent service instance."""
    global _service
    if _service is None:
        _service = AgentService()
    return _service
