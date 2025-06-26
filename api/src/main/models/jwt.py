from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    """
    Base Pydantic model for user data. Used as a parent for other user-related models.
    """
    email: str

class UserCreate(UserBase):
    """
    Represents the parameters needed to create a new user (registration input).
    """
    password: str

class UserRead(UserBase):
    """
    Represents a user as returned from the API (response model).
    Includes the user's ID.
    """
    id: int
    class Config:
        orm_mode = True

class Token(BaseModel):
    """
    Represents a JWT access token returned after successful authentication.
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """
    Represents the data extracted from a JWT token (e.g., for validation).
    """
    email: Optional[str] = None

class UserLogin(BaseModel):
    """
    Represents the parameters needed for user login (authentication input).
    """
    email: str
    password: str
