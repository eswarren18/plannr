from typing import List, Optional

from pydantic import BaseModel


class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    host_id: int


class EventCreate(EventBase):
    pass


class EventSummaryOut(EventBase):
    id: int
    host_name: str


class EventFullOut(EventSummaryOut):
    participants: List[str]


class ParticipantBase(BaseModel):
    event_id: int
    user_id: int
    role: str
