"""
Tests for event_router:
- Test event creation, update, deletion, and retrieval endpoints.
- Test permissions and event participation logic.
- Test error handling for invalid event operations.
"""

from fastapi.testclient import TestClient
from src.main.database import get_db
from src.main.main import app
from src.main.utils import get_current_user_from_token

client = TestClient(app)


# --- Mocks ---
class MockUser:
    id = 1
    email = "user@example.com"
    first_name = "Test"
    last_name = "User"


class MockEvent:
    def __init__(
        self,
        id=1,
        title="Mock Event",
        description="Mock event for testing",
        start_time="2025-11-25T22:17:41.110000Z",
        end_time="2025-11-26T22:17:41.110000Z",
        host_id=1,
        host_name="Test User",
    ):
        self.id = id
        self.title = title
        self.description = description
        self.start_time = start_time
        self.end_time = end_time
        self.host_id = host_id
        self.host_name = host_name


class MockEventQuery:
    def __init__(self, events):
        self._events = events

    def filter(self, *args, **kwargs):
        filtered = [event for event in self._events if event.host_id == 1]
        return MockEventQuery(filtered)

    def order_by(self, *args, **kwargs):
        # No-op for mock, just return self
        return self

    def all(self):
        return self._events

    def first(self):
        return self._events[0] if self._events else None


class MockUserQuery:
    def __init__(self, users):
        self._users = users

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self._users[0] if self._users else None


class MockSession:
    def __init__(self, events=None, users=None):
        self._events = events or []
        self._users = users or [MockUser()]

    def add(self, obj):
        self._events.append(obj)

    def commit(self):
        pass

    def refresh(self, obj):
        pass

    def query(self, model):
        if model.__name__ == "Event":
            return MockEventQuery(self._events)
        elif model.__name__ == "User":
            return MockUserQuery(self._users)
        # Add more as needed


# --- Dependency Overrides ---
def mock_get_current_user_from_token():
    return MockUser()


def mock_get_db():
    return mock_db


# --- Tests ---
# def test_create_event_success():
#     # Arrange
#     mock_event = MockEvent()
#     mock_db = MockSession(events=[mock_event])

#     def mock_get_current_user_from_token():
#         return MockUser()

#     def mock_get_db():
#         return mock_db

#     app.dependency_overrides[get_current_user_from_token] = mock_get_current_user_from_token
#     app.dependency_overrides[get_db] = mock_get_db

#     json = {
#         "title": "Test",
#         "description": "This is a test event.",
#         "host_id": 1,
#         "start_time": "2025-11-25T22:17:41.110Z",
#         "end_time": "2025-11-26T22:17:41.110Z"
#     }

#     # Act
#     response = client.post("api/events/", json=json)

#     # Clean-up
#     app.dependency_overrides = {}

#     # Assert
#     assert response.status_code == 200
#     data = response.json()
#     assert data == {
#         "title": "Test",
#         "description": "This is a tests event.",
#         "host_id": 0,
#         "start_time": "2025-11-25T22:17:41.110Z",
#         "end_time": "2025-11-26T22:17:41.110Z",
#         "id": 1,
#         "host_name": "Test User"
#     }


def test_create_event_missing_fields():
    # TODO: add test
    pass


def test_create_event_unauthenticated():
    # TODO: add test
    pass


def test_get_events_host_success():
    # --- Arrange ---
    global mock_db
    mock_events = [
        MockEvent(id=1, title="Event 1", host_id=1),
        MockEvent(id=2, title="Event 2", host_id=1),
        MockEvent(id=3, title="Event 3", host_id=2),
    ]
    mock_db = MockSession(events=mock_events)
    app.dependency_overrides[get_current_user_from_token] = (
        mock_get_current_user_from_token
    )
    app.dependency_overrides[get_db] = mock_get_db

    # --- Act ---
    response = client.get("/api/events/?role=host&time=all")

    # --- Clean-up ---
    app.dependency_overrides = {}

    # --- Assert ---
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(event["host_id"] == 1 for event in data)


def test_get_events_participant_success():
    # TODO: add test
    pass


def test_get_events_invalid_type():
    # TODO: add test
    pass


def test_get_event_as_host_success():
    # TODO: add test
    pass


def test_get_event_as_participant_success():
    # TODO: add test
    pass


def test_get_event_not_found():
    # TODO: add test
    pass


def test_update_event_success():
    # TODO: add test
    pass


def test_update_event_not_found():
    # TODO: add test
    pass


def test_update_event_unauthorized():
    # TODO: add test
    pass


def test_delete_event_success():
    # TODO: add test
    pass


def test_delete_event_not_found():
    # TODO: add test
    pass


def test_delete_event_unauthorized():
    # TODO: add test
    pass


def test_event_permissions_host_only():
    # TODO: add test
    pass


def test_event_participation_logic():
    # TODO: add test
    pass


def test_create_event_db_error():
    # TODO: add test
    pass


def test_update_event_db_error():
    # TODO: add test
    pass


def test_delete_event_db_error():
    # TODO: add test
    pass
