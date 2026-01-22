"""
User Preference Extractor - v2.0
Analyzes daily logs and reflections to extract and update user preferences.
"""
import logging
from typing import Dict, Any, Optional
from core.config_loader import ConfigLoader
from integrations.llm.llm_client_v2 import create_llm_client

logger = logging.getLogger(__name__)

class PreferenceExtractor:
    """
    Analyzes content to update user_profile.md or structured settings.
    """
    
    def __init__(self, config_path: str = "backend/config/config.ini"):
        self.llm = create_llm_client(config_path=config_path)
        self.profile_path = "data/user_profile.md"

    def extract_from_text(self, text: str, context_type: str) -> str:
        """
        Asks LLM to identify changes in user preferences based on recent logs.
        """
        logger.info(f"Extracting user preferences from {context_type}...")
        
        current_profile = ""
        if os.path.exists(self.profile_path):
            with open(self.profile_path, 'r', encoding='utf-8') as f:
                current_profile = f.read()

        system_prompt = f"""
        You are a Personal Data Analyst. Your goal is to keep the user's profile updated.
        Current Profile:
        {current_profile}
        
        Analyze the new log from '{context_type}' and output a JSON list of suggested updates to the user profile.
        Focus on:
        1. Interest shifts (e.g., new tech focus).
        2. Work habits (e.g., peak productivity times).
        3. Preferences (e.g., dietary choices, dressing style).
        
        Output format: JSON only.
        {{ "updates": [ {{ "field": "...", "old_value": "...", "new_value": "...", "reason": "..." }} ] }}
        """

        try:
            response = self.llm.simple_chat(
                user_message=text,
                system_prompt=system_prompt,
                max_tokens=1000
            )
            # In v2.0, we just log these for now or update a file.
            # Real implementation would update the user_profile.md.
            logger.info(f"Identified potential profile updates: {response}")
            return response
        except Exception as e:
            logger.error(f"Preference extraction failed: {e}")
            return ""

import os # Ensure os is imported for the check
