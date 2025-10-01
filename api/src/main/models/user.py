"""
SQLAlchemy ORM model for the User entity.

Defines the structure of the users table in the database, including columns
and constraints.
"""

from sqlalchemy import Boolean, Column, Date, Integer, String
from src.main.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(
        String, unique=True, index=True, nullable=True
    )  # nullable for inactive admin-created patients
    hashed_password = Column(
        String, nullable=True
    )  # nullable for inactive admin-created patients
    role = Column(
        String, nullable=True
    )  # nullable for inactive admin-created patients
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    dob = Column(
        Date, nullable=True
    )  # required for patients, nullable for employees/admins
    phone = Column(
        String, nullable=True
    )  # required for patients, nullable for employees/admins
    active = Column(
        Boolean, nullable=False, default=True
    )  # True for employees/admins, can be False for patients
