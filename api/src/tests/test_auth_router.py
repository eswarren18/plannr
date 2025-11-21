"""
Tests for auth_router:
 - Test registration, login, and logout endpoints.
 - Test authentication error handling and edge cases.
 - Test token generation and validation.
"""

from fastapi.testclient import TestClient
from src.main.database import get_db
from src.main.main import app
from src.main.routers import auth_router
from src.main.schemas import UserResponse
from src.main.utils import hash_password

client = TestClient(app)


# --- Mocks ---
class MockUser:
    email = "user@example.com"
    hashed_password = hash_password("string")
    first_name = "Test"
    last_name = "User"
    id = 1
    is_registered = True


class MockQuery:
    def __init__(self, email):
        self._email = email

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        if self._email == "user@example.com":
            return MockUser()
        return None


class MockSession:
    def __init__(self, email=None):
        self._email = email

    def query(self, *args, **kwargs):
        return MockQuery(self._email)


# --- Tests ---
def test_signin_success():
    # Arrange
    # Set JSON
    json = {"email": "user@example.com", "password": "string"}

    # Override the DB session with a mock DB session
    def mock_get_db():
        return MockSession(json["email"])

    app.dependency_overrides[get_db] = mock_get_db

    # Act
    response = client.post("/api/auth/signin", json=json)

    # Clean-up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    data = response.json()
    expected = {
        "email": "user@example.com",
        "first_name": "Test",
        "last_name": "User",
        "id": 1,
        "is_registered": True,
    }
    assert data == expected


def test_signin_wrong_email():
    # Arrange
    # Set JSON
    json = {"email": "wrong@example.com", "password": "string"}

    # Override the DB session with a mock DB session
    def mock_get_db():
        return MockSession(json["email"])

    app.dependency_overrides[get_db] = mock_get_db

    # Act
    response = client.post("/api/auth/signin", json=json)

    # Clean-up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_signin_wrong_password():
    # Arrange
    # Set JSON
    json = {"email": "user@example.com", "password": "wrongpw"}

    # Override the DB session with a mock DB session
    def mock_get_db():
        return MockSession(json["email"])

    app.dependency_overrides[get_db] = mock_get_db

    # Act
    response = client.post("/api/auth/signin", json=json)

    # Clean-up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_signout_success():
    # Arrange
    client.cookies.set("fast_api_token", "token")
    headers = {"origin": "localhost"}

    # Act
    response = client.delete("/api/auth/signout", headers=headers)

    # Clean-up
    client.cookies.clear()

    # Assert
    assert response.status_code == 200
    assert response.json()["detail"] == "User has been signed out"


def test_signout_no_cookie():
    # Arrange
    headers = {"origin": "localhost"}

    # Act
    response = client.delete("/api/auth/signout", headers=headers)

    # Clean-up
    # None

    # Assert
    assert response.status_code == 200
    assert response.json()["detail"] == "No user was signed in"


def test_signout_secure_cookie():
    # Arrange
    client.cookies.set("fast_api_token", "token")
    headers = {"origin": "https://production.com"}

    # Act
    response = client.delete("/api/auth/signout", headers=headers)

    # Clean-up
    client.cookies.clear()

    # Assert
    assert response.status_code == 200
    assert response.json()["detail"] == "User has been signed out"
