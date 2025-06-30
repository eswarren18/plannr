"""
User CRUD/Profile API Router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.models.user import User
from src.main.schemas.user_schema import UserCreate, UserResponse, UserUpdate
from src.main.database import get_db
from src.main.utils.authentication import hash_password, try_get_jwt_user_data

router = APIRouter(tags=["Users"], prefix="/api/user")

@router.post("/signup", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new user when someone submits the signup form
    """
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")
    db_user = User(
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        role="customer",
        hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/update", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data)
):
    """
    Updates the user profile
    """
    user = db.query(User).filter(User.username == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    if user_update.first_name is not None:
        user.first_name = user_update.first_name
    if user_update.last_name is not None:
        user.last_name = user_update.last_name
    if user_update.role is not None:
        user.role = user_update.role
    if user_update.password is not None:
        user.hashed_password = hash_password(user_update.password)
    db.commit()
    db.refresh(user)
    return user

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
    user = db.query(User).filter(User.username == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")
    return user

@router.delete("/delete", status_code=204)
async def delete_user(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data)
):
    """
    Deletes the current user profile from the database.
    """
    user = db.query(User).filter(User.username == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return None
