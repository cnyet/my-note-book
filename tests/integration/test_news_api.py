"""
News API 集成测试
"""

import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

pytestmark = pytest.mark.asyncio


@pytest.mark.integration
class TestNewsSourcesAPI:
    """新闻源 API 测试"""

    async def test_get_sources_empty(self, api_client, test_database):
        """测试获取空新闻源列表"""
        response = await api_client.get("/api/v1/news/sources")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    async def test_get_sources_with_data(self, api_client, test_database):
        """测试获取新闻源列表（有数据）"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource
        from uuid import uuid4

        # 添加测试数据
        async with AsyncSessionLocal() as session:
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="Test Source",
                url="https://example.com/rss",
                source_type="rss",
                category="tech",
                language="en",
                crawl_interval=3600,
                is_active=True,
            )
            session.add(source)
            await session.commit()

        response = await api_client.get("/api/v1/news/sources")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Test Source"

    async def test_get_sources_active_only(self, api_client, test_database):
        """测试只获取活跃新闻源"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource
        from uuid import uuid4

        async with AsyncSessionLocal() as session:
            # 活跃源
            source1 = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="Active Source",
                url="https://active.com/rss",
                source_type="rss",
                is_active=True,
            )
            # 非活跃源
            source2 = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="Inactive Source",
                url="https://inactive.com/rss",
                source_type="rss",
                is_active=False,
            )
            session.add_all([source1, source2])
            await session.commit()

        # 默认只看活跃的
        response = await api_client.get("/api/v1/news/sources")
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Active Source"

        # 看所有的
        response = await api_client.get("/api/v1/news/sources?active_only=false")
        data = response.json()
        assert len(data) == 2

    async def test_create_source(self, api_client, test_database):
        """测试创建新闻源"""
        payload = {
            "name": "New Source",
            "url": "https://newsource.com/rss",
            "source_type": "rss",
            "category": "tech",
            "language": "en",
            "crawl_interval": 7200,
        }

        response = await api_client.post(
            "/api/v1/news/sources",
            json=payload,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "New Source"
        assert data["url"] == "https://newsource.com/rss"
        assert data["is_active"] == True

    async def test_delete_source(self, api_client, test_database):
        """测试删除新闻源"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource
        from uuid import uuid4

        # 先创建
        async with AsyncSessionLocal() as session:
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="To Delete",
                url="https://delete.com/rss",
                source_type="rss",
            )
            session.add(source)
            await session.commit()
            source_id = source.id

        # 再删除
        response = await api_client.delete(f"/api/v1/news/sources/{source_id}")
        assert response.status_code == 200

        # 验证已删除
        response = await api_client.get("/api/v1/news/sources")
        data = response.json()
        assert len(data) == 0

    async def test_delete_source_not_found(self, api_client, test_database):
        """测试删除不存在的源"""
        response = await api_client.delete("/api/v1/news/sources/src_nonexistent")
        assert response.status_code == 404

    async def test_toggle_source(self, api_client, test_database):
        """测试切换源状态"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource
        from uuid import uuid4

        async with AsyncSessionLocal() as session:
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="Toggle Source",
                url="https://toggle.com/rss",
                source_type="rss",
                is_active=True,
            )
            session.add(source)
            await session.commit()
            source_id = source.id

        # 切换到非活跃
        response = await api_client.post(f"/api/v1/news/sources/{source_id}/toggle")
        assert response.status_code == 200
        data = response.json()
        assert data["is_active"] == False

        # 再切换到活跃
        response = await api_client.post(f"/api/v1/news/sources/{source_id}/toggle")
        data = response.json()
        assert data["is_active"] == True


