"""
Pydantic schemas for User entity.

Defines the data validation and serialization models (schemas) for
user-related API operations, such as creating, updating, and reading user
profiles. These schemas are used to ensure correct data structure in API
requests and responses, separate from database models and authentication logic.
"""

from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    event_name: Optional[str] = None
    event_date: Optional[date] = None
    event_location: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    event_name: Optional[str] = None
    event_date: Optional[date] = None
    event_location: Optional[str] = None
    password: Optional[str] = None


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
        orm_mode = True


class UserUpdate(BaseModel):
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    active: Optional[bool] = None
    role: Optional[str] = None
