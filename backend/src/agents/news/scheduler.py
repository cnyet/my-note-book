# backend/src/agents/news/scheduler.py
"""
NewsScheduler - 定时任务调度器

使用 APScheduler 实现定时爬取任务
"""

import logging
from datetime import datetime, timezone
from typing import Optional, Callable, Awaitable

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger(__name__)


class NewsScheduler:
    """
    新闻智能体定时调度器

    功能:
    - 定时爬取任务
    - 任务管理
    - 错误重试
    """

    def __init__(self):
        self.scheduler = AsyncIOScheduler(
            timezone="UTC",
            job_defaults={
                "coalesce": True,  # 合并错过的执行
                "max_instances": 1,  # 同一任务最多只有 1 个实例
                "misfire_grace_time": 60,  # 错过的任务在 60 秒内执行
            }
        )
        self._jobs: dict[str, str] = {}  # source_id -> job_id

    def start(self) -> None:
        """启动调度器"""
        self.scheduler.start()
        logger.info("NewsScheduler started")

    def stop(self, wait: bool = True) -> None:
        """停止调度器"""
        self.scheduler.shutdown(wait=wait)
        logger.info("NewsScheduler stopped")

    def add_job(
        self,
        source_id: str,
        crawl_func: Callable[[str], Awaitable[None]],
        interval_seconds: int = 3600,
        cron_expression: Optional[str] = None
    ) -> str:
        """
        添加定时任务

        Args:
            source_id: 新闻源 ID
            crawl_func: 爬取函数
            interval_seconds: 间隔秒数
            cron_expression: Cron 表达式 (如果指定则使用 Cron 调度)

        Returns:
            str: 任务 ID
        """
        # 如果已存在任务，先移除
        self.remove_job(source_id)

        if cron_expression:
            # 使用 Cron 调度
            trigger = CronTrigger.from_crontab(cron_expression)
            logger.info(f"Adding cron job for source {source_id}: {cron_expression}")
        else:
            # 使用间隔调度
            trigger = IntervalTrigger(seconds=interval_seconds)
            logger.info(f"Adding interval job for source {source_id}: every {interval_seconds}s")

        job = self.scheduler.add_job(
            crawl_func,
            trigger=trigger,
            args=[source_id],
            id=f"news_crawl_{source_id}",
            name=f"Crawl news source {source_id}",
            replace_existing=True,
        )

        self._jobs[source_id] = job.id
        logger.info(f"Job {job.id} added for source {source_id}")
        return job.id

    def remove_job(self, source_id: str) -> bool:
        """
        移除定时任务

        Args:
            source_id: 新闻源 ID

        Returns:
            bool: 是否成功移除
        """
        if source_id in self._jobs:
            job_id = self._jobs[source_id]
            try:
                self.scheduler.remove_job(job_id)
                logger.info(f"Job {job_id} removed for source {source_id}")
            except Exception as e:
                logger.warning(f"Failed to remove job {job_id}: {e}")
            finally:
                del self._jobs[source_id]
                return True
        return False

    def pause_job(self, source_id: str) -> bool:
        """
        暂停定时任务

        Args:
            source_id: 新闻源 ID

        Returns:
            bool: 是否成功暂停
        """
        if source_id in self._jobs:
            job_id = self._jobs[source_id]
            try:
                self.scheduler.pause_job(job_id)
                logger.info(f"Job {job_id} paused for source {source_id}")
                return True
            except Exception as e:
                logger.warning(f"Failed to pause job {job_id}: {e}")
        return False

    def resume_job(self, source_id: str) -> bool:
        """
        恢复定时任务

        Args:
            source_id: 新闻源 ID

        Returns:
            bool: 是否成功恢复
        """
        if source_id in self._jobs:
            job_id = self._jobs[source_id]
            try:
                self.scheduler.resume_job(job_id)
                logger.info(f"Job {job_id} resumed for source {source_id}")
                return True
            except Exception as e:
                logger.warning(f"Failed to resume job {job_id}: {e}")
        return False

    def run_job_now(self, source_id: str) -> bool:
        """
        立即执行定时任务

        Args:
            source_id: 新闻源 ID

        Returns:
            bool: 是否成功执行
        """
        if source_id in self._jobs:
            job_id = self._jobs[source_id]
            try:
                self.scheduler.modify_job(job_id, next_run_time=datetime.now(timezone.utc))
                logger.info(f"Job {job_id} triggered for source {source_id}")
                return True
            except Exception as e:
                logger.warning(f"Failed to trigger job {job_id}: {e}")
        return False

    def get_job_info(self, source_id: str) -> Optional[dict]:
        """
        获取任务信息

        Args:
            source_id: 新闻源 ID

        Returns:
            dict: 任务信息
        """
        if source_id not in self._jobs:
            return None

        job_id = self._jobs[source_id]
        job = self.scheduler.get_job(job_id)

        if not job:
            return None

        next_run = job.next_run_time
        return {
            "job_id": job_id,
            "source_id": source_id,
            "name": job.name,
            "trigger": str(job.trigger),
            "next_run": next_run.isoformat() if next_run else None,
            "is_paused": job.paused,
        }

    def get_all_jobs(self) -> list[dict]:
        """
        获取所有任务信息

        Returns:
            list[dict]: 任务信息列表
        """
        jobs = []
        for job in self.scheduler.get_jobs():
            jobs.append({
                "job_id": job.id,
                "name": job.name,
                "trigger": str(job.trigger),
                "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
                "is_paused": job.paused,
            })
        return jobs
