from pydantic import BaseModel, EmailStr

from .event_schema import EventSummaryOut


class InviteBase(BaseModel):
    email: EmailStr
    role: str = "participant"


class InviteCreate(InviteBase):
    pass


class InviteOut(InviteBase):
    id: int
    event: EventSummaryOut
    token: str


class InviteStatusUpdate(BaseModel):
    status: str
