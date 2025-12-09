from dotenv import load_dotenv
load_dotenv(dotenv_path=".env.test", override=True)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from testcontainers.postgres import PostgresContainer

from src.main.database import get_db, init_engine_and_session
from src.main.main import app
from src.main.models import Base



@pytest.fixture(scope="session")
def postgres_container():
    """Start a Postgres docker container for the test session."""
    with PostgresContainer("postgres:15") as postgres:
        yield postgres

@pytest.fixture(scope="session")
def db_engine(postgres_container):
    """Create SQLAlchemy engine connected to the test Postgres and create tables."""
    test_db_url = postgres_container.get_connection_url()
    # Initialize the app's database engine/session for tests
    init_engine_and_session(test_db_url)
    engine = create_engine(test_db_url)
    # Create all tables from SQLAlchemy models
    Base.metadata.create_all(engine)
    yield engine
    # teardown: drop tables and dispose engine
    Base.metadata.drop_all(engine)
    engine.dispose()

@pytest.fixture(scope="session")
def TestingSessionLocal(db_engine):
    """Return a sessionmaker bound to the test engine."""
    return sessionmaker(bind=db_engine)

@pytest.fixture(scope="module")
def test_client(TestingSessionLocal):
    """
    Override the application's get_db dependency to use the test session,
    then yield a FastAPI TestClient that talks to the app using the test DB.
    """
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        yield client

    # cleanup override so other tests are not affected
    app.dependency_overrides.pop(get_db, None)
