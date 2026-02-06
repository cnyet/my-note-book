"""
共享 Fixtures 配置
"""

import pytest
import asyncio
from httpx import AsyncClient
from backend.src.main import app


@pytest.fixture(scope="session")
def event_loop():
    """创建事件循环"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def api_client():
    """API 测试客户端"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture
async def test_database():
    """测试数据库 fixture"""
    # 创建测试数据库
    # 使用内存数据库或临时文件
    yield
    # 清理测试数据库


@pytest.fixture
async def sample_user():
    """示例用户数据"""
    return {
        "id": 1,
        "email": "test@example.com",
        "username": "testuser",
        "role": "user",
    }


@pytest.fixture
async def sample_agent():
    """示例 Agent 数据"""
    return {"id": 1, "name": "Test Agent", "type": "assistant", "status": "active"}
