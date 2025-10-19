from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import Event, EventParticipant, Invite, User
from src.main.schemas import (
    EventCreate,
    EventOut,
    EventParticipantBase,
    InviteCreate,
    InviteOut,
)
from src.main.utils.authentication import get_jwt_user_data

router = APIRouter(tags=["Events"], prefix="/events")


@router.post("/", response_model=EventOut)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    jwt_payload: dict = Depends(get_jwt_user_data),
):
    # Check if user is logged in. Get user details from DB.
    if not jwt_payload or "sub" not in jwt_payload:
        raise HTTPException(status_code=404, detail="Not logged in")
    user = db.query(User).filter(User.email == jwt_payload["sub"]).first()

    # Check if user exists. This check isn't needed except for edge cases (user deleted after JWT issued, JWT forged, bug in user creation)
    if not user:
        raise HTTPException(status_code=404, detail="Not logged in")

    # Create the new event. Commit event to DB.
    new_event = Event(
        title=event.title, description=event.description, host_id=user.id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    # Add the host as an event participant
    participant = EventParticipant(
        event_id=new_event.id, user_id=user.id, role="host"
    )
    db.add(participant)

    # Commit event to DB. Return event details.
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
