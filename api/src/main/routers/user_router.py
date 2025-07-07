"""
User CRUD/Profile API Router
"""


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.models.patient_profile import PatientProfile
from src.main.models.user import User
from src.main.schemas.user_schema import UserCreate, UserResponse, UserUpdate
from src.main.database import get_db
from src.main.utils.authentication import (
    hash_password,
    try_get_jwt_user_data,
    require_admin,
    set_jwt_cookie_response,
)

router = APIRouter(tags=["Users"], prefix="/api/user")


@router.post("/signup", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Patient or employee/admin signup. If patient, link to existing inactive patient profile or create both. If admin/employee, just create user.
    """

    # If the user is already registered, throw an exception
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # TODO: a user should NOT be able to sign up as an admin.
    if user.role in ["admin", "employee"]:
        db_user = User(
            email=user.email,
            role=user.role,
            hashed_password=hash_password(user.password),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return set_jwt_cookie_response(db_user, response_model=UserResponse)

    elif user.role == "patient":
        # At this point, first_name, last_name, dob, and phone are guaranteed present by schema validation
        patient = db.query(PatientProfile).filter(
            PatientProfile.first_name == user.first_name,
            PatientProfile.last_name == user.last_name,
            PatientProfile.dob == user.dob,
            PatientProfile.phone == user.phone,
            PatientProfile.active == False,
        ).first()

        # If an inactive patient profile exists, claim it
        if patient:
            db_user = User(
                email=user.email,
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

        # If an inactive patient profile DOES NOT exist, create both user and patient profile
        else:
            db_user = User(
                email=user.email,
                role="patient",
                hashed_password=hash_password(user.password),
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            patient = PatientProfile(
                first_name=user.first_name,
                last_name=user.last_name,
                dob=user.dob,
                phone=user.phone,
                active=True,
                user_id=db_user.id,
            )
            db.add(patient)
            db.commit()
            return set_jwt_cookie_response(db_user, response_model=UserResponse)
    else:
        raise HTTPException(status_code=400, detail="Invalid role")


@router.get("/authenticate", response_model=UserResponse)
async def get_user(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Returns the user if logged in, else 404.
    """

    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    return user


@router.put("/update", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Updates the user profile
    """

    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    if user_update.role is not None:
        user.role = user_update.role
    if user_update.password is not None:
        user.hashed_password = hash_password(user_update.password)
    db.commit()
    db.refresh(user)
    return user


@router.put(
    "/{user_id}/role",
    response_model=UserResponse,
    dependencies=[Depends(require_admin)],
)
async def update_user_role(
    user_id: int, new_role: str, db: Session = Depends(get_db)
):
    """
    Updates a user's role. Admin access required.
    """

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = new_role
    db.commit()
    db.refresh(user)
    return user


@router.delete("/delete", status_code=204)
async def delete_user(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Deletes the current user profile from the database.
    """

    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return None
