"""
Enhanced Memory Manager for AI Life Assistant v2.0
Handles classified long-term memory and semantic retrieval.
"""
from typing import List, Dict, Any, Optional
import json
from api.database import SessionLocal
from api.models.semantic_memory import SemanticMemory

class EnhancedMemoryManager:
    def __init__(self, llm_client):
        self.llm = llm_client
        self.categories = ["user_preferences", "important_decisions", "task_history", "health_patterns"]

    def add_memory(self, content: str, agent_type: str, category: str = "general"):
        """Save a new classified memory entry."""
        db = SessionLocal()
        try:
            memory = SemanticMemory(
                agent_type=agent_type,
                category=category,
                content=content,
                metadata_json={"source": "agent_run"}
            )
            db.add(memory)
            db.commit()
        finally:
            db.close()

    def get_relevant_context(self, query: str, limit: int = 3) -> str:
        """
        Retrieve relevant historical context.
        Note: Currently uses keyword-based fallback until Vector extension is confirmed.
        """
        db = SessionLocal()
        try:
            # Simple keyword match fallback
            keywords = query.split()
            memories = db.query(SemanticMemory).filter(
                SemanticMemory.content.like(f"%{keywords[0]}%") if keywords else True
            ).limit(limit).all()
            
            if not memories:
                return ""
                
            context = "\nRelevant History:\n"
            for m in memories:
                context += f"- [{m.category}] {m.content}\n"
            return context
        finally:
            db.close()
