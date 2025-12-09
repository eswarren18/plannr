"""
Database setup: creates SQLAlchemy engine, session, and Base for ORM models.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


Base = declarative_base()

# Session factory and engine, overridable for tests
engine = None
SessionLocal = None

def init_engine_and_session(database_url: str):
    global engine, SessionLocal
    engine = create_engine(database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    if SessionLocal is None:
        raise RuntimeError("SessionLocal is not initialized. Call init_engine_and_session(database_url) first.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    if engine is None:
        raise RuntimeError("Engine is not initialized. Call init_engine_and_session(database_url) first.")
    Base.metadata.create_all(bind=engine)

def drop_tables():
    if engine is None:
        raise RuntimeError("Engine is not initialized. Call init_engine_and_session(database_url) first.")
    Base.metadata.drop_all(bind=engine)
