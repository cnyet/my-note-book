"""
Context Orchestrator for AI Life Assistant v2.0
Implements the Four-Layer Memory Architecture from conversation-accuracy-skill.
"""
import logging
from typing import List, Dict, Optional
from datetime import date
from core.enhanced_memory import EnhancedMemoryManager
from api.database import SessionLocal
from api.repositories.conversation_repository import ConversationRepository

logger = logging.getLogger(__name__)

class ContextOrchestrator:
    """
    Assembles context following the tiered strategy:
    1. Short-term: Last 3-5 turns (Sliding Window)
    2. Mid-term: Key points from last 24h (Summaries)
    3. Long-term: Semantic search (Vector/Keyword Memory)
    4. Orchestration: Token budget management
    """
    
    def __init__(self, llm_client):
        self.llm = llm_client
        self.memory_mgr = EnhancedMemoryManager(llm_client)
        
    def assemble_context(self, agent_type: str, user_query: str, sliding_window: List[Dict]) -> List[Dict]:
        """
        Build the message list layer by layer.
        """
        messages = []
        
        # --- LAYER 1: System Instructions (Core Identity) ---
        # (This is usually handled by the specific agent subclass, 
        # but we preserve space for it in the budget)
        
        # --- LAYER 2: Long-term Memory (Semantic Context) ---
        long_term = self.memory_mgr.get_relevant_context(user_query)
        if long_term:
            messages.append({
                "role": "system",
                "content": f"### 长期背景 (Long-term Context)\n{long_term}"
            })
            
        # --- LAYER 3: Mid-term Summary (Recent Facts/Decisions) ---
        mid_term = self._get_recent_summary(agent_type)
        if mid_term:
            messages.append({
                "role": "system",
                "content": f"### 近期摘要 (Mid-term Summary)\n{mid_term}"
            })
            
        # --- LAYER 4: Short-term Context (Sliding Window) ---
        if sliding_window:
            messages.extend(sliding_window)
            
        # Current Interaction
        messages.append({"role": "user", "content": user_query})
        
        logger.info(f"Assembled context for {agent_type} with {len(messages)} segments.")
        return messages

    def _get_recent_summary(self, agent_type: str) -> Optional[str]:
        """Fetch the most recent daily summary from DB."""
        db = SessionLocal()
        try:
            repo = ConversationRepository(db)
            summary = repo.get_latest_summary(agent_type)
            if not summary:
                return None
                
            text = f"日期: {summary.summary_date}\n摘要: {summary.content_summary}"
            if summary.key_decisions:
                text += f"\n关键决策: {summary.key_decisions}"
            if summary.action_items:
                text += f"\n待办事项: {summary.action_items}"
            return text
        except Exception as e:
            logger.error(f"Error fetching mid-term summary: {e}")
            return None
        finally:
            db.close()
