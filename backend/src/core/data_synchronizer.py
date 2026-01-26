"""
Data Synchronizer Module - v2.0 (DB-Only)
Handles direct extraction and persistence of agent content to structured SQLite database.
Markdown files are no longer involved in the storage process.
"""
import logging
import re
from datetime import datetime, date
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from api.models.agent_content import ContentIndex, HealthMetric, WorkTask, DailyReflection
from api.database import SessionLocal

logger = logging.getLogger(__name__)

class DataSynchronizer:
    """Synchronizes AI Agent output directly to the structured database."""

    def __init__(self, db_session: Optional[Session] = None):
        self.db = db_session or SessionLocal()

    def sync_log_to_db(self, agent_type: str, content: str, log_date: Optional[date] = None) -> bool:
        """
        Persists agent output to the database.
        """
        sync_date = log_date or date.today()
        
        # 1. Update Content Index (Generic Search & Daily Record)
        self._update_content_index(agent_type, content, sync_date)
        
        # 2. Extract and Update Specific Models
        try:
            if agent_type == "work":
                return self._sync_work_tasks(content, sync_date)
            elif agent_type == "life":
                return self._sync_health_metrics(content, sync_date)
            elif agent_type == "review":
                return self._sync_reflection(content, sync_date)
            elif agent_type == "outfit":
                # Currently outfit only goes to ContentIndex
                return True
            elif agent_type == "news":
                # NewsAgent handles its own granular syncing during process_with_llm
                return True
        except Exception as e:
            logger.error(f"Specific sync failed for {agent_type}: {e}")
            return False
        
        return True

    def _update_content_index(self, agent_type: str, content: str, content_date: date):
        """Update the generic search index."""
        try:
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
        """Parse tasks and sync to work_tasks table."""
        try:
            # Flexible task pattern matching
            task_pattern = re.compile(r"- \[( |x|X)\] \*\*(.*?)\*\* - (.*?)$", re.MULTILINE)
            matches = task_pattern.findall(content)
            
            if not matches:
                # Fallback simple pattern
                task_pattern = re.compile(r"- \[( |x|X)\] (.*?)$", re.MULTILINE)
                matches = [(m[0], m[1], "") for m in task_pattern.findall(content)]

            self.db.query(WorkTask).filter(WorkTask.date == content_date).delete()
            
            for status, title, desc in matches:
                task = WorkTask(
                    user_id=1,
                    date=content_date,
                    title=title.strip(),
                    is_completed=status.lower() == "x",
                    notes=desc.strip() if desc else ""
                )
                self.db.add(task)
            
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Work sync failed: {e}")
            self.db.rollback()
            return False

    def _sync_health_metrics(self, content: str, content_date: date) -> bool:
        """Extract health metrics from life log."""
        try:
            metrics = {
                "steps": re.search(r"步数[:：]\s*(\d+)", content),
                "sleep": re.search(r"睡眠[:：]\s*(\d+\.?\d*)", content),
                "water": re.search(r"饮水[:：]\s*(\d+)", content),
                "weight": re.search(r"体重[:：]\s*(\d+\.?\d*)", content)
            }
            
            h_metric = self.db.query(HealthMetric).filter(HealthMetric.date == content_date).first()
            if not h_metric:
                h_metric = HealthMetric(user_id=1, date=content_date)
                self.db.add(h_metric)
            
            if metrics["steps"]: h_metric.steps = int(metrics["steps"].group(1))
            if metrics["sleep"]: h_metric.sleep_hours = float(metrics["sleep"].group(1))
            if metrics["water"]: h_metric.water_ml = int(metrics["water"].group(1))
            if metrics["weight"]: h_metric.weight_kg = float(metrics["weight"].group(1))
            
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Health sync failed: {e}")
            self.db.rollback()
            return False

    def _sync_reflection(self, content: str, content_date: date) -> bool:
        """Extract reflection insights."""
        try:
            score_match = re.search(r"评分[:：]\s*(\d+)", content)
            
            reflection = self.db.query(DailyReflection).filter(DailyReflection.date == content_date).first()
            if not reflection:
                reflection = DailyReflection(user_id=1, date=content_date)
                self.db.add(reflection)
            
            if score_match: reflection.overall_score = int(score_match.group(1))
            reflection.content = content
            
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Reflection sync failed: {e}")
            self.db.rollback()
            return False

    def __del__(self):
        if hasattr(self, 'db'):
            try:
                self.db.close()
            except:
                pass
