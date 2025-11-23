"""
API Router for Authentication CRUD endpoints
"""

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import User
from src.main.schemas import UserRequest, UserResponse
from src.main.utils import set_jwt_cookie_response, verify_password

router = APIRouter(tags=["Authentication"], prefix="/api/auth")


@router.post("/signin", response_model=UserResponse)
def signin(user_request: UserRequest, db: Session = Depends(get_db)):
    # Try to get the user from the database. Return error if not found.
    user = db.query(User).filter(User.email == user_request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Verify the user's password. Return error if incorrect.
    if not verify_password(user_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Sign in the user by setting the JWT cookie. Return user details.
    return set_jwt_cookie_response(user, response_model=UserResponse)


@router.delete("/signout")
def signout(request: Request, response: Response):
    # Signs out the user by deleting their JWT cookie.

    # Set secure cookies only if using HTTPS (production). For local dev (HTTP), set secure=False.
    secure = request.url.scheme == "https"

    # Check if the cookie is present. Return message if not signed in.
    cookie = request.cookies.get("fast_api_token")
    if not cookie:
        return {"detail": "No user was signed in"}

    # Delete the JWT cookie. Return sign out confirmation.
    response.delete_cookie(
        key="fast_api_token", httponly=True, samesite="lax", secure=secure
    )

    return {"detail": "User has been signed out"}
