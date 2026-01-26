"""
API routes
"""

# Import modules (not routers) to maintain compatibility with server.py
from api.routes import auth
from api.routes import agent
from api.routes import blog
from api.routes import conversation
from api.routes import news_routes as news
from api.routes import chat
from api.routes import plugins

__all__ = ["auth", "agent", "blog", "conversation", "news", "chat", "plugins"]
