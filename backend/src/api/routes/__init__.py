"""
API routes
"""
# Import modules (not routers) to maintain compatibility with server.py
from api.routes import auth
from api.routes import agent
from api.routes import blog
from api.routes import conversation
from api.routes import news_routes as news

__all__ = ["auth", "agent", "blog", "conversation", "news"]
