from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_update_profile():

    response = client.put(
        "/profile/update",
        json={
            "email":"directadmin@gmail.com",
            "name":"Updated Admin"
        }
    )

    assert response.status_code == 200
    assert response.json()["success"] == True

def test_update_invalid_profile():

    response = client.put(
        "/profile/update",
        json={
            "email":"xyz@gmail.com",
            "name":"Nobody"
        }
    )

    assert response.status_code == 200
    assert response.json()["success"] == False

def test_change_password_success():

    response = client.put(
        "/admin/change-password",
        json={
            "email":"directadmin@gmail.com",
            "current":"Admin@123",
            "new":"Admin@123"
        }
    )

    assert response.status_code == 200
    assert response.json()["success"] == True

def test_change_password_wrong_current():

    response = client.put(
        "/admin/change-password",
        json={
            "email":"directadmin@gmail.com",
            "current":"Wrong123",
            "new":"Admin@123"
        }
    )

    assert response.status_code == 200
    assert response.json()["success"] == False