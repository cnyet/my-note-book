"""
Context Orchestrator for AI Life Assistant v2.0
Assembles multi-layer context (Short-term window + Long-term memory + Current input).
"""
from typing import List, Dict, Any, Optional
import json
from core.memory_manager import MemoryManager

class ContextOrchestrator:
    def __init__(self, llm_client):
        self.memory_mgr = MemoryManager(llm_client)
        
    def assemble_full_context(self, agent_type: str, current_prompt: str, short_term_history: List[Dict]) -> List[Dict]:
        """
        Assemble a complete message list for the LLM.
        Layers:
        1. Long-term relevant context (from Database)
        2. Short-term dialogue history (Sliding Window)
        3. Current user prompt
        """
        messages = []
        
        # 1. Retrieve and format Long-term Context
        historical_context = self.memory_mgr.search_memories(current_prompt)
        if historical_context:
            messages.append({
                "role": "system", 
                "content": f"You have access to the following relevant historical context about the user:\n{historical_context}"
            })
            
        # 2. Add Short-term History (The Sliding Window)
        if short_term_history:
            messages.extend(short_term_history)
            
        # 3. Current Prompt
        messages.append({"role": "user", "content": current_prompt})
        
        return messages
