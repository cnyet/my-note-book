"""
Coordinator Module for AI Life Assistant v2.0
Implements the Chief of Staff pattern for multi-agent orchestration
"""

import os
from typing import Dict, Any, List, Optional
from datetime import date
from core.context_window import ContextWindowManager

class ContextBus:
    """
    Enhanced shared state for a single pipeline run or session.
    Allows agents to share insights and maintains a sliding context window.
    """
    def __init__(self):
        self.data: Dict[str, Any] = {}
        self.window_mgr = ContextWindowManager()

    def set(self, key: str, value: Any, source: str):
        self.data[key] = {
            'value': value,
            'source': source
        }
        # Record significant updates into conversation window
        if isinstance(value, str) and len(value) < 500:
            self.window_mgr.add_message("system", f"Context Update from {source}: {key} = {value}")

    def get(self, key: str, default: Any = None) -> Any:
        item = self.data.get(key)
        return item['value'] if item else default

class ChiefOfStaff:
    """
    The Orchestrator that manages the sequence and synergy of AI Agents.
    """
    def __init__(self, config_path: str = "config/config.ini"):
        self.config_path = config_path
        self.bus = ContextBus()
        self.results = {}

    def run_daily_pipeline(self, target_date: Optional[date] = None) -> Dict[str, Any]:
        """
        Executes all agents in a logical sequence to maximize synergy.
        Order: News -> Work -> Outfit -> Life -> Review
        """
        run_date = target_date or date.today()
        
        print("\n" + "=" * 70)
        print(f"🚀 Launching Chief of Staff Pipeline for {run_date}")
        print("=" * 70)

        # 1. News - Awareness
        print("\n📰 Step 1: News Agent (Global Awareness)")
        from agents.news_agent import NewsAgent
        news_agent = NewsAgent(config_path=self.config_path)
        news_output = news_agent.run(save_to_file=True)
        self.results['news'] = news_output
        self.bus.window_mgr.add_message("assistant", "Global News Awareness established.")
        
        # 2. Work - Strategy
        print("\n💼 Step 2: Work Agent (Strategic Planning)")
        from agents.work_agent import WorkAgent
        work_agent = WorkAgent(config_path=self.config_path)
        work_output = work_agent.run(save_to_file=True, interactive=False)
        self.results['work'] = work_output
        
        # Collaborative Logic: Extract formal requirement
        if "重要会议" in work_output or "Important Meeting" in work_output or "面试" in work_output:
            print("💡 Insight: High formality event detected in work plan.")
            self.bus.set('formal_requirement', True, source='work')

        # 3. Outfit - Presentation
        print("\n👔 Step 3: Outfit Agent (Personal Presentation)")
        from agents.outfit_agent import OutfitAgent
        outfit_agent = OutfitAgent(config_path=self.config_path)
        # Pass formality context to outfit agent
        self.results['outfit'] = outfit_agent.run(
            save_to_file=True, 
            formal_requested=self.bus.get('formal_requirement', False)
        )

        # 4. Life - Sustainability
        print("\n🌱 Step 4: Life Agent (Vitality & Health)")
        from agents.life_agent import LifeAgent
        life_agent = LifeAgent(config_path=self.config_path)
        self.results['life'] = life_agent.run(save_to_file=True)

        print("\n" + "=" * 70)
        print("✨ Chief of Staff Pipeline execution completed.")
        print("=" * 70)

        return self.results
