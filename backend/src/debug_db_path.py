import sys
import os
from pathlib import Path

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from api.database import DB_PATH, DATABASE_URL, engine
from sqlalchemy import inspect

def debug():
    print(f"DEBUG: Configured DB_PATH: {DB_PATH}")
    print(f"DEBUG: Absolute DB_PATH: {DB_PATH.absolute()}")
    print(f"DEBUG: DATABASE_URL: {DATABASE_URL}")
    print(f"DEBUG: File exists? {DB_PATH.exists()}")
    
    inspector = inspect(engine)
    print(f"DEBUG: Tables in this engine: {inspector.get_table_names()}")

if __name__ == "__main__":
    debug()
