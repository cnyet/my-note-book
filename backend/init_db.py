"""Initialize database and create default user"""
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from api.database import engine, Base, SessionLocal
from api.models.user import User
from api.models.secretary_content import NewsArticle  # Import to register the model
from api.auth.password import password_manager

def init_database():
    """Create all tables and add default user"""
    print("Creating database tables...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created")
    
    # Create default user
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == "dahong@example.com").first()
        if existing_user:
            print("✓ Default user already exists")
            return
        
        # Create new user
        hashed_password = password_manager.hash_password("password123")
        default_user = User(
            email="dahong@example.com",
            name="大洪",
            password_hash=hashed_password,
            is_active=True
        )
        
        db.add(default_user)
        db.commit()
        print("✓ Default user created")
        print(f"  Email: dahong@example.com")
        print(f"  Password: password123")
        
    except Exception as e:
        print(f"✗ Error creating default user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()

