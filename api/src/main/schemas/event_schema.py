from typing import Optional

from pydantic import BaseModel, EmailStr


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
