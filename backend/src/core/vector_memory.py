"""
Vector Memory Module - v2.0
Handles semantic memory using SQLite-based keyword and content search 
as a lightweight alternative to full Vector DBs.
"""
import logging
from typing import List, Dict, Any, Optional
from datetime import date
from sqlalchemy.orm import Session
from api.models.agent_content import ContentIndex
from api.database import SessionLocal

logger = logging.getLogger(__name__)

class VectorMemory:
    """
    Lightweight Semantic Memory.
    Uses SQL 'LIKE' and keyword indexing to simulate semantic retrieval
    without heavy external dependencies.
    """

    def __init__(self, db_session: Optional[Session] = None):
        self.db = db_session or SessionLocal()

    def search(self, query: str, limit: int = 5, agent_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Search historical logs for relevant context.
        """
        try:
            # Simple keyword search across content index
            # In a real RAG system, this would use embeddings
            stmt = self.db.query(ContentIndex)
            
            if agent_type:
                stmt = stmt.filter(ContentIndex.agent_type == agent_type)
            
            # Simple rank-by-relevance simulation (splitting query into keywords)
            keywords = [k.strip() for k in query.split() if len(k.strip()) > 1]
            
            if not keywords:
                return []

            # Filter records that match any keyword
            results = []
            for record in stmt.all():
                match_count = sum(1 for k in keywords if k.lower() in record.content_text.lower())
                if match_count > 0:
                    results.append({
                        "date": record.content_date.isoformat(),
                        "agent": record.agent_type,
                        "text": record.content_text[:500] + "...",
                        "score": match_count
                    })
            
            # Sort by match count
            results.sort(key=lambda x: x["score"], reverse=True)
            return results[:limit]

        except Exception as e:
            logger.error(f"Memory search failed: {e}")
            return []

    def get_context_for_llm(self, query: str, agent_type: Optional[str] = None) -> str:
        """
        Formats search results for LLM consumption.
        """
        results = self.search(query, agent_type=agent_type)
        if not results:
            return "No relevant historical memory found."
            
        context_parts = ["# Relevant Historical Memory:"]
        for res in results:
            context_parts.append(f"Date: {res['date']} (Agent: {res['agent']})\nContent: {res['text']}\n")
            
        return "\n".join(context_parts)

    def __del__(self):
        if hasattr(self, 'db'):
            self.db.close()
