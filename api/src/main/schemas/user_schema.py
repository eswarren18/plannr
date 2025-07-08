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
    """
    Represents attributes needed to create a patient User
    """
    email: EmailStr # email, password, role for user creation
    password: str
    role: str
    first_name: str # first_name, last_name, dob, phone for patient profile matching/creation
    last_name: str
    dob: date
    phone: str

# TODO: Determine if this class is needed or can password go under UserBase
class EmployeeCreate(UserBase):
    """
    Represents attributes needed to create an employee User
    """

    password: str


class UserRequest(BaseModel):
    """
    Represents the attributes needed for user login (authentication input)
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
    """
    Represents fields a user can update within their user profile
    """

    password: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
