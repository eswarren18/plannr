from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import Event, Participant, User
from src.main.schemas import EventCreate, EventOut
from src.main.utils.authentication import get_current_user_from_token

router = APIRouter(tags=["Events"], prefix="/api/events")


@router.post("/", response_model=EventOut)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Create the new event. Commit event to DB.
    new_event = Event(
        title=event.title, description=event.description, host_id=user.id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    # Add the host as an event participant
    participant = Participant(
        event_id=new_event.id, user_id=user.id, role="host"
    )
    db.add(participant)

    # Commit event to DB. Return event details.
    db.commit()
    return new_event


@router.get("/hosting", response_model=List[EventOut])
def list_hosting_events(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Return a list of events that the authenticated user is hosting
    return db.query(Event).filter(Event.host_id == user.id).all()


@router.get("/participating", response_model=List[EventOut])
def list_participating_events(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Return a list of events in which the authenticated user is a participant
    event_ids = (
        db.query(Participant.event_id)
        .filter(Participant.user_id == user.id)
        .subquery()
    )
    return db.query(Event).filter(Event.id.in_(event_ids)).all()


@router.put("/{event_id}", response_model=EventOut)
def update_event(
    event_id: int,
    event: EventCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    db_event = (
        db.query(Event)
        .filter(Event.id == event_id, Event.host_id == user.id)
        .first()
    )
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    db_event.title = event.title
    db_event.description = event.description
    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    db_event = (
        db.query(Event)
        .filter(Event.id == event_id, Event.host_id == user.id)
        .first()
    )
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    db.delete(db_event)
    db.commit()
    return {"detail": "Event deleted"}
