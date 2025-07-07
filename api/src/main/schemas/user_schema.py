"""
Pydantic schemas for User entity.

Defines the data validation and serialization models (schemas) for
user-related API operations, such as creating, updating, and reading user
profiles. These schemas are used to ensure correct data structure in API
requests and responses, separate from database models and authentication logic.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    email: EmailStr # email, password, role for user creation
    password: str
    role: str
    first_name: str # first_name, last_name, dob, phone for patient profile matching/creation
    last_name: str
    dob: date
    phone: str


class UserRequest(BaseModel):
    """
    Represents the parameters needed for user login (authentication input).
    """

    email: EmailStr
    password: str


class UserResponse(UserBase):
    """
    Represents a user, without the password
    """

    id: int
    role: Optional[str] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    role: Optional[str] = None
    password: Optional[str] = None
    email: Optional[EmailStr] = None
