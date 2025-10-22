"""
API Router for User CRUD endpoints
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import Invite, User
from src.main.schemas import UserCreate, UserResponse
from src.main.utils import (
    get_current_user_from_token,
    hash_password,
    set_jwt_cookie_response,
)

router = APIRouter(tags=["Users"], prefix="/users")


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
    # Backfill invites for this email
    invites = (
        db.query(Invite)
        .filter(Invite.email == db_user.email, Invite.user_id == None)
        .all()
    )
    for invite in invites:
        invite.user_id = db_user.id
    db.commit()
    # Sign in the user upon creation by setting the JWT cookie. Return user details.
    return set_jwt_cookie_response(db_user, response_model=UserResponse)


# TODO: This lists all users even when not signed in. What situation will this be needed?
@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    # List all users in the database. Return user details.
    return db.query(User).all()


@router.get("/me", response_model=UserResponse)
def list_current_user(user: User = Depends(get_current_user_from_token)):
    # Returns the current User object from the JWT token in the cookie.
    # This endpoint is similar to get_current_user_from_token, but is exposed as an API route for clients to fetch their own user data.
    return user


@router.delete("/me", status_code=204)
def delete_current_user(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Delete invites by user_id or email
    db.query(Invite).filter(
        (Invite.user_id == user.id) | (Invite.email == user.email)
    ).delete(synchronize_session=False)
    db.commit()
    # Delete the current user from the database. Commit changes.
    db.delete(user)
    db.commit()


@router.get("/{user_id}", response_model=UserResponse)
def list_user(user_id: int, db: Session = Depends(get_db)):
    # Get user details by user_id. Return error if not found.
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# TODO: update user endpoint for users to update their account info
