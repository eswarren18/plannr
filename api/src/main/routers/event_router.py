from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import Event, Participant, User
from src.main.schemas import EventCreate, EventFullOut, EventSummaryOut
from src.main.utils.authentication import get_current_user_from_token
from src.main.utils.event_serialization import (
    serialize_eventfullout,
    serialize_eventsummaryout,
)

router = APIRouter(tags=["Events"], prefix="/api/events")


@router.post("/", response_model=EventSummaryOut)
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

    # Construct and return the event summary
    event_summary = {
        "id": new_event.id,
        "title": new_event.title,
        "host_name": f"{user.first_name or ''} {user.last_name or ''}".strip()
        or user.email,
    }
    return event_summary


@router.get("/hosting", response_model=List[EventSummaryOut])
def get_hosting_events(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Fetch events from the DB
    events = db.query(Event).filter(Event.host_id == user.id).all()

    # Use event_serialization utility to return a list of EventSummaryOut instances
    result = []
    for event in events:
        result.append(serialize_eventsummaryout(event, user))
    return result


@router.get("/participating", response_model=List[EventSummaryOut])
def get_participating_events(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Fetch events from the DB
    event_ids = (
        db.query(Participant.event_id)
        .filter(Participant.user_id == user.id)
        .subquery()
    )
    events = db.query(Event).filter(Event.id.in_(event_ids)).all()

    # Use event_serialization utility to return a list of EventSummaryOut instances
    result = []
    for event in events:
        result.append(serialize_eventsummaryout(event, user))
    return result


@router.get("/{event_id}", response_model=EventFullOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):

    # Fetch the event from the DB
    db_event = (
        db.query(Event)
        .filter(Event.id == event_id, Event.host_id == user.id)
        .first()
    )
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )

    # Use event_serialization utility to return an EventFullOut instance
    return serialize_eventfullout(db_event, db, user)


@router.put("/{event_id}", response_model=EventFullOut)
def update_event(
    event_id: int,
    event_data: EventCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Fetch the event from the DB
    db_event = (
        db.query(Event)
        .filter(Event.id == event_id, Event.host_id == user.id)
        .first()
    )
    if not db_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )

    # Update the event details
    db_event.title = event_data.title
    db_event.description = event_data.description
    db.commit()
    db.refresh(db_event)

    # Use event_serialization utility to return an EventFullOut instance
    return serialize_eventfullout(db_event, db, user)


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
