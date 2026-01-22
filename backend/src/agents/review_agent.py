"""
Review Secretary Agent - v2.0
Analyzes daily activities and reflects on progress.
Now integrates Preference Extraction for v2.0 memory depth.
"""
import logging
from typing import Any
from agents.base import BaseAgent
from core.preference_extractor import PreferenceExtractor

logger = logging.getLogger(__name__)

class ReviewAgent(BaseAgent):
    """AI-powered reflection and self-improvement agent."""

    def __init__(self, **kwargs):
        super().__init__(name="Review", **kwargs)
        self.extractor = PreferenceExtractor(config_path=self.config_path)

    def _collect_data(self, **kwargs) -> str:
        """Step 1: Collect all other agent logs for the day."""
        logger.info("Gathering all logs for daily review...")
        
        # In a real run, this would read files from data/daily_logs/YYYY-MM-DD/
        # Here we simulate or take from kwargs
        logs = []
        for agent in ["news", "work", "life", "outfit"]:
            content = self.file_manager.read_daily_file(agent)
            if content:
                logs.append(f"## {agent.upper()} Log:\n{content}")
        
        return "\n\n".join(logs) if logs else "No logs found for today."

    def _process_with_llm(self, raw_data: str, historical_context: str = "", **kwargs) -> str:
        """Step 2: Generate reflection and extract long-term preferences."""
        logger.info("Reflecting on the day's achievements...")
        
        system_prompt = f"""
        You are '大洪's' Personal Strategist. Analyze his daily logs and provide a deep reflection.
        
        {historical_context}
        
        Structure:
        1. 🌟 Highlights of the Day
        2. 🚧 Obstacles & Lessons
        3. 📈 Progress towards long-term goals
        4. 💡 Strategy for Tomorrow
        """
        
        reflection = self.llm.simple_chat(
            user_message=raw_data,
            system_prompt=system_prompt,
            temperature=0.4
        )
        
        # v2.0 Feature: Proactively extract preferences during review
        if reflection:
            self.extractor.extract_from_text(reflection, "Daily Review")
            
        return reflection
