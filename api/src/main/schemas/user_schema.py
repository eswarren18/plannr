"""
Pydantic schemas for User entity.

Defines the data validation and serialization models (schemas) for
user-related API operations, such as creating, updating, and reading user
profiles. These schemas are used to ensure correct data structure in API
requests and responses, separate from database models and authentication logic.
"""

from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserRequest(BaseModel):
    """
    Represents the parameters needed for user login (authentication input).
    """

    username: str
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
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None
