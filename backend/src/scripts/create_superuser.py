import logging
import sys
import os

# Add the parent directory to sys.path to allow importing modules
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from src.core.database import SessionLocal
from src.models.user import User
from src.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_superuser() -> None:
    db = SessionLocal()
    try:
        email = "admin@example.com"
        password = "admin"

        user = db.query(User).filter(User.email == email).first()
        if user:
            logger.info(f"User with email {email} already exists.")
            return

        logger.info(f"Creating superuser {email}...")

        new_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name="Admin User",
            is_active=True,
            is_superuser=True,
            role="admin",
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.info("✅ Superuser created successfully!")
        logger.info(f"Email: {email}")
        logger.info(f"Password: {password}")

    except Exception as e:
        logger.error(f"❌ Error creating superuser: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_superuser()
