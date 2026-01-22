"""
Work Secretary Agent - v2.0
Responsible for task management and daily planning.
Refactored to use standardized BaseAgent pipeline with Memory support.
"""
import logging
from typing import Any, List
from agents.base import BaseAgent

logger = logging.getLogger(__name__)

class WorkAgent(BaseAgent):
    """AI-powered work task management and planning agent."""

    def __init__(self, **kwargs):
        super().__init__(name="Work", **kwargs)

    def _get_previous_day_tasks(self) -> List[str]:
        """Helper to get rollover tasks."""
        daily_dirs = self.file_manager.list_daily_dirs()
        if len(daily_dirs) < 2:
            return []
        
        previous_day = daily_dirs[1]
        content = self.file_manager.read_daily_file("work", previous_day)
        
        if not content:
            return []
            
        return [line.strip() for line in content.split("\n") if "[ ]" in line]

    def _collect_data(self, **kwargs) -> str:
        """Step 1: Gather rollover tasks and user input."""
        logger.info("Gathering work context...")
        
        rollover = self._get_previous_day_tasks()
        user_input = kwargs.get("user_input", "No additional input provided.")
        
        context = f"""
        # Yesterday's Incomplete Tasks:
        {chr(10).join(rollover) if rollover else 'None'}
        
        # Today's New Input:
        {user_input}
        """
        return context

    def _process_with_llm(self, raw_data: str, historical_context: str = "", **kwargs) -> str:
        """Step 2: Generate optimized TODO list using LLM with context."""
        logger.info("Planning today's work schedule...")
        
        system_prompt = f"""
        You are a productivity expert. Create an optimized TODO list for '大洪'.
        
        {historical_context}
        
        Categorize tasks by priority: 🚨 High, ⚡ Medium, 📝 Low.
        Provide a brief summary and recommended time blocks.
        """
        
        return self.llm.simple_chat(
            user_message=raw_data,
            system_prompt=system_prompt,
            temperature=0.5
        )
