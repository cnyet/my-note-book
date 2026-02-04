from fastapi import APIRouter, Depends, UploadFile, File
from src.services.media import media_service
from src.api.v1.auth import get_current_user
from src.models.user import User

router = APIRouter()


@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    """Authenticated endpoint to upload media files."""
    url = await media_service.upload_image(file)
    return {"url": url}
