"""
User Authentication API Router
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from src.main.models.users import User
from src.main.schemas.users_schema import UserCreate, UserResponse, UserRequest
from src.main.database import get_db
from src.main.utils.authentication import (
    hash_password,
    verify_password,
    generate_jwt_token,
)

router = APIRouter(tags=["Authentication"], prefix="/api/auth")


# TODO: does this make more sense to be an authentication route or a user route?
# User create and update should probably be their own router file because they don't actually auth, just create.
@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new user when someone submits the signup form
    """

    # Check if username already exists
    existing_user = (
        db.query(User).filter(User.username == user.username).first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # Create new user
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


@router.post("/signin", response_model=UserResponse)
async def signin(user_request: UserRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    """
    Signs the user in when the correct password
    """

    # Try to get the user from the database
    user = (
        db.query(User).filter(User.username == user_request.username).first()
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    # Verify the user's password
    if not verify_password(user_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password"
        )

    # Generate a JWT token
    token = generate_jwt_token(user)

    # Secure cookies only if running on something besides localhost
    secure = True if request.headers.get("origin") == "localhost" else False

    # Set a cookie with the token in it
    response.set_cookie(
        key="fast_api_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=secure,
    )

    return user


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
