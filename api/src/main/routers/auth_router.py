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
from src.main.models.user import User
from src.main.schemas.user_schema import UserRequest, UserResponse
from src.main.database import get_db
from src.main.utils.authentication import (
    verify_password,
    set_jwt_cookie_response,
)

router = APIRouter(tags=["Authentication"], prefix="/api/auth")


@router.post("/signin", response_model=UserResponse)
async def signin(
    user_request: UserRequest,
    db: Session = Depends(get_db),
):
    """
    Signs in the User
    """

    # Trys to get the User from the database
    user = db.query(User).filter(User.email == user_request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Verifys the User password
    if not verify_password(user_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    return set_jwt_cookie_response(user, response_model=UserResponse)


@router.delete("/signout")
async def signout(request: Request, response: Response):
    """
    Signs out the User by deleting their JWT Cookie
    """

    # Secure cookies only if running on something besides localhost
    secure = True if request.headers.get("origin") == "localhost" else False

    # Delete cookie
    response.delete_cookie(
        key="fast_api_token", httponly=True, samesite="lax", secure=secure
    )

    return None
