from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_conflicting_appointment():

    response = client.post(
        "/appointments",
        json={
            "user_id": 2,
            "room_id": 1,
            "appointment_title": "Pytest Conflict",
            "appointment_type": "Meeting",
            "appointment_date": "2026-07-24",
            "appointment_time": "07:00:00",
            "duration_minutes": 30,
            "description": "Conflict Test"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] == False
    assert data["ai"]["conflict"] == True

from datetime import datetime, timedelta

future_date = (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d")

future_hour = (datetime.now().hour + 5) % 24

appointment_time = f"{future_hour:02d}:00:00"