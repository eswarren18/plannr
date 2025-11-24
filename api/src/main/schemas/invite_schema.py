from pydantic import BaseModel, EmailStr

from .event_schema import EventOut


class InviteBase(BaseModel):
    email: EmailStr
    role: str = "participant"


class InviteCreate(InviteBase):
    pass


class InviteOut(InviteBase):
    id: int
    token: str
    status: str
    event: EventOut
    user_name: str


class InviteStatusUpdate(BaseModel):
    status: str
