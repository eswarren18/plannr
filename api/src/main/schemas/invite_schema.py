from pydantic import BaseModel, EmailStr


class InviteBase(BaseModel):
    email: EmailStr
    role: str


class InviteCreate(InviteBase):
    pass


class InviteOut(InviteBase):
    id: int


class InviteStatusUpdate(BaseModel):
    status: str
