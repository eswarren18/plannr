"""
Tests for auth_router:
 - Test registration, login, and logout endpoints.
 - Test authentication error handling and edge cases.
 - Test token generation and validation.
"""

"""
from src.main.main import app
from src.main.models import User
from src.main.utils import verify_password
client = TestClient(app)
		self.email = email
"""
import pytest
from fastapi.testclient import TestClient
from src.main.database import get_db
from src.main.main import app
from src.main.utils import verify_password, hash_password
from src.main.schemas import UserResponse


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
    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return MockUser()


class MockSession:
    def query(self, *args, **kwargs):
        return MockQuery()


# --- Tests ---
def test_signin_success():
    # Arrange: override the DB session with a mock DB session
    def mock_get_db():
        return MockSession()

    app.dependency_overrides[get_db] = mock_get_db

    # Act
    response = client.post(
        "/api/auth/signin",
        json={"email": "user@example.com", "password": "string"},
    )

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


# def test_signin_wrong_email(monkeypatch):
#     def mock_query(*args, **kwargs):
#         class Query:
#             def filter(self, *args, **kwargs):
#                 return self

#             def first(self):
#                 return None

#         return Query()

#     monkeypatch.setattr("src.main.database.get_db", lambda: None)
#     monkeypatch.setattr("sqlalchemy.orm.Session.query", mock_query)
#     response = client.post(
#         "/api/auth/signin",
#         json={"email": "wrong@example.com", "password": "any"},
#     )
#     assert response.status_code == 401
#     assert response.json()["detail"] == "Incorrect email or password"


# def test_signin_wrong_password(monkeypatch, dummy_user):
#     def mock_query(*args, **kwargs):
#         class Query:
#             def filter(self, *args, **kwargs):
#                 return self

#             def first(self):
#                 return dummy_user

#         return Query()

#     def mock_verify_password(pw, hpw):
#         return False

#     monkeypatch.setattr("src.main.database.get_db", lambda: None)
#     monkeypatch.setattr("src.main.utils.verify_password", mock_verify_password)
#     monkeypatch.setattr("sqlalchemy.orm.Session.query", mock_query)
#     response = client.post(
#         "/api/auth/signin",
#         json={"email": dummy_user.email, "password": "wrongpw"},
#     )
#     assert response.status_code == 401
#     assert response.json()["detail"] == "Incorrect email or password"


# def test_signout_success(monkeypatch):
#     class DummyRequest:
#         headers = {"origin": "localhost"}
#         cookies = {"fast_api_token": "token"}

#     class DummyResponse:
#         def __init__(self):
#             self.deleted = False

#         def delete_cookie(self, **kwargs):
#             self.deleted = True

#     request = DummyRequest()
#     response = DummyResponse()
#     from src.main.routers import auth_router

#     result = auth_router.signout(request, response)
#     assert response.deleted is True
#     assert result["detail"] == "User has been signed out"


# def test_signout_no_cookie(monkeypatch):
#     class DummyRequest:
#         headers = {"origin": "localhost"}
#         cookies = {}

#     class DummyResponse:
#         def delete_cookie(self, **kwargs):
#             pass

#     request = DummyRequest()
#     response = DummyResponse()
#     from src.main.routers import auth_router

#     result = auth_router.signout(request, response)
#     assert result["detail"] == "No user was signed in"


# def test_signout_secure_cookie(monkeypatch):
#     class DummyRequest:
#         headers = {"origin": "https://production.com"}
#         cookies = {"fast_api_token": "token"}

#     class DummyResponse:
#         def __init__(self):
#             self.secure = None

#         def delete_cookie(self, **kwargs):
#             self.secure = kwargs.get("secure")

#     request = DummyRequest()
#     response = DummyResponse()
#     from src.main.routers import auth_router

#     auth_router.signout(request, response)
#     assert response.secure is True
