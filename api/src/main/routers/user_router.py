"""
API Router for User CRUD endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.models.patient_profile import PatientProfile
from src.main.models.user import User
from src.main.schemas.user_schema import (
    PatientCreate,
    EmployeeCreate,
    UserResponse,
    UserUpdate,
)
from src.main.database import get_db
from src.main.utils.authentication import (
    hash_password,
    try_get_jwt_user_data,
    require_admin,
    set_jwt_cookie_response,
)

router = APIRouter(tags=["Users"], prefix="/api/users")


@router.post("", response_model=UserResponse)
async def create_patient(user: PatientCreate, db: Session = Depends(get_db)):
    """
    Creates a patient User and an active Patient Profile
    """
    # Checks if the User is registered
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # Creates a User
    db_user = User(
        email=user.email,
        role="patient",
        hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Locates the inactive Patient Profile if it exists
    patient = (
        db.query(PatientProfile)
        .filter(
            PatientProfile.first_name == user.first_name,
            PatientProfile.last_name == user.last_name,
            PatientProfile.dob == user.dob,
            PatientProfile.phone == user.phone,
            PatientProfile.active == False,
        )
        .first()
    )

    # Claims the inactive Patient Profile if it exists
    if patient:
        patient.user_id = db_user.id
        patient.active = True
        db.commit()
        return set_jwt_cookie_response(db_user, response_model=UserResponse)

    # Creates a Patient Profile if it does not exist
    else:
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


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Gets the current User data if logged in
    """

    # Checks if JWT is valid
    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")

    # Checks if the user is registered
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    return user


# TODO: An email invite should be sent to the employee's work email to claim and reset their password
@router.post(
    "/employee",
    response_model=UserResponse,
    dependencies=[Depends(require_admin)],
)
async def create_employee(user: EmployeeCreate, db: Session = Depends(get_db)):
    """
    ADMIN-ONLY: Creates an employee User
    """

    # TODO: Consider moving this query into a utils folder and call it in the different routes.
    # Checks if the user is registered
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # Creates a User with an employee role
    db_user = User(
        email=user.email,
        role="employee",
        hashed_password=hash_password(user.password),
    )

    # Adds the employee User to the database
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return set_jwt_cookie_response(db_user, response_model=UserResponse)


# TODO: Split into /update_auth and /update_profile. /update_auth will update the users password by sending an email.
@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Updates the current User and Patient Profile (patients only)
    """

    # Checks if JWT is valid
    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")

    # Checks if the User is registered
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")

    # Update User attributes
    if user_update.password is not None:
        user.hashed_password = hash_password(user_update.password)
    if user_update.email is not None:
        user.email = user_update.email

    # Update Patient Profile attributes (patients only)
    patient_profile = (
        db.query(PatientProfile)
        .filter(PatientProfile.user_id == user.id)
        .first()
    )
    if patient_profile:
        if user_update.first_name is not None:
            patient_profile.first_name = user_update.first_name
        if user_update.last_name is not None:
            patient_profile.last_name = user_update.last_name
        if user_update.phone is not None:
            patient_profile.phone = user_update.phone

    # Update the database
    db.commit()
    db.refresh(user)
    return user


@router.delete("/me", status_code=204)
async def delete_current_user(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Deletes the current User
    """

    # Checks if JWT is valid
    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")

    # Checks if the User is registered
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")

    # Deletes the current User
    db.delete(user)
    db.commit()
    return None


# TODO: Add GET request routers
# @router.get("/me", response_model=UserResponse)
# async def get_current_user(...):
#     # Use try_get_jwt_user_data to get the current user

# @router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(require_admin)])
# async def get_user_by_id(user_id: int, ...):
#     # Admin can get any user by ID
