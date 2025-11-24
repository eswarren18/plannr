from pydantic import BaseModel, EmailStr

from .event_schema import EventSummaryOut


class InviteBase(BaseModel):
    email: EmailStr
    role: str = "participant"


class InviteCreate(InviteBase):
    pass


class InviteOut(InviteBase):
    id: int
    token: str
    status: str
    event: EventSummaryOut


class InviteStatusUpdate(BaseModel):
    status: str
