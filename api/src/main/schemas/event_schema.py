from typing import List, Optional

from pydantic import BaseModel


class EventBase(BaseModel):
    id: int
    title: str
    description: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventSummaryOut(BaseModel):
    id: int
    title: str
    host_name: str


class EventFullOut(EventBase):
    id: int
    host_name: str
    participants: List[str]


class ParticipantBase(BaseModel):
    event_id: int
    user_id: int
    role: str
