from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_appointment():

    response = client.post(
        "/appointments",
        json={
            "user_id":2,
            "room_id":1,
            "appointment_title":"Pytest Meeting",
            "appointment_type":"Discussion",
            "appointment_date":"2026-08-15",
            "appointment_time":"15:00:00",
            "duration_minutes":30,
            "description":"Testing"
        }
    )

    assert response.status_code == 200

def test_get_user_appointments():

    response = client.get("/user/2/appointments")

    assert response.status_code == 200
def test_admin_appointments():

    response = client.get("/admin/5/appointments")

    assert response.status_code == 200
def test_accept_appointment():

    response = client.put(
        "/appointments/1/status",
        json={
            "status":"accepted"
        }
    )

    assert response.status_code == 200
def test_reject_appointment():

    response = client.put(
        "/appointments/1/status",
        json={
            "status":"rejected"
        }
    )

    assert response.status_code == 200

def test_cancel_appointment():

    response = client.put(
        "/appointments/1/status",
        json={
            "status":"cancelled"
        }
    )

    assert response.status_code == 200