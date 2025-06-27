"""
SQLAlchemy ORM model for the User entity.

Defines the structure of the users table in the database, including columns and constraints. This model is used for database operations and is separate from API schemas and authentication models.
"""

from sqlalchemy import Column, Integer, String
from src.main.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
