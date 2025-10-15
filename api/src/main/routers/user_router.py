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
    hash_password,
    set_jwt_cookie_response,
    try_get_jwt_user_data,
)

router = APIRouter(tags=["Users"], prefix="/users")


@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate, db: Session = Depends(get_db), response: Response = None
):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400, detail="A user with this email already exists."
        )

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

    # sign in user upon creation
    return set_jwt_cookie_response(db_user, response_model=UserResponse)


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
