"""
Patient Profiles CRUD API Router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.models.patient_profile import PatientProfile
from src.main.schemas.patient_profile_schema import PatientProfileCreate, PatientProfileRead
from src.main.database import get_db

router = APIRouter(tags=["Patient Profiles"], prefix="/api/patient_profile")

@router.post("/admin-create", response_model=PatientProfileRead)
async def admin_create_patient_profile(
    profile: PatientProfileCreate, db: Session = Depends(get_db)
):
    """
    Admin creates an inactive patient profile (no user_id, active=False).
    """

    existing = db.query(PatientProfile).filter(
        PatientProfile.first_name == profile.first_name,
        PatientProfile.last_name == profile.last_name,
        PatientProfile.dob == profile.dob,
        PatientProfile.phone == profile.phone,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Patient profile already exists")
    patient = PatientProfile(**profile.model_dump(), user_id=None)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient
