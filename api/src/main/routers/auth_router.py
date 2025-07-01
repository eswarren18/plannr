"""
User Authentication API Router
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
from src.main.models.user import User
from src.main.schemas.user_schema import UserRequest, UserResponse
from src.main.database import get_db
from src.main.utils.authentication import (
    generate_jwt_token,
    verify_password,
    set_jwt_cookie_response,
)

router = APIRouter(tags=["Authentication"], prefix="/api/auth")


@router.post("/signin", response_model=UserResponse)
async def signin(
    user_request: UserRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    """
    Signs the user in when the correct password
    """

    # Try to get the user from the database
    user = (
        db.query(User).filter(User.username == user_request.username).first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Verify the user's password
    if not verify_password(user_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    return set_jwt_cookie_response(user, response_model=UserResponse)


@router.delete("/signout")
async def signout(request: Request, response: Response):
    """
    Signs the user out by deleting their JWT Cookie
    """

    # Secure cookies only if running on something besides localhost
    secure = True if request.headers.get("origin") == "localhost" else False

    # Delete cookie
    response.delete_cookie(
        key="fast_api_token", httponly=True, samesite="lax", secure=secure
    )

    return None
