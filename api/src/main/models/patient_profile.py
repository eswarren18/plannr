"""
SQLAlchemy ORM model for the PatientProfile entity.

Defines the structure of the patient_profiles table in the database, including
columns, relationships, and constraints. This model is used for database
operations and is separate from API schemas.
"""

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from src.main.database import Base


class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dob = Column(Date, nullable=False)
    phone = Column(String, nullable=False)
    user_id = Column(
        Integer, ForeignKey("users.id"), unique=True, nullable=True
    )

    user = relationship("User", backref="patient_profile", uselist=False)

    __table_args__ = (
        UniqueConstraint("name", "dob", "phone", name="uq_patient_identity"),
    )
