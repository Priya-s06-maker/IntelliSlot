from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal
from models import User
from schemas import UserCreate
from sqlalchemy import text
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

    return {
        "message": "Backend Running"
    }


@app.post("/signup")
def signup(
    data: UserCreate,
    db: Session = Depends(get_db)
):

    # Check existing email
    existing = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    if existing:

        return {
            "success": False,
            "message": "Email already exists"
        }
from pydantic import BaseModel

class ProfileUpdate(BaseModel):
    email: str
    name: str


class PasswordUpdate(BaseModel):
    email: str
    current_password: str
    new_password: str


class AppointmentStatusUpdate(BaseModel):
    status: str

@app.put("/appointments/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    data: AppointmentStatusUpdate,
    db: Session = Depends(get_db)
):

    sql = """
    UPDATE appointments
    SET status = :status
    WHERE appointment_id = :appointment_id
    """

    result = db.execute(
        text(sql),
        {
            "appointment_id": appointment_id,
            "status": data.status
        }
    )

    db.commit()

    return {
        "success": result.rowcount > 0
    }

@app.put("/profile/update")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    if not user:

        return {
            "success": False
        }

    user.name = data.name

    db.commit()

    db.refresh(user)

    return {
        "success": True
    }


@app.put("/profile/change-password")
def change_password(
    data: PasswordUpdate,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    if not user:

        return {
            "detail":
            "User not found"
        }

    print("DB PASSWORD:", user.password)
    print("CURRENT:", data.current_password)
    print("NEW:", data.new_password)

    if (
        user.password.strip()
        !=
        data.current_password.strip()
    ):

        return {
            "detail":
            "Current password incorrect"
        }

    user.password = (
        data.new_password
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    print(
        "UPDATED PASSWORD:",
        user.password
    )

    return {
        "success":
        True
    }

class AppointmentCreate(BaseModel):

    user_id: int

    room_id: int

    appointment_title: str

    appointment_type: str

    appointment_date: str

    appointment_time: str

    duration_minutes: int

    description: str = ""

class LoginRequest(
BaseModel
):

    email: str

    password: str


@app.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    print("EMAIL RECEIVED:", data.email)
    print("PASSWORD RECEIVED:", data.password)

    if user:
        print("PASSWORD IN DB:", user.password)

    if not user:

        return {
            "detail":
            "No account found"
        }

    if (
        user.password.strip()
        !=
        data.password.strip()
    ):

        return {
            "detail":
            "Incorrect password"
        }

    return {

        "user_id":
        user.user_id,

        "name":
        user.name,

        "email":
        user.email,

        "role_id":
        user.role_id
    }
    # Decide role
    role = data.role.lower().strip()

    if role == "admin":
        role_id = 1
    else:
        role_id = 2

    # Create user
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
@app.post("/appointments")
def create_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db)
):

    sql = """
    INSERT INTO appointments
    (
        user_id,
        room_id,
        appointment_title,
        appointment_type,
        appointment_date,
        appointment_time,
        duration_minutes,
        description,
        status
    )

    VALUES
    (
        :user_id,
        :room_id,
        :title,
        :type,
        :date,
        :time,
        :duration,
        :description,
        'pending'
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

    return {
        "success": True
    }

@app.get(
"/admin/{admin_user_id}/appointments"
)

def get_admin_appointments(
    admin_user_id: int,
    db: Session = Depends(get_db)
):

    sql = """
    SELECT

        a.appointment_id,

        u.name
        AS user_name,

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

    JOIN users u
    ON a.user_id =
       u.user_id

    JOIN rooms r
    ON a.room_id =
       r.room_id

    WHERE

    r.admin_user_id
    =
    :admin_id

    ORDER BY

    a.appointment_date,
    a.appointment_time
    """

    rows = (
        db.execute(
            text(sql),
            {
                "admin_id":
                admin_user_id
            }
        )
        .mappings()
        .all()
    )

    return rows
class AppointmentStatusUpdate(
BaseModel
):

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

@app.put(
"/appointments/edit/{appointment_id}"
)

def edit_appointment(

appointment_id: int,

data:
AppointmentEdit,

db:
Session =
Depends(
get_db
)

):

    sql = """

    UPDATE appointments

    SET

    appointment_title =
    :title,

    appointment_type =
    :type,

    appointment_date =
    :date,

    appointment_time =
    :time,

    duration_minutes =
    :duration,

    room_id =
    :room,

    description =
    :description,

    status =
    :status

    WHERE

    appointment_id =
    :id

    """

    db.execute(

        text(sql),

        {

            "title":
            data.appointment_title,

            "type":
            data.appointment_type,

            "date":
            data.appointment_date,

            "time":
            data.appointment_time,

            "duration":
            data.duration_minutes,

            "room":
            data.room_id,

            "description":
            data.description,

            "status":
            data.status,

            "id":
            appointment_id

        }

    )

    db.commit()

    return {

        "success":
        True

    }
@app.put(
"/appointments/{appointment_id}"
)
def update_appointment_status(

    appointment_id: int,

    data: AppointmentStatusUpdate,

    db: Session = Depends(get_db)

):

    if (
        data.status
        not in
        [
            "accepted",
            "rejected"
        ]
    ):

        return {
            "success": False
        }

    sql = """

    UPDATE appointments

    SET

    status =
    :status

    WHERE

    appointment_id =
    :appointment_id

    """

    db.execute(

        text(sql),

        {

            "status":
            data.status,

            "appointment_id":
            appointment_id

        }

    )

    db.commit()

    return {

        "success":
        True

    }
@app.get(
"/user/{user_id}/appointments"
)

def get_user_appointments(

user_id: int,

db: Session =
Depends(
get_db
)

):

    sql = """

    SELECT

    appointment_id,
    appointment_title,
    appointment_type,
    appointment_date,
    appointment_time,
    duration_minutes,
    description,
    status,
    room_id

    FROM appointments

    WHERE user_id = :user_id

    ORDER BY appointment_date DESC

    """

    result = (
        db.execute(
            text(sql),
            {
                "user_id":
                user_id
            }
        )
        .mappings()
        .all()
    )

    return result    