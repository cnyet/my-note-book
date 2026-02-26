#!/usr/bin/env python3
"""
Admin CRUD API Integration Test Script
用于验证前后端 API 联调是否正常
"""

import requests
import json
from typing import Optional

# 配置
API_BASE_URL = "http://127.0.0.1:8001"
API_VERSION = "/api/v1"
ADMIN_PREFIX = f"{API_VERSION}/admin"

# 测试用认证信息（需要替换为真实的登录凭证）
ACCESS_TOKEN: Optional[str] = None


def get_auth_token(username: str = "admin", password: str = "admin123"):
    """获取认证 Token"""
    global ACCESS_TOKEN
    response = requests.post(
        f"{API_BASE_URL}{ADMIN_PREFIX}/auth/login",
        json={"username": username, "password": password}
    )
    if response.status_code == 200:
        data = response.json()
        ACCESS_TOKEN = data.get("data", {}).get("access_token")
        print(f"✓ 获取 Token 成功：{ACCESS_TOKEN[:20]}...")
        return True
    else:
        print(f"✗ 获取 Token 失败：{response.status_code}")
        print(response.text)
        return False


def get_headers() -> dict:
    """获取请求头"""
    headers = {"Content-Type": "application/json"}
    if ACCESS_TOKEN:
        headers["Authorization"] = f"Bearer {ACCESS_TOKEN}"
    return headers


def test_agents_api():
    """测试 Agents API"""
    print("\n=== 测试 Agents API ===")

    # 1. 获取列表
    response = requests.get(f"{API_BASE_URL}{ADMIN_PREFIX}/agents", headers=get_headers())
    print(f"GET /agents - Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  ✓ 获取到 {len(data) if isinstance(data, list) else 'N/A'} 个智能体")

    # 2. 获取类别
    response = requests.get(f"{API_BASE_URL}{ADMIN_PREFIX}/agents/categories", headers=get_headers())
    print(f"GET /agents/categories - Status: {response.status_code}")

    # 3. 获取统计
    response = requests.get(f"{API_BASE_URL}{ADMIN_PREFIX}/agents/stats/summary", headers=get_headers())
    print(f"GET /agents/stats/summary - Status: {response.status_code}")
    if response.status_code == 200:
        print(f"  ✓ 统计：{json.dumps(response.json(), ensure_ascii=False)}")


def test_tools_api():
    """测试 Tools API"""
    print("\n=== 测试 Tools API ===")

    # 1. 获取列表
    response = requests.get(f"{API_BASE_URL}{ADMIN_PREFIX}/tools", headers=get_headers())
    print(f"GET /tools - Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  ✓ 获取到 {len(data) if isinstance(data, list) else 'N/A'} 个工具")

    # 2. 获取类别
    response = requests.get(f"{API_BASE_URL}{ADMIN_PREFIX}/tools/categories", headers=get_headers())
    print(f"GET /tools/categories - Status: {response.status_code}")

    # 3. 创建测试工具
    test_tool = {
        "name": "测试工具",
        "slug": "test-tool-" + str(int(json.loads(json.dumps({"time": __import__('time').time()}))["time"] * 1000)),
        "category": "Dev",
        "description": "API 测试工具",
        "status": "active"
    }
    response = requests.post(
        f"{API_BASE_URL}{ADMIN_PREFIX}/tools",
        headers=get_headers(),
        json=test_tool
    )
    print(f"POST /tools - Status: {response.status_code}")
    if response.status_code == 201:
        print(f"  ✓ 创建成功")
        return response.json()
    return None


def test_labs_api():
    """测试 Labs API"""
    print("\n=== 测试 Labs API ===")

    # 1. 获取列表
    response = requests.get(f"{API_BASE_URL}{ADMIN_PREFIX}/labs", headers=get_headers())
    print(f"GET /labs - Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  ✓ 获取到 {len(data) if isinstance(data, list) else 'N/A'} 个实验室")

    # 2. 获取状态
    response = requests.get(f"{API_BASE_URL}{ADMIN_PREFIX}/labs/statuses", headers=get_headers())
    print(f"GET /labs/statuses - Status: {response.status_code}")


def test_blog_api():
    """测试 Blog API"""
    print("\n=== 测试 Blog API ===")

    # 1. 获取列表
    response = requests.get(f"{API_BASE_URL}{ADMIN_PREFIX}/blog", headers=get_headers())
    print(f"GET /blog - Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  ✓ 获取到 {len(data) if isinstance(data, list) else 'N/A'} 篇文章")


def run_all_tests():
    """运行所有测试"""
    print("=" * 50)
    print("Admin CRUD API Integration Test")
    print("=" * 50)

    # 1. 认证测试
    print("\n=== 认证测试 ===")
    if not get_auth_token():
        print("✗ 认证失败，无法继续测试")
        print("\n提示：请确保:")
        print("  1. 后端服务已启动 (uvicorn src.main:app --reload)")
        print("  2. 数据库已初始化")
        print("  3. 存在管理员账户 (admin/admin123)")
        return

    # 2. 各模块测试
    test_agents_api()
    test_tools_api()
    test_labs_api()
    test_blog_api()

    print("\n" + "=" * 50)
    print("测试完成!")
    print("=" * 50)


if __name__ == "__main__":
    run_all_tests()
