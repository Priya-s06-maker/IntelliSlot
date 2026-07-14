

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from pydantic import BaseModel

from database import SessionLocal
from models import User
from schemas import UserCreate
from ai_service import check_schedule_conflict
from datetime import datetime, timedelta
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.get("/ai/test")
def ai_test():
    existing = """
09:00 - 10:00 Team Meeting
10:00 - 11:00 Client Review
2:00 - 3:00 Sprint Planning
"""
    new = """
10:30 - 11:30 Project Discussion
"""
    return {
        "response": check_schedule_conflict(existing, new)
    }


@app.post("/signup")
def signup(data: UserCreate, db: Session = Depends(get_db)):
    # Check existing email
    existing = db.query(User).filter(User.email == data.email).first()

    if existing:
        return {"success": False, "message": "Email already exists"}

    # Decide role (assuming UserCreate has role field)
    role = data.role.lower().strip() if hasattr(data, 'role') else "user"
    role_id = 1 if role == "admin" else 2

    new_user = User(
        name=data.name,
        email=data.email,
        password=data.password,
        role_id=role_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "user_id": new_user.user_id,
        "role_id": new_user.role_id
    }


class ProfileUpdate(BaseModel):
    email: str
    name: str


class PasswordUpdate(BaseModel):
    email: str
    current_password: str
    new_password: str


class AdminPasswordUpdate(BaseModel):
    email: str
    current: str
    new: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AppointmentCreate(BaseModel):
    user_id: int
    room_id: int
    appointment_title: str
    appointment_type: str
    appointment_date: str
    appointment_time: str
    duration_minutes: int
    description: str = ""


class AppointmentStatusUpdate(BaseModel):
    status: str


class AppointmentEdit(BaseModel):
    appointment_title: str
    appointment_type: str
    appointment_date: str
    appointment_time: str
    duration_minutes: int
    room_id: int
    description: str = ""
    status: str = "pending"


@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    print("EMAIL RECEIVED:", data.email)
    print("PASSWORD RECEIVED:", data.password)

    if not user:
        return {"detail": "No account found"}

    if user.password.strip() != data.password.strip():
        return {"detail": "Incorrect password"}

    return {
        "user_id": user.user_id,
        "name": user.name,
        "email": user.email,
        "role_id": user.role_id
    }

def to_datetime(date, time):

    return datetime.strptime(
        f"{date} {time}",
        "%Y-%m-%d %H:%M:%S"
    )
def overlaps(start1, end1, start2, end2):

    return start1 < end2 and start2 < end1
def find_next_available_slot(
    db,
    room_id,
    appointment_date,
    duration_minutes
):

    sql = """
    SELECT
        appointment_time,
        duration_minutes

    FROM appointments

    WHERE
        room_id=:room
    AND
        appointment_date=:date

    ORDER BY appointment_time
    """

    rows = db.execute(

        text(sql),

        {
            "room": room_id,
            "date": appointment_date
        }

    ).mappings().all()

    current = datetime.strptime(
        appointment_date + " 07:00:00",
        "%Y-%m-%d %H:%M:%S"
    )

    duration = timedelta(
        minutes=duration_minutes
    )

    for row in rows:

        existing_start = to_datetime(
            appointment_date,
            row["appointment_time"]
        )

        existing_end = (
            existing_start
            +
            timedelta(
                minutes=row["duration_minutes"]
            )
        )

        if current + duration <= existing_start:

            return current.strftime("%H:%M")

        if current < existing_end:

            current = existing_end

    return current.strftime("%H:%M")
@app.post("/appointments")
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    # Check for schedule conflicts using AI
#     existing_sql = """
#     SELECT appointment_title, appointment_date, appointment_time, duration_minutes
#     FROM appointments
#     WHERE room_id = :room_id AND appointment_date = :appointment_date
#     """

#     rows = db.execute(
#         text(existing_sql),
#         {"room_id": data.room_id, "appointment_date": data.appointment_date}
#     ).mappings().all()

#     existing_bookings = ""
#     for row in rows:
#         existing_bookings += f"{row['appointment_time']} - {row['appointment_title']}\n"

#     new_booking = f"""
# Title: {data.appointment_title}
# Date: {data.appointment_date}
# Time: {data.appointment_time}
# Duration: {data.duration_minutes} minutes
# """

#     ai_result = check_schedule_conflict(existing_bookings, new_booking)
#     print("AI Conflict Check:", ai_result)
#     if ai_result["conflict"]:

