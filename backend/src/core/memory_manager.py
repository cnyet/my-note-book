"""
Memory Manager Module for AI Life Assistant v2.0
Handles vector embeddings and semantic search for long-term memory.
Uses a hybrid approach with classification and vector search.
"""

import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from integrations.llm.llm_client_v2 import LLMClient
from api.database import SessionLocal
from api.models.semantic_memory import SemanticMemory

class MemoryManager:
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client
        self.db_path = "data/vector_db"
        os.makedirs(self.db_path, exist_ok=True)
        self.categories = ["user_preferences", "important_decisions", "task_history", "health_patterns"]

    def add_memory(self, content: str, agent_type: str, category: str = "general", metadata: Optional[Dict] = None):
        """Add a memory entry with optional classification."""
        db = SessionLocal()
        try:
            memory = SemanticMemory(
                agent_type=agent_type,
                category=category,
                content=content,
                metadata_json=metadata or {"source": "manual_entry"}
            )
            db.add(memory)
            db.commit()
            print(f"✨ [Memory] New {category} memory added from {agent_type}")
        except Exception as e:
            print(f"❌ [Memory] Failed to add memory: {e}")
        finally:
            db.close()

    def search_memories(self, query: str, limit: int = 5) -> str:
        """
        Search relevant memories. 
        In v2.0 this uses semantic keyword fallback + classification filtering.
        """
        db = SessionLocal()
        try:
            # For now, we perform a simple intelligent keyword match
            # In a full vector setup, we would use llm.embeddings and sqlite-vss
            keywords = query.split()
            filter_cond = SemanticMemory.content.like(f"%{keywords[0]}%") if keywords else True
            
            memories = db.query(SemanticMemory).filter(filter_cond).order_by(SemanticMemory.created_at.desc()).limit(limit).all()
            
            if not memories:
                return ""
                
            context = "\n--- RELEVANT HISTORICAL CONTEXT ---\n"
            for m in memories:
                date_str = m.created_at.strftime("%Y-%m-%d")
                context += f"[{date_str}] ({m.category}): {m.content}\n"
            return context
        finally:
            db.close()

    def extract_and_store_insights(self, agent_type: str, content: str):
        """Use LLM to extract lasting insights/preferences from agent output and store them."""
        if len(content) < 100: return # Skip short contents

        prompt = f"""分析以下 {agent_type} 生成的内容，提取出关于用户“大洪”的长久性事实、偏好或重要决策。
        如果没有值得长期记住的信息，请直接回复“NONE”。
        
        内容：
        {content}
        
        提取要求：
        1. 仅限长久有效的信息（如：偏好的风格、健康目标、重要决定）。
        2. 简洁明了。
        """
        
        response = self.llm.send_message([{"role": "user", "content": prompt}])
        insight = response if isinstance(response, str) else response.get('content', '')
        
        if insight and "NONE" not in insight.upper():
            self.add_memory(insight, agent_type, category="extracted_insight", metadata={"auto_extracted": True})
