"""
NewsScheduler 单元测试
"""

import pytest
from unittest.mock import MagicMock, patch
from backend.src.agents.news.scheduler import NewsScheduler


@pytest.mark.unit
class TestNewsScheduler:
    """新闻调度器测试"""

    @pytest.fixture
    def scheduler(self):
        """创建调度器实例"""
        with patch('backend.src.agents.news.scheduler.AsyncIOScheduler'):
            sched = NewsScheduler()
            sched.scheduler = MagicMock()
            return sched

    def test_start_scheduler(self, scheduler):
        """测试启动调度器"""
        scheduler.start()
        scheduler.scheduler.start.assert_called_once()

    def test_stop_scheduler_with_wait(self, scheduler):
        """测试停止调度器（等待）"""
        scheduler.stop(wait=True)
        scheduler.scheduler.shutdown.assert_called_once_with(wait=True)

    def test_stop_scheduler_without_wait(self, scheduler):
        """测试停止调度器（不等待）"""
        scheduler.stop(wait=False)
        scheduler.scheduler.shutdown.assert_called_once_with(wait=False)

    def test_add_job_with_interval(self, scheduler):
        """测试添加间隔任务"""
        mock_job = MagicMock()
        mock_job.id = "news_crawl_src_123"
        scheduler.scheduler.add_job.return_value = mock_job

        async def dummy_func(source_id, limit):
            return 0

        job_id = scheduler.add_job(
            source_id="src_123",
            crawl_func=dummy_func,
            interval_seconds=3600
        )

        assert job_id == "news_crawl_src_123"
        assert "src_123" in scheduler._jobs
        scheduler.scheduler.add_job.assert_called_once()

    def test_add_job_with_cron(self, scheduler):
        """测试添加 Cron 任务"""
        mock_job = MagicMock()
        mock_job.id = "news_crawl_src_456"
        scheduler.scheduler.add_job.return_value = mock_job

        async def dummy_func(source_id, limit):
            return 0

        job_id = scheduler.add_job(
            source_id="src_456",
            crawl_func=dummy_func,
            cron_expression="0 9 * * *"
        )

        assert job_id == "news_crawl_src_456"
        assert "src_456" in scheduler._jobs

    def test_add_job_replaces_existing(self, scheduler):
        """测试添加任务替换已存在的任务"""
        mock_job = MagicMock()
        mock_job.id = "news_crawl_src_789"
        scheduler.scheduler.add_job.return_value = mock_job

        async def dummy_func(source_id, limit):
            return 0

        # 第一次添加
        scheduler.add_job("src_789", dummy_func, interval_seconds=3600)
        # 第二次添加（应该替换）
        scheduler.add_job("src_789", dummy_func, interval_seconds=7200)

        # remove_job 应该被调用一次（在添加新任务之前）
        assert scheduler.scheduler.remove_job.called

    def test_add_daily_job(self, scheduler):
        """测试添加每日任务"""
        mock_job = MagicMock()
        mock_job.id = "news_daily_crawl"
        scheduler.scheduler.add_job.return_value = mock_job

        async def dummy_func(source_id, limit):
            return 0

        job_id = scheduler.add_daily_job(dummy_func, hour=9)

        assert job_id == "news_daily_crawl"
        assert "daily" in scheduler._jobs

    def test_remove_job_exists(self, scheduler):
        """测试移除已存在的任务"""
        scheduler._jobs["src_123"] = "news_crawl_src_123"
        scheduler.scheduler.remove_job.return_value = None

        result = scheduler.remove_job("src_123")

        assert result == True
        assert "src_123" not in scheduler._jobs
        scheduler.scheduler.remove_job.assert_called_once_with("news_crawl_src_123")

    def test_remove_job_not_exists(self, scheduler):
        """测试移除不存在的任务"""
        result = scheduler.remove_job("src_nonexistent")

        assert result == False

    def test_remove_job_with_exception(self, scheduler):
        """测试移除任务时异常"""
        scheduler._jobs["src_123"] = "news_crawl_src_123"
        scheduler.scheduler.remove_job.side_effect = Exception("Removal failed")

        result = scheduler.remove_job("src_123")

        assert result == True  # 即使异常也应该删除记录
        assert "src_123" not in scheduler._jobs

    def test_pause_job_exists(self, scheduler):
        """测试暂停已存在的任务"""
        scheduler._jobs["src_123"] = "news_crawl_src_123"
        scheduler.scheduler.pause_job.return_value = None

        result = scheduler.pause_job("src_123")

        assert result == True
        scheduler.scheduler.pause_job.assert_called_once_with("news_crawl_src_123")

    def test_pause_job_not_exists(self, scheduler):
        """测试暂停不存在的任务"""
        result = scheduler.pause_job("src_nonexistent")
        assert result == False

    def test_resume_job_exists(self, scheduler):
        """测试恢复已存在的任务"""
        scheduler._jobs["src_123"] = "news_crawl_src_123"
        scheduler.scheduler.resume_job.return_value = None

        result = scheduler.resume_job("src_123")

        assert result == True
        scheduler.scheduler.resume_job.assert_called_once_with("news_crawl_src_123")

    def test_resume_job_not_exists(self, scheduler):
        """测试恢复不存在的任务"""
        result = scheduler.resume_job("src_nonexistent")
        assert result == False

    def test_run_job_now_exists(self, scheduler):
        """测试立即运行已存在的任务"""
        scheduler._jobs["src_123"] = "news_crawl_src_123"
        scheduler.scheduler.modify_job.return_value = None

        result = scheduler.run_job_now("src_123")

        assert result == True
        scheduler.scheduler.modify_job.assert_called_once()

    def test_run_job_now_not_exists(self, scheduler):
        """测试立即运行不存在的任务"""
        result = scheduler.run_job_now("src_nonexistent")
        assert result == False

    def test_get_job_info_exists(self, scheduler):
        """测试获取已存在的任务信息"""
        from datetime import datetime, timezone

        mock_job = MagicMock()
        mock_job.id = "news_crawl_src_123"
        mock_job.name = "Crawl news source src_123"
        mock_job.trigger = MagicMock()
        mock_job.trigger.__str__ = lambda self: "interval(3600)"
        mock_job.next_run_time = datetime.now(timezone.utc)
        mock_job.paused = False

        scheduler._jobs["src_123"] = "news_crawl_src_123"
        scheduler.scheduler.get_job.return_value = mock_job

        result = scheduler.get_job_info("src_123")

        assert result is not None
        assert result["job_id"] == "news_crawl_src_123"
        assert result["source_id"] == "src_123"
        assert result["is_paused"] == False

    def test_get_job_info_not_exists(self, scheduler):
        """测试获取不存在的任务信息"""
        result = scheduler.get_job_info("src_nonexistent")
        assert result is None

    def test_get_all_jobs(self, scheduler):
        """测试获取所有任务"""
        from datetime import datetime, timezone

        mock_job1 = MagicMock()
        mock_job1.id = "job_1"
        mock_job1.name = "Job 1"
        mock_job1.trigger = MagicMock()
        mock_job1.trigger.__str__ = lambda self: "interval(3600)"
        mock_job1.next_run_time = datetime.now(timezone.utc)
        mock_job1.paused = False

        mock_job2 = MagicMock()
        mock_job2.id = "job_2"
        mock_job2.name = "Job 2"
        mock_job2.trigger = MagicMock()
        mock_job2.trigger.__str__ = lambda self: "cron(0 9 * * *)"
        mock_job2.next_run_time = None
        mock_job2.paused = True

        scheduler.scheduler.get_jobs.return_value = [mock_job1, mock_job2]

        result = scheduler.get_all_jobs()

        assert len(result) == 2
        assert result[0]["job_id"] == "job_1"
        assert result[1]["job_id"] == "job_2"
        assert result[1]["is_paused"] == True

    def test_get_all_jobs_empty(self, scheduler):
        """测试获取空任务列表"""
        scheduler.scheduler.get_jobs.return_value = []

        result = scheduler.get_all_jobs()

        assert len(result) == 0
