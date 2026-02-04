import uuid
from fastapi import UploadFile, HTTPException
from pathlib import Path

UPLOAD_DIR = Path("public/uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


class MediaService:
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Removes directory traversal risks and generates a unique name."""
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File extension {ext} is not allowed. Supported: {ALLOWED_EXTENSIONS}",
            )
        unique_name = f"{uuid.uuid4()}{ext}"
        return unique_name

    @staticmethod
    async def upload_image(file: UploadFile) -> str:
        """Handles the upload process and returns the public URL."""
        # Check file size (approximate)
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Max 5MB.")
        await file.seek(0)

        # Generate safe unique name
        filename = MediaService.sanitize_filename(file.filename)
        file_path = UPLOAD_DIR / filename

        # Ensure directory exists
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        # Save to disk
        try:
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to save file: {str(e)}"
            )

        # Return the public URL path
        return f"/uploads/{filename}"


media_service = MediaService()
