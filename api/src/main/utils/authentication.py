"""
Helper functions for implementing authentication
"""

import os
import bcrypt
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from jose.constants import ALGORITHMS
from typing import Optional
from src.main.schemas.user_schema import UserRequest
from fastapi import Cookie, Depends, HTTPException
from typing import Annotated
from fastapi.responses import JSONResponse


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is not set.")


def hash_password(plain_password) -> str:
    """
    Hashes a password
    """

    return bcrypt.hashpw(
        plain_password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(plain_password, hash_password) -> bool:
    """
    Checks if a plain-text password matches a hashed password stored in the
    database. Used during user login to verify credentials.
    """

    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hash_password.encode("utf-8")
    )


def generate_jwt_token(user: UserRequest) -> str:
    """
    Generates a new JWT token using the user's information, including their
    role.
    """

    expiration = datetime.now(timezone.utc) + timedelta(hours=1)
    payload = {
        "sub": user.email,
        "role": user.role,
        "exp": int(expiration.timestamp()),
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITHMS.HS256)
    return token


def decode_jwt_token(token: str) -> Optional[dict]:
    """
    Decodes a JWT token and returns the payload if valid, otherwise returns
    None.
    """

    try:
        payload = jwt.decode(
            token, JWT_SECRET_KEY, algorithms=[ALGORITHMS.HS256]
        )
        return payload
    except JWTError:
        return None


def get_current_user_from_token(token: str) -> Optional[str]:
    """
    Extracts the email (subject) from a valid JWT token. Returns None if the
    token is invalid or expired.
    """

    payload = decode_jwt_token(token)
    if payload and "sub" in payload:
        return payload["sub"]
    return None


def try_get_jwt_user_data(
    fast_api_token: Annotated[Optional[str], Cookie()] = None,
) -> Optional[dict]:
    """
    Dependency to extract user data from JWT in the cookie. Returns the JWT
    payload dict if valid, else None.
    """

    if not fast_api_token:
        return None
    payload = decode_jwt_token(fast_api_token)
    if not payload:
        return None
    return payload


def require_admin(jwt_payload: dict = Depends(try_get_jwt_user_data)):
    """
    Dependency to ensure the current user is an admin. Raises HTTPException if
    not.
    """

    if not jwt_payload or jwt_payload.get("role") != "admin":
        raise HTTPException(
            status_code=403, detail="Admin privileges required"
        )
    return jwt_payload


def set_jwt_cookie_response(user, response_model=None):
    """
    Generates a JWT for the user and returns a JSONResponse with the JWT set
    as an HTTP-only cookie. Optionally serializes the user with a
    response_model (e.g., Pydantic schema).
    """

    class UserObj:
        def __init__(self, email, role):
            self.email = email
            self.role = role

    jwt_token = generate_jwt_token(UserObj(user.email, user.role))
    content = response_model.from_orm(user).dict() if response_model else {}
    response = JSONResponse(content=content)
    response.set_cookie(
        key="fast_api_token", value=jwt_token, httponly=True, samesite="lax"
    )
    return response