@pytest.mark.integration
class TestNewsStatsAPI:
    """新闻统计 API 测试"""

    async def test_get_stats_empty(self, api_client, test_database):
        """测试获取空统计"""
        response = await api_client.get("/api/v1/news/stats")
        assert response.status_code == 200
        data = response.json()
        assert data["active_sources"] == 0
        assert data["total_articles"] == 0

    async def test_get_stats_with_data(self, api_client, test_database):
        """测试获取统计（有数据）"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource, NewsArticle
        from uuid import uuid4

        async with AsyncSessionLocal() as session:
            # 添加源
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="Stat Source",
                url="https://stat.com/rss",
                source_type="rss",
                is_active=True,
            )
            session.add(source)
            await session.commit()

            # 添加文章
            for i in range(5):
                article = NewsArticle(
                    id=f"art_{uuid4().hex[:12]}",
                    source_id=source.id,
                    title=f"Article {i}",
                    url=f"https://stat.com/article/{i}",
                    summary="Summary" if i < 3 else None,  # 3 篇有摘要
                    is_featured=True if i < 2 else False,  # 2 篇精选
                )
                session.add(article)

            await session.commit()

        response = await api_client.get("/api/v1/news/stats")
        data = response.json()
        assert data["active_sources"] == 1
        assert data["total_articles"] == 5
        assert data["summarized_articles"] == 3
        assert data["featured_articles"] == 2


@pytest.mark.integration
class TestNewsListAPI:
    """新闻列表 API 测试"""

    async def test_get_news_list_empty(self, api_client, test_database):
        """测试获取空新闻列表"""
        response = await api_client.get("/api/v1/news")
        assert response.status_code == 200
        data = response.json()
        assert data["articles"] == []
        assert data["total"] == 0

    async def test_get_news_list_with_data(self, api_client, test_database):
        """测试获取新闻列表（有数据）"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource, NewsArticle
        from uuid import uuid4

        async with AsyncSessionLocal() as session:
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="List Source",
                url="https://list.com/rss",
                source_type="rss",
            )
            session.add(source)
            await session.commit()

            article = NewsArticle(
                id=f"art_{uuid4().hex[:12]}",
                source_id=source.id,
                title="Test Article",
                url="https://list.com/article",
                summary="Test summary",
            )
            session.add(article)
            await session.commit()

        response = await api_client.get("/api/v1/news")
        assert response.status_code == 200
        data = response.json()
        assert len(data["articles"]) == 1
        assert data["articles"][0]["title"] == "Test Article"

    async def test_get_news_list_pagination(self, api_client, test_database):
        """测试分页"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource, NewsArticle
        from uuid import uuid4

        async with AsyncSessionLocal() as session:
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="Pagination Source",
                url="https://pagination.com/rss",
            )
            session.add(source)
            await session.commit()

            # 添加 25 篇文章
            for i in range(25):
                article = NewsArticle(
                    id=f"art_{uuid4().hex[:12]}",
                    source_id=source.id,
                    title=f"Article {i}",
                    url=f"https://pagination.com/article/{i}",
                )
                session.add(article)

            await session.commit()

        # 第一页
        response = await api_client.get("/api/v1/news?page=1&page_size=10")
        data = response.json()
        assert len(data["articles"]) == 10
        assert data["page"] == 1
        assert data["page_size"] == 10
        assert data["has_more"] == True

        # 第二页
        response = await api_client.get("/api/v1/news?page=2&page_size=10")
        data = response.json()
        assert len(data["articles"]) == 10
        assert data["has_more"] == True

        # 第三页
        response = await api_client.get("/api/v1/news?page=3&page_size=10")
        data = response.json()
        assert len(data["articles"]) == 5
        assert data["has_more"] == False

    async def test_get_article_by_id(self, api_client, test_database):
        """测试获取单篇文章"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource, NewsArticle
        from uuid import uuid4

        async with AsyncSessionLocal() as session:
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="Detail Source",
                url="https://detail.com/rss",
            )
            session.add(source)
            await session.commit()

            article = NewsArticle(
                id=f"art_detail_{uuid4().hex[:8]}",
                source_id=source.id,
                title="Detail Article",
                url="https://detail.com/article",
                summary="Detail summary",
            )
            session.add(article)
            await session.commit()
            article_id = article.id

        response = await api_client.get(f"/api/v1/news/{article_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Detail Article"

    async def test_get_article_not_found(self, api_client, test_database):
        """测试获取不存在的文章"""
        response = await api_client.get("/api/v1/news/art_nonexistent")
        assert response.status_code == 404

    async def test_get_article_increments_view_count(self, api_client, test_database):
        """测试获取文章增加浏览次数"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource, NewsArticle
        from uuid import uuid4

        async with AsyncSessionLocal() as session:
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="View Source",
                url="https://view.com/rss",
            )
            session.add(source)
            await session.commit()

            article = NewsArticle(
                id=f"art_view_{uuid4().hex[:8]}",
                source_id=source.id,
                title="View Article",
                url="https://view.com/article",
                view_count=0,
            )
            session.add(article)
            await session.commit()
            article_id = article.id

        # 第一次访问
        response = await api_client.get(f"/api/v1/news/{article_id}")
        assert response.json()["view_count"] == 1

        # 第二次访问
        response = await api_client.get(f"/api/v1/news/{article_id}")
        assert response.json()["view_count"] == 2


@pytest.mark.integration
class TestNewsRefreshAPI:
    """新闻刷新 API 测试"""

    async def test_refresh_news_endpoint_exists(self, api_client, test_database):
        """测试刷新新闻端点存在"""
        from backend.src.core.database import AsyncSessionLocal
        from backend.src.models import NewsSource
        from uuid import uuid4

        async with AsyncSessionLocal() as session:
            source = NewsSource(
                id=f"src_{uuid4().hex[:12]}",
                name="Refresh Source",
                url="https://refresh.com/rss",
                source_type="rss",
                is_active=True,
            )
            session.add(source)
            await session.commit()

        # Note: Actual crawl will fail without real RSS feed, but endpoint should respond
        # This test just verifies the endpoint exists and returns proper error
        response = await api_client.post(
            "/api/v1/news/refresh",
            json={"source_ids": []},  # Empty list should return 0 added
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "added_count" in data
