from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login_invalid_password():

    response = client.post(
        "/login",
        json={
            "email": "abcd@gmail.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 200
    assert "detail" in response.json()
def test_login_success():

    response = client.post(
        "/login",
        json={
            "email":"directadmin@gmail.com",
            "password":"Admin@123"
        }
    )

    assert response.status_code == 200
    assert response.json()["role_id"] == 1

def test_login_invalid_email():

    response = client.post(
        "/login",
        json={
            "email":"abcd@gmail.com",
            "password":"Admin@123"
        }
    )

    assert response.status_code == 200
    assert response.json()["detail"] == "No account found"