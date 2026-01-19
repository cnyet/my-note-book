"""
Sync Engine Module for AI Life Assistant v2.0
Handles synchronization of Markdown logs to structured SQLite tables
"""

import os
import re
from datetime import datetime, date
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from api.database import SessionLocal
from api.models.secretary_content import (
    HealthMetric,
    WorkTask,
    DailyReflection,
    ContentIndex,
)
from utils.file_manager import FileManager


class SyncEngine:
    def __init__(self, db: Optional[Session] = None):
        self.db = db or SessionLocal()
        self.file_manager = FileManager()

    def sync_all(self):
        daily_dirs = self.file_manager.list_daily_dirs(limit=365)
        for date_str in daily_dirs:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            self.sync_day(target_date)

    def sync_day(self, target_date: date):
        date_str = target_date.strftime("%Y-%m-%d")

        life_content = self.file_manager.read_daily_file("life", date_str)
        if life_content:
            self._parse_and_save_life(life_content, target_date)

        work_content = self.file_manager.read_daily_file("work", date_str)
        if work_content:
            self._parse_and_save_work(work_content, target_date)

        review_content = self.file_manager.read_daily_file("review", date_str)
        if review_content:
            self._parse_and_save_review(review_content, target_date)

        self.db.commit()

    def _parse_and_save_life(self, content: str, target_date: date):
        metrics = {
            "steps": self._extract_first_int(content, r"步数[:：]\s*(\d+)"),
            "sleep_hours": self._extract_first_float(
                content, r"睡眠[:：]\s*(\d+\.?\d*)"
            ),
            "water_intake": self._extract_first_int(content, r"饮水[:：]\s*(\d+)"),
            "exercise_minutes": self._extract_first_int(content, r"运动[:：]\s*(\d+)"),
        }

        existing = (
            self.db.query(HealthMetric).filter(HealthMetric.date == target_date).first()
        )
        if existing:
            for k, v in metrics.items():
                if v is not None:
                    setattr(existing, k, v)
        else:
            new_metric = HealthMetric(
                user_id=1,
                date=target_date,
                **{k: v for k, v in metrics.items() if v is not None},
            )
            self.db.add(new_metric)

    def _parse_and_save_work(self, content: str, target_date: date):
        task_lines = re.findall(r"- \[( |x|X)\] (.*?)(?=\n|$)", content)
        self.db.query(WorkTask).filter(WorkTask.date == target_date).delete()

        for status, title in task_lines:
            priority = (
                "high" if "高优先级" in content[: content.find(title)] else "medium"
            )
            new_task = WorkTask(
                user_id=1,
                date=target_date,
                title=title.strip(),
                is_completed=status.lower() == "x",
                priority=priority,
            )
            self.db.add(new_task)

    def _parse_and_save_review(self, content: str, target_date: date):
        scores = re.findall(r"(\d+)/10", content)
        if len(scores) >= 3:
            existing = (
                self.db.query(DailyReflection)
                .filter(DailyReflection.date == target_date)
                .first()
            )
            reflection_data = {
                "productivity_score": int(scores[0]),
                "happiness_score": int(scores[1]),
                "growth_score": int(scores[2]),
            }
            if existing:
                for k, v in reflection_data.items():
                    setattr(existing, k, v)
            else:
                self.db.add(
                    DailyReflection(user_id=1, date=target_date, **reflection_data)
                )

    def _extract_first_int(self, text: str, pattern: str) -> Optional[int]:
        match = re.search(pattern, text)
        return int(match.group(1)) if match else None

    def _extract_first_float(self, text: str, pattern: str) -> Optional[float]:
        match = re.search(pattern, text)
        return float(match.group(1)) if match else None


if __name__ == "__main__":
    sync = SyncEngine()
    print("🚀 Starting full synchronization...")
    sync.sync_all()
    print("✅ Sync complete.")
