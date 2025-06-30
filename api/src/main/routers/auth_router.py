"""
User Authentication API Router
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from src.main.models.users import User
from src.main.schemas.users_schema import UserCreate, UserResponse, UserRequest, UserUpdate
from src.main.database import get_db
from src.main.utils.authentication import (
    hash_password,
    verify_password,
    generate_jwt_token,
    try_get_jwt_user_data
)

router = APIRouter(tags=["Authentication"], prefix="/api/auth")


# TODO: Router organization. Consider splitting some routes into a user_router file. Routes that don't have anything to do with authentication or authorization.
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

    # Create, add, and return new user
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
async def update(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data)
):
    """
    Updates the user profile
    """

    # Fetch the user from the database
    user = db.query(User).filter(User.username == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not logged in")

    # Update, add, and return new user
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


@router.delete("/signout")
async def signout(request: Request, response: Response):
    """
    Signs the user out by deleting their JWT Cookie
    """

    # Secure cookies only if running on something besides localhost
    secure = True if request.headers.get("origin") == "localhost" else False

    # Delete cookie
    response.delete_cookie(key="fast_api_token", httponly=True, samesite="lax", secure=secure)

    return None


@router.get("/authenticate", response_model=UserResponse)
async def authenticate(
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(try_get_jwt_user_data),
):
    """
    Returns the user if logged in, else 404.
    """

    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not logged in")
    user = db.query(User).filter(User.username == jwt_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not logged in")
    return user
