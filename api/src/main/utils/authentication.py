"""
Helper functions for implementing authentication
"""
import os
import bcrypt
from calendar import timegm
from datetime import datetime, timedelta
from fastapi import Cookie
from jose import JWTError, jwt
from jose.constants import ALGORITHMS
from typing import Annotated, Optional
from models.jwt import JWTPayload, JWTUserData

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is not set.")

def hash_password(plain_password) -> str:
    """
    Hashes a password
    """
    return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password, hash_password) -> str:
    """
    Check if a plain-text password matches a hashed password stored in the database.
    Used during user login to verify credentials.
    """
    return bcrypt.checkpw(plain_password.encode("utf-8"), hash_password.encode("utf-8"))
