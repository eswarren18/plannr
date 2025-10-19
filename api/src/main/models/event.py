"""
SQLAlchemy ORM models for Event, EventParticipant, and Invite entities.

Defines the structure of the events, event_participants, and invites tables in the database, including columns and constraints.
"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from src.main.database import Base


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    host = relationship(
        "User", backref="hosted_events"
    )  # event.host: access the User hosting the Event
    participants = relationship(
        "EventParticipant", back_populates="event"
    )  # event.participants: access the Users participating in the Event
    invites = relationship(
        "Invite", back_populates="event"
    )  # event.invites: access the Users invited to the event


class EventParticipant(Base):
    __tablename__ = "event_participants"
    event_id = Column(Integer, ForeignKey("events.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role = Column(String, nullable=False)
    event = relationship("Event", back_populates="participants")
    user = relationship("User", backref="event_participations")


class Invite(Base):
    __tablename__ = "invites"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    email = Column(String, nullable=False)
    role = Column(String, nullable=False)
    token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    event = relationship("Event", back_populates="invites")