#         return {
#             "success": False,
#             "ai": ai_result
#     }


    requested_start = to_datetime(
        data.appointment_date,
        data.appointment_time
    )

    requested_end = (
        requested_start +
        timedelta(minutes=data.duration_minutes)
    )

    sql = """
    SELECT
        appointment_title,
        appointment_time,
        duration_minutes,
        room_id,
        user_id
    FROM appointments
    WHERE appointment_date=:date
    """

    appointments = db.execute(
        text(sql),
        {
            "date": data.appointment_date
        }
    ).mappings().all()

    conflict_type = None
    conflict_title = ""
    for appt in appointments:
        existing_start = to_datetime(
            data.appointment_date,
            appt["appointment_time"]
        )

        existing_end = (
            existing_start +
            timedelta(minutes=appt["duration_minutes"])
        )

        if overlaps(
            requested_start,
            requested_end,
            existing_start,
            existing_end
        ):
            if appt["user_id"] == data.user_id:
                conflict_type = "USER"
                conflict_title = appt["appointment_title"]
                break

            if appt["room_id"] == data.room_id:
                conflict_type = "ROOM"
                conflict_title = appt["appointment_title"]
                break

    # === CONFLICT HANDLING ===
    if conflict_type:
        suggested_slot = find_next_available_slot(
            db,
            data.room_id,
            data.appointment_date,
            data.duration_minutes
        )

        if conflict_type == "USER":
            existing = f"""
User already has appointment:

Title:
{conflict_title}

Requested Time:
{data.appointment_time}
"""

            new = """
Explain in one professional sentence why
the user cannot attend two meetings at the same time.

Return JSON only.
"""

        else:  # ROOM conflict
            existing = f"""
Room already booked:

Title:
{conflict_title}

Requested Time:
{data.appointment_time}
"""

            new = """
Explain in one professional sentence why
the room cannot be booked twice.

Return JSON only.
"""

        ai_result = check_schedule_conflict(
            existing,
            new
        )

        ai_result["suggested_slot"] = suggested_slot
        ai_result["conflict_type"] = conflict_type

        return {
            "success": False,
            "ai": ai_result
        }
    
    # INSERT query will come here
    # Insert appointment
    sql = """
    INSERT INTO appointments (
        user_id, room_id, appointment_title, appointment_type,
        appointment_date, appointment_time, duration_minutes,
        description, status
    ) VALUES (
        :user_id, :room_id, :title, :type, :date, :time,
        :duration, :description, 'pending'
    )
    """

    db.execute(
        text(sql),
        {
            "user_id": data.user_id,
            "room_id": data.room_id,
            "title": data.appointment_title,
            "type": data.appointment_type,
            "date": data.appointment_date,
            "time": data.appointment_time,
            "duration": data.duration_minutes,
            "description": data.description
        }
    )

    db.commit()
    return {"success": True}


@app.get("/admin/{admin_user_id}/appointments")
def get_admin_appointments(admin_user_id: int, db: Session = Depends(get_db)):
    sql = """
    SELECT 
        a.appointment_id,
        u.name AS user_name,
        u.email,
        r.room_name,
        a.appointment_title,
        a.appointment_type,
        a.appointment_date,
        a.appointment_time,
        a.duration_minutes,
        a.description,
        a.status
    FROM appointments a
    JOIN users u ON a.user_id = u.user_id
    JOIN rooms r ON a.room_id = r.room_id
    WHERE r.admin_user_id = :admin_id
    ORDER BY a.appointment_date, a.appointment_time
    """

    rows = db.execute(text(sql), {"admin_id": admin_user_id}).mappings().all()
    return rows


@app.put("/appointments/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    data: AppointmentStatusUpdate,
    db: Session = Depends(get_db)
):
    if data.status not in ["accepted", "rejected","cancelled"]:
        return {"success": False}

    sql = """
    UPDATE appointments
    SET status = :status
    WHERE appointment_id = :appointment_id
    """

    result = db.execute(
        text(sql),
        {"status": data.status, "appointment_id": appointment_id}
    )
    db.commit()

    return {"success": result.rowcount > 0}


@app.put("/appointments/edit/{appointment_id}")
def edit_appointment(
    appointment_id: int,
    data: AppointmentEdit,
    db: Session = Depends(get_db)
):
    sql = """
    UPDATE appointments
    SET appointment_title = :title,
        appointment_type = :type,
        appointment_date = :date,
        appointment_time = :time,
        duration_minutes = :duration,
        room_id = :room,
        description = :description,
        status = :status
    WHERE appointment_id = :id
    """

    db.execute(
        text(sql),
        {
            "title": data.appointment_title,
            "type": data.appointment_type,
            "date": data.appointment_date,
            "time": data.appointment_time,
            "duration": data.duration_minutes,
            "room": data.room_id,
            "description": data.description,
            "status": data.status,
            "id": appointment_id
        }
    )
    db.commit()
    return {"success": True}


@app.put("/profile/update")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return {"success": False}

    user.name = data.name
    db.commit()
    db.refresh(user)
    return {"success": True}


@app.put("/profile/change-password")
def change_password(data: PasswordUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return {"detail": "User not found"}

    if user.password.strip() != data.current_password.strip():
        return {"detail": "Current password incorrect"}

    user.password = data.new_password
    db.commit()
    db.refresh(user)
    return {"success": True}


@app.put("/admin/change-password")
def change_admin_password(data: AdminPasswordUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return {"success": False, "message": "Admin not found"}

    if user.password.strip() != data.current.strip():
        return {"success": False, "message": "Current password incorrect"}

    user.password = data.new
    db.commit()
    db.refresh(user)
    return {"success": True}


@app.get("/user/{user_id}/appointments")
def get_user_appointments(user_id: int, db: Session = Depends(get_db)):
    sql = """
    SELECT 
        appointment_id, appointment_title, appointment_type,
        appointment_date, appointment_time, duration_minutes,
        description, status, room_id
    FROM appointments
    WHERE user_id = :user_id
    ORDER BY appointment_date DESC
    """

    result = db.execute(text(sql), {"user_id": user_id}).mappings().all()
    return result