"""
API Router for User CRUD endpoints
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import User
from src.main.schemas import UserCreate, UserResponse
from src.main.utils import (
    get_jwt_user_data,
    hash_password,
    set_jwt_cookie_response,
)

router = APIRouter(tags=["Users"], prefix="/users")


@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    # List all users in the database. Return user details.
    return db.query(User).all()


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate, db: Session = Depends(get_db), response: Response = None
):
    # Check if email already exists. Return error if found.
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400, detail="A user with this email already exists."
        )

    # Create the new user. Commit user to DB.
    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        is_registered=True,
        hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Sign in the user upon creation by setting the JWT cookie. Return user details.
    return set_jwt_cookie_response(db_user, response_model=UserResponse)


@router.get("/me", response_model=UserResponse)
def get_current_user(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(get_jwt_user_data),
):
    # Check if user is logged in. Get user details from DB.
    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()

    # Check if user exists. Return error if not found.
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    return user


@router.delete("/me", status_code=204)
def delete_current_user(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(get_jwt_user_data),
):
    # Check if user is logged in. Get user details from DB.
    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()

    # Check if user exists. Return error if not found.
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete the current user from the database. Commit changes.
    db.delete(user)
    db.commit()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    # Get user details by user_id. Return error if not found.
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
