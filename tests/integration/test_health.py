"""
集成测试示例 - API 健康检查
"""

import pytest
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
        """测试数据库连接"""
        response = await api_client.get("/health/db")
        assert response.status_code == 200
        assert response.json()["database"] == "connected"
