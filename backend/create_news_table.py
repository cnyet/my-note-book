#!/usr/bin/env python3
"""
Quick script to create the news_articles table in the database.
Run this if you get "no such table: news_articles" error.
"""
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from api.database import engine, Base, init_db
from api.models.secretary_content import NewsArticle

def main():
    print("Creating news_articles table...")
    try:
        # Import all models to ensure they are registered
        from api.models.user import User, Session
        from api.models.secretary_content import UserAction, ContentIndex, HealthMetric, NewsArticle
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✓ news_articles table created successfully!")
        print("✓ All tables are up to date.")
    except Exception as e:
        print(f"✗ Error creating table: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
