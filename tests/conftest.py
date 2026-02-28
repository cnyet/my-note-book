"""
共享 Fixtures 配置
"""

import pytest
import asyncio
from httpx import AsyncClient
import sys
from pathlib import Path

# 添加后端源码路径到 sys.path (作为包导入)
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from src.main import app


@pytest.fixture(scope="session")
def event_loop():
    """创建事件循环"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def api_client():
    """API 测试客户端 - 使用 httpx.AsyncClient"""
    from httpx import ASGITransport
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture(scope="function", autouse=True)
async def test_database():
    """测试数据库 fixture - 每个测试自动运行"""
    from src.core.database import Base, engine

    # 创建测试表
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # 清理测试表
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


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
