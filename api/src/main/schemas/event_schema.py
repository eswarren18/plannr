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


class ParticipantBase(BaseModel):
    event_id: int
    user_id: int
    role: str


class InviteBase(BaseModel):
    email: EmailStr
    role: str


class InviteCreate(InviteBase):
    pass


class InviteStatusUpdate(BaseModel):
    status: str


class InviteOut(InviteBase):
    id: int
