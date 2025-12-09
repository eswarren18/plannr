def test_create_user(test_client):
    payload = {
        "email": "integration@example.com",
        "first_name": "Integration",
        "last_name": "Test",
        "password": "testpassword",
    }

    response = test_client.post("/api/users/", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert data["email"] == payload["email"]
    assert "id" in data
