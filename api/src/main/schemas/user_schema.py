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
    email: Optional[EmailStr] = None
    first_name: str
    last_name: str
    dob: Optional[date] = None
    phone: Optional[str] = None


class UserCreate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: str
    last_name: str
    dob: Optional[date] = None
    phone: Optional[str] = None
    password: Optional[str] = None  # required for self-signup, null for admin-created inactive


class EmployeeCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str


class UserRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    active: bool
    role: Optional[str] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    active: Optional[bool] = None
    role: Optional[str] = None
