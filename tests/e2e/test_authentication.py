"""
端到端测试示例 - 用户认证流程
"""

import pytest


@pytest.mark.e2e
class TestUserAuthentication:
    """用户认证端到端测试"""

    async def test_complete_login_flow(self, browser_client):
        """测试完整的登录流程"""
        # 访问登录页面
        await browser_client.goto("/auth/login")

        # 填写登录表单
        await browser_client.fill("input[name='email']", "test@example.com")
        await browser_client.fill("input[name='password']", "password123")

        # 提交表单
        await browser_client.click("button[type='submit']")

        # 验证登录成功
        await browser_client.wait_for_url("/dashboard")
        assert await browser_client.is_visible("[data-testid='user-menu']")

    async def test_logout_flow(self, authenticated_client):
        """测试登出流程"""
        # 点击用户菜单
        await authenticated_client.click("[data-testid='user-menu']")

        # 点击登出
        await authenticated_client.click("[data-testid='logout-button']")

        # 验证重定向到登录页
        await authenticated_client.wait_for_url("/auth/login")
