from fastapi import APIRouter
from .agents import router as agents_admin_router
from .blog import router as blog_admin_router
from .tools import router as tools_admin_router
from .labs import router as labs_admin_router
from .media import router as media_admin_router

router = APIRouter(prefix="/admin", tags=["admin"])

router.include_router(agents_admin_router)
router.include_router(blog_admin_router)
router.include_router(tools_admin_router)
router.include_router(labs_admin_router)
router.include_router(media_admin_router)
