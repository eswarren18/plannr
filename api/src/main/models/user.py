"""
SQLAlchemy ORM model for the User entity.

Defines the structure of the users table in the database, including columns
and constraints.
"""

from sqlalchemy import Column, Integer, String
from src.main.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'admin', 'employee', or 'patient'
