"""
User Authentication API Router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.main.models.users import User
from src.main.schemas.users_schema import UserCreate, UserRead
from src.main.database import get_db
from src.main.utils.authentication import hash_password

router = APIRouter(tags=["Authentication"], prefix="/api/auth")

@router.post("/signup", response_model=UserRead)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    print(db.query(User))
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # Create new user
    db_user = User(
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        role="customer",
        hashed_password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/signin")
async def signin():
    """
    Signs the user in when they use the Sign In form
    """

    return None


# @router.get("/authenticate")
# async def authenticate():
#     """
#     This function returns the user if the user is logged in.

#     The `try_get_jwt_user_data` function tries to get the user and validate
#     the JWT

#     If the user isn't logged in this returns a 404

#     This can be used in your frontend to determine if a user
#     is logged in or not
#     """
#     return None


# @router.delete("/signout")
# async def signout():
#     """
#     Signs the user out by deleting their JWT Cookie
#     """
#     return None
