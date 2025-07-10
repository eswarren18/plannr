"""
API Router for User CRUD endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from src.main.models.user import User
from src.main.schemas.user_schema import (
    UserCreate,
    UserResponse,
    UserUpdate,
    EmployeeCreate,
)
from src.main.database import get_db
from src.main.utils.authentication import (
    hash_password,
    try_get_jwt_user_data,
    require_admin,
    set_jwt_cookie_response,
)

router = APIRouter(tags=["Users"], prefix="/api/users")

@router.post("active-patient", response_model=UserResponse)
async def create_active_patient(user: UserCreate, db: Session = Depends(get_db)):
    """
    Creates a patient with an active profile
    """

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")
    inactive_patient = db.query(User).filter(
        User.first_name == user.first_name,
        User.last_name == user.last_name,
        User.dob == user.dob,
        User.phone == user.phone,
        User.active == False,
        User.role == None,
        User.email == None,
    ).first()
    if inactive_patient:
        inactive_patient.email = user.email
        inactive_patient.hashed_password = hash_password(user.password)
        inactive_patient.role = "patient"
        inactive_patient.active = True
        db.commit()
        db.refresh(inactive_patient)
        content = jsonable_encoder(UserResponse.from_orm(inactive_patient))
        return set_jwt_cookie_response(inactive_patient, response_model=UserResponse, custom_content=content)
    else:
        db_user = User(
            email=user.email,
            role="patient",
            hashed_password=hash_password(user.password),
            first_name=user.first_name,
            last_name=user.last_name,
            dob=user.dob,
            phone=user.phone,
            active=True,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        content = jsonable_encoder(UserResponse.from_orm(db_user))
        return set_jwt_cookie_response(db_user, response_model=UserResponse, custom_content=content)


@router.post(
    "/inactive-patient",
    response_model=UserResponse,
    dependencies=[Depends(require_admin)],
)
async def create_inactive_patient(user: UserCreate, db: Session = Depends(get_db)):
    """
    ADMIN-ONLY: Creates a patient with an inactive profile
    """

    existing = db.query(User).filter(
        User.first_name == user.first_name,
        User.last_name == user.last_name,
        User.dob == user.dob,
        User.phone == user.phone,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Patient already exists")
    patient = User(
        first_name=user.first_name,
        last_name=user.last_name,
        dob=user.dob,
        phone=user.phone,
        active=False,
        email=None,
        hashed_password=None,
        role=None,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.post(
    "/employee",
    response_model=UserResponse,
    dependencies=[Depends(require_admin)],
)
async def create_employee(user: EmployeeCreate, db: Session = Depends(get_db)):
    """
    ADMIN-ONLY: Creates an employee
    """

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")
    db_user = User(
        email=user.email,
        role="employee",
        hashed_password=hash_password(user.password),
        first_name=user.first_name,
        last_name=user.last_name,
        dob=None,
        phone=None,
        active=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Gets the current User data
    """

    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    return user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Updates the current User
    """
    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    if user_update.password is not None:
        user.hashed_password = hash_password(user_update.password)
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.first_name is not None:
        user.first_name = user_update.first_name
    if user_update.last_name is not None:
        user.last_name = user_update.last_name
    if user_update.phone is not None:
        user.phone = user_update.phone
    if user_update.dob is not None:
        user.dob = user_update.dob
    if user_update.active is not None:
        user.active = user_update.active
    if user_update.role is not None:
        user.role = user_update.role
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

    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    db.delete(user)
    db.commit()
    return None
