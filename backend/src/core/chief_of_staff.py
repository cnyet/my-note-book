"""
Chief of Staff Module - v2.0
The central orchestrator that manages agent execution order and context sharing.
Includes Automation Hooks support.
"""
import logging
import asyncio
from typing import List, Dict, Any, Optional
from core.context_bus import ContextBus
from core.automation_hooks import HookManager
from agents.news_agent import NewsAgent
from agents.work_agent import WorkAgent
from agents.review_agent import ReviewAgent
# Note: Outfit and Life agents will be imported here once fully refactored to BaseAgent

logger = logging.getLogger(__name__)

class ChiefOfStaff:
    """
    Orchestrates multiple agents and manages the shared ContextBus and Hooks.
    """
    def __init__(self, config_path: str = "backend/config/config.ini"):
        self.config_path = config_path
        self.bus = ContextBus()
        self.hook_manager = HookManager(self)
        self.agents = {
            "news": NewsAgent,
            "work": WorkAgent,
            "review": ReviewAgent,
        }

    def run_morning_flow(self) -> Dict[str, str]:
        """
        Executes the morning sequence: News -> Work (with News context)
        """
        results = {}
        logger.info("Starting Morning Flow...")

        # 1. Run News
        news_agent = NewsAgent(config_path=self.config_path)
        news_result = news_agent.execute()
        self.bus.set("news_briefing", news_result)
        results["news"] = news_result

        # 2. Process Hooks (e.g., check for breaking news)
        self.hook_manager.process_hooks(self.bus.get_all())

        # 3. Run Work (Injected with News context)
        work_agent = WorkAgent(config_path=self.config_path)
        
        # Check for urgent notifications from hooks
        urgent = self.bus.get("urgent_notification", "")
        work_prefix = f"URGENT: {urgent}\n" if urgent else ""
        
        work_result = work_agent.execute(
            user_input=f"{work_prefix}Focus on today's news where applicable: {news_result[:200]}..."
        )
        self.bus.set("work_plan", work_result)
        results["work"] = work_result

        return results

    def run_evening_flow(self) -> Dict[str, str]:
        """
        Executes the evening sequence: Review
        """
        results = {}
        logger.info("Starting Evening Flow...")

        review_agent = ReviewAgent(config_path=self.config_path)
        review_result = review_agent.execute()
        results["review"] = review_result

        return results

    def run_full_day(self) -> Dict[str, str]:
        """Runs the entire orchestrated sequence."""
        all_results = {}
        all_results.update(self.run_morning_flow())
        all_results.update(self.run_evening_flow())
        return all_results

    def run_daily_pipeline(self) -> Dict[str, Any]:
        """
        Consolidated pipeline for API compatibility (backward compatibility with coordinator.py).
        """
        return self.run_full_day()
