"""
SQLAlchemy ORM model for the PatientProfile entity.

Defines the structure of the patient_profiles table in the database, including
columns, relationships, and constraints.
"""

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    ForeignKey,
    UniqueConstraint,
    Boolean,
)
from sqlalchemy.orm import relationship
from src.main.database import Base


class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    dob = Column(Date, nullable=False)
    phone = Column(String, nullable=False)
    active = Column(Boolean, nullable=False, default=False)
    user_id = Column(
        Integer, ForeignKey("users.id"), unique=True, nullable=True
    )

    user = relationship("User", backref="patient_profile", uselist=False)

    __table_args__ = (
        UniqueConstraint("first_name", "last_name", "dob", "phone", name="uq_patient_identity"),
    )
