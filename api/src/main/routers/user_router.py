"""
API Router for User CRUD endpoints
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models.user import User
from src.main.schemas.user_schema import UserCreate, UserResponse, UserUpdate
from src.main.utils.authentication import hash_password, try_get_jwt_user_data

router = APIRouter(tags=["Users"], prefix="/users")


@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        is_registered=user.is_registered,
        hashed_password=user.hashed_password,
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


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
