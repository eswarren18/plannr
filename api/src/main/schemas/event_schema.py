from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    host_id: int
    start_time: datetime
    end_time: datetime


class EventCreate(EventBase):
    pass


class EventOut(EventBase):
    id: int
    host_name: str


class ParticipantBase(BaseModel):
    event_id: int
    user_id: int
    role: str
