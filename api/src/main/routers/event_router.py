from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models.event import Event, EventParticipant, Invite
from src.main.models.user import User
from src.main.schemas.event_schema import (
    EventCreate,
    EventOut,
    EventParticipantBase,
    InviteCreate,
    InviteOut,
)

router = APIRouter(tags=["Events"], prefix="/events")


@router.post("/", response_model=EventOut)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(),
):
    new_event = Event(
        title=event.title,
        description=event.description,
        host_id=current_user.id,
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    # Add host as EventParticipant
    participant = EventParticipant(
        event_id=new_event.id, user_id=current_user.id, role="host"
    )
    db.add(participant)
    db.commit()
    return new_event


@router.get("/", response_model=List[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).all()


@router.post("/{event_id}/invite", response_model=InviteOut)
def invite_participant(
    event_id: int, invite: InviteCreate, db: Session = Depends(get_db)
):
    # Create invite token logic here (token should be generated securely)
    new_invite = Invite(
        event_id=event_id,
        email=invite.email,
        role=invite.role,
        token=invite.token,
        expires_at=invite.expires_at,
    )
    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)
    return new_invite


@router.get(
    "/{event_id}/participants", response_model=List[EventParticipantBase]
)
def get_participants(event_id: int, db: Session = Depends(get_db)):
    return (
        db.query(EventParticipant)
        .filter(EventParticipant.event_id == event_id)
        .all()
    )
