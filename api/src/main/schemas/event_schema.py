from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_registered: bool = False


class UserCreate(UserBase):
    hashed_password: Optional[str] = None


class UserOut(UserBase):
    id: int


class EventBase(BaseModel):
    title: str
    description: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventOut(EventBase):
    id: int
    host_id: int


class EventParticipantBase(BaseModel):
    event_id: int
    user_id: int
    role: str


class InviteBase(BaseModel):
    event_id: int
    email: EmailStr
    role: str
    token: str
    expires_at: Optional[str] = None


class InviteCreate(InviteBase):
    pass


class InviteOut(InviteBase):
    id: int
