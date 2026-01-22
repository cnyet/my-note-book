"""
Data Synchronizer Module - v2.0
Handles synchronization between Markdown logs and structured SQLite database.
"""
import os
import logging
import re
from datetime import datetime, date
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from api.models.agent_content import ContentIndex, HealthMetric, WorkTask, DailyReflection
from api.database import SessionLocal

logger = logging.getLogger(__name__)

class DataSynchronizer:
    """Synchronizes file-based logs to the structured database."""

    def __init__(self, db_session: Optional[Session] = None):
        self.db = db_session or SessionLocal()

    def sync_log_to_db(self, agent_type: str, content: str, log_date: Optional[date] = None) -> bool:
        """
        Main entry point for synchronizing a specific log to DB.
        """
        sync_date = log_date or date.today()
        
        # 1. Update Content Index (Generic Search)
        self._update_content_index(agent_type, content, sync_date)
        
        # 2. Extract and Update Specific Models
        if agent_type == "work":
            return self._sync_work_tasks(content, sync_date)
        elif agent_type == "life":
            return self._sync_health_metrics(content, sync_date)
        elif agent_type == "review":
            return self._sync_reflection(content, sync_date)
        
        return True

    def _update_content_index(self, agent_type: str, content: str, content_date: date):
        """Update the generic search index."""
        try:
            # Check if exists
            index_entry = self.db.query(ContentIndex).filter(
                ContentIndex.agent_type == agent_type,
                ContentIndex.content_date == content_date
            ).first()

            if index_entry:
                index_entry.content_text = content
            else:
                index_entry = ContentIndex(
                    agent_type=agent_type,
                    content_date=content_date,
                    content_text=content
                )
                self.db.add(index_entry)
            
            self.db.commit()
        except Exception as e:
            logger.error(f"Failed to update ContentIndex: {e}")
            self.db.rollback()

    def _sync_work_tasks(self, content: str, content_date: date) -> bool:
        """Parse tasks from Markdown and sync to work_tasks table."""
        try:
            # Find all [ ] or [x] lines
            task_pattern = re.compile(r"- \[( |x|X)\] \*\*(.*?)\*\* - (.*?)$", re.MULTILINE)
            matches = task_pattern.findall(content)
            
            # Clear existing tasks for this day (simple overwrite for sync)
            self.db.query(WorkTask).filter(WorkTask.date == content_date).delete()
            
            for status, title, desc in matches:
                is_completed = status.lower() == "x"
                task = WorkTask(
                    user_id=1, # Default for v2.0
                    date=content_date,
                    title=title.strip(),
                    is_completed=is_completed,
                    notes=desc.strip()
                )
                self.db.add(task)
            
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Work sync failed: {e}")
            self.db.rollback()
            return False

    def _sync_health_metrics(self, content: str, content_date: date) -> bool:
        """Extract health metrics (steps, sleep, water) from life log."""
        # TODO: Implement regex extraction for health metrics
        return True

    def _sync_reflection(self, content: str, content_date: date) -> bool:
        """Extract scores and insights from review log."""
        # TODO: Implement regex extraction for reflections
        return True

    def __del__(self):
        if hasattr(self, 'db'):
            self.db.close()
