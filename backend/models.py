from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import declarative_base


Base = declarative_base()


class Role(Base):

    __tablename__ = "roles"

    id = Column(
        Integer,
        primary_key=True
    )

    name = Column(
        String(5),
        nullable=False
    )


class User(Base):

    __tablename__ = "users"

    user_id = Column(
        Integer,
        primary_key=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password = Column(
        String(50),
        nullable=False
    )

    role_id = Column(
        Integer,
        ForeignKey(
            "roles.id"
        )
    )