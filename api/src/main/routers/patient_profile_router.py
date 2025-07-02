"""
Patient Profiles CRUD API Router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.models.user import User
from src.main.models.patient_profile import PatientProfile
from src.main.schemas.user_schema import UserCreate, UserResponse
from src.main.schemas.patient_profile_schema import PatientProfileCreate, PatientProfileRead
from src.main.database import get_db
from src.main.utils.authentication import (
    hash_password,
    set_jwt_cookie_response,
)

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
    patient = PatientProfile(**profile.dict(), active=False, user_id=None)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.post("/activate", response_model=UserResponse)
async def activate_patient_profile(
    user: UserCreate, profile_info: PatientProfileCreate, db: Session = Depends(get_db)
):
    """
    Patient claims/activates their profile. If a matching inactive profile exists, link it and activate. Otherwise, create both.
    """
    # Check for existing inactive patient profile
    patient = db.query(PatientProfile).filter(
        PatientProfile.first_name == profile_info.first_name,
        PatientProfile.last_name == profile_info.last_name,
        PatientProfile.dob == profile_info.dob,
        PatientProfile.phone == profile_info.phone,
        PatientProfile.active == False,
    ).first()
    if patient:
        # Create user, link, and activate
        db_user = User(
            username=user.username,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role="patient",
            hashed_password=hash_password(user.password),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        patient.user_id = db_user.id
        patient.active = True
        db.commit()
        return set_jwt_cookie_response(db_user, response_model=UserResponse)
    else:
        # Create both user and patient profile
        db_user = User(
            username=user.username,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role="patient",
            hashed_password=hash_password(user.password),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        patient = PatientProfile(
            first_name=profile_info.first_name,
            last_name=profile_info.last_name,
            dob=profile_info.dob,
            phone=profile_info.phone,
            email=profile_info.email,
            active=True,
            user_id=db_user.id,
        )
        db.add(patient)
        db.commit()
        return set_jwt_cookie_response(db_user, response_model=UserResponse)
