"""
File Repository Adapter - v2.0 (DB Transition)
Redirects legacy file reading requests to the SQLite database.
Ensures UI continues to work as we move away from local Markdown files.
"""
import logging
from datetime import date
from typing import List, Optional, Any
from api.database import SessionLocal
from api.models.agent_content import ContentIndex

logger = logging.getLogger(__name__)

class FileRepository:
    """Legacy Adapter: Reads from DB but behaves like a File Repository."""

    def __init__(self):
        # We use a context-managed session in methods to avoid leaks
        pass

    def read_content(self, agent_type: str, target_date: date) -> str:
        """Reads content from DB instead of local filesystem."""
        with SessionLocal() as db:
            entry = db.query(ContentIndex).filter(
                ContentIndex.agent_type == agent_type,
                ContentIndex.content_date == target_date
            ).first()
            
            if not entry:
                raise FileNotFoundError(f"No database entry found for {agent_type} on {target_date}")
            
            return entry.content_text

    def list_available_dates(self, agent_type: str) -> List[date]:
        """Lists dates with content available in DB."""
        with SessionLocal() as db:
            dates = db.query(ContentIndex.content_date).filter(
                ContentIndex.agent_type == agent_type
            ).distinct().all()
            
            return [d[0] for d in dates]

    def save_content(self, agent_type: str, content: str, target_date: date) -> bool:
        """Saves content to DB (Proxy for synchronizer)."""
        from core.data_synchronizer import DataSynchronizer
        sync = DataSynchronizer()
        return sync.sync_log_to_db(agent_type, content, target_date)

# Keep exception definitions for compatibility
class FileNotFoundError(Exception):
    pass

class FileReadError(Exception):
    pass
