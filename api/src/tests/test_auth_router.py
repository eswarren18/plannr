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
from src.main.main import app


client = TestClient(app)


class DummyUser:
    def __init__(self, email, hashed_password):
        self.email = email
        self.hashed_password = hashed_password


@pytest.fixture
def dummy_user():
    return DummyUser(email="test@example.com", hashed_password="hashedpw")


def test_signin_success(monkeypatch, dummy_user):
    def mock_query(*args, **kwargs):
        class Query:
            def filter(self, *args, **kwargs):
                return self

            def first(self):
                return dummy_user

        return Query()

    def mock_verify_password(pw, hpw):
        return True

    monkeypatch.setattr("src.main.database.get_db", lambda: None)
    monkeypatch.setattr("src.main.utils.verify_password", mock_verify_password)
    monkeypatch.setattr("sqlalchemy.orm.Session.query", mock_query)
    response = client.post(
        "/api/auth/signin", json={"email": dummy_user.email, "password": "any"}
    )
    assert response.status_code == 200
    assert "email" in response.json()


def test_signin_wrong_email(monkeypatch):
    def mock_query(*args, **kwargs):
        class Query:
            def filter(self, *args, **kwargs):
                return self

            def first(self):
                return None

        return Query()

    monkeypatch.setattr("src.main.database.get_db", lambda: None)
    monkeypatch.setattr("sqlalchemy.orm.Session.query", mock_query)
    response = client.post(
        "/api/auth/signin",
        json={"email": "wrong@example.com", "password": "any"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_signin_wrong_password(monkeypatch, dummy_user):
    def mock_query(*args, **kwargs):
        class Query:
            def filter(self, *args, **kwargs):
                return self

            def first(self):
                return dummy_user

        return Query()

    def mock_verify_password(pw, hpw):
        return False

    monkeypatch.setattr("src.main.database.get_db", lambda: None)
    monkeypatch.setattr("src.main.utils.verify_password", mock_verify_password)
    monkeypatch.setattr("sqlalchemy.orm.Session.query", mock_query)
    response = client.post(
        "/api/auth/signin",
        json={"email": dummy_user.email, "password": "wrongpw"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_signout_success(monkeypatch):
    class DummyRequest:
        headers = {"origin": "localhost"}
        cookies = {"fast_api_token": "token"}

    class DummyResponse:
        def __init__(self):
            self.deleted = False

        def delete_cookie(self, **kwargs):
            self.deleted = True

    request = DummyRequest()
    response = DummyResponse()
    from src.main.routers import auth_router

    result = auth_router.signout(request, response)
    assert response.deleted is True
    assert result["detail"] == "User has been signed out"


def test_signout_no_cookie(monkeypatch):
    class DummyRequest:
        headers = {"origin": "localhost"}
        cookies = {}

    class DummyResponse:
        def delete_cookie(self, **kwargs):
            pass

    request = DummyRequest()
    response = DummyResponse()
    from src.main.routers import auth_router

    result = auth_router.signout(request, response)
    assert result["detail"] == "No user was signed in"


def test_signout_secure_cookie(monkeypatch):
    class DummyRequest:
        headers = {"origin": "https://production.com"}
        cookies = {"fast_api_token": "token"}

    class DummyResponse:
        def __init__(self):
            self.secure = None

        def delete_cookie(self, **kwargs):
            self.secure = kwargs.get("secure")

    request = DummyRequest()
    response = DummyResponse()
    from src.main.routers import auth_router

    auth_router.signout(request, response)
    assert response.secure is True
