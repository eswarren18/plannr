from pydantic import BaseModel, EmailStr


class InviteBase(BaseModel):
    email: EmailStr
    role: str


class InviteCreate(InviteBase):
    pass


class EventSummary(BaseModel):
    id: int
    title: str
    description: str | None = None
    host_name: str | None = None


class InviteOut(InviteBase):
    id: int
    event: EventSummary


class InviteStatusUpdate(BaseModel):
    status: str
