"""
集成测试示例 - API 健康检查
"""

import pytest

pytestmark = pytest.mark.asyncio
import httpx


@pytest.mark.integration
class TestHealthCheck:
    """API 健康检查集成测试"""

    async def test_api_health_endpoint(self, api_client):
        """测试 API 健康检查端点"""
        response = await api_client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    async def test_database_connection(self, api_client):
        """测试根端点"""
        response = await api_client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
