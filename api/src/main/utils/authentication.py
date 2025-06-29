"""
Helper functions for implementing authentication
"""

import os
import bcrypt
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from jose.constants import ALGORITHMS
from typing import Optional
from src.main.schemas.users_schema import UserRequest

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
        "sub": user.username,
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
    Extracts the username (subject) from a valid JWT token. Returns None if
    the token is invalid or expired.
    """

    payload = decode_jwt_token(token)
    if payload and "sub" in payload:
        return payload["sub"]
    return None


def get_current_user_role_from_token(token: str) -> Optional[str]:
    """
    Extracts the user's role from a valid JWT token. Returns None if the token
    is invalid or expired.
    """

    payload = decode_jwt_token(token)
    if payload and "role" in payload:
        return payload["role"]
    return None
