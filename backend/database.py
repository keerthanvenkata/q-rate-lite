from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Force absolute path for sqlite to avoid cwd confusion
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "test.db")

# If DATABASE_URL is set to default test.db, use the absolute path
env_db_url = os.getenv("DATABASE_URL", "sqlite:///./test.db")
if "sqlite" in env_db_url and "test.db" in env_db_url:
    DATABASE_URL = f"sqlite:///{DB_PATH}"
else:
    DATABASE_URL = env_db_url

# efficient connection args for sqlite, standard for postgres
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

# Connection pooling configurations for production (PostgreSQL)
pool_kwargs = {}
if "sqlite" not in DATABASE_URL:
    pool_kwargs = {
        "pool_size": 20,
        "max_overflow": 10,
        "pool_timeout": 30,
        "pool_recycle": 1800, # Recycle connections after 30 minutes
    }

engine = create_engine(
    DATABASE_URL, 
    connect_args=connect_args,
    **pool_kwargs
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
