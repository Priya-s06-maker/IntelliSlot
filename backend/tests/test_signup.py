
from fastapi.testclient import TestClient
from main import app
import uuid
client = TestClient(app)
def test_signup_new_user():

    unique = uuid.uuid4().hex[:8]

    response = client.post(
        "/signup",
        json={
            "name":"Pytest User",
            "email":f"pytest_{unique}@gmail.com",
            "password":f"Test@{unique}",
            "role":"user"
        }
    )

    assert response.status_code == 200
    assert response.json()["success"] == True
    
def test_signup_existing_email():

    response = client.post(
        "/signup",
        json={
            "name":"Duplicate",
            "email":"directadmin@gmail.com",
            "password":"Test@123",
            "role":"admin"
        }
    )

    assert response.status_code == 200
    assert response.json()["success"] == False