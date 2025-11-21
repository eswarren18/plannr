from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import Event, Invite, Participant, User
from src.main.schemas import EventCreate, EventFullOut, EventSummaryOut
from src.main.utils import (
    get_current_user_from_token,
    serialize_eventfullout,
    serialize_eventsummaryout,
)

router = APIRouter(tags=["Events"], prefix="/api/events")


@router.post("/", response_model=EventSummaryOut)
def create_event(
    event_details: EventCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Create the new event from the user event details
    new_event = Event(
        title=event_details.title,
        description=event_details.description,
        host_id=user.id,
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    # Add the host as an event participant
    participant = Participant(
        event_id=new_event.id, user_id=user.id, role="host"
    )
    db.add(participant)
    db.commit()

    # Use event_serialization utility to return an EventSummaryOut instance
    return serialize_eventsummaryout(new_event, db)


@router.get("/hosting", response_model=List[EventSummaryOut])
def get_hosting_events(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Fetch events from the DB
    events = db.query(Event).filter(Event.host_id == user.id).all()

    # Use event_serialization utility to return a list of EventSummaryOut instances
    return [serialize_eventsummaryout(event, db) for event in events]


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
    return [serialize_eventsummaryout(event, db) for event in events]


@router.get("/{event_id}", response_model=EventFullOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Fetch the event if the user is the host
    db_event = (
        db.query(Event)
        .filter(Event.id == event_id, Event.host_id == user.id)
        .first()
    )
    if not db_event:
        # If not the host, fetch the event if the user is a participant
        db_event = (
            db.query(Event)
            .join(Invite, Invite.event_id == Event.id)
            .filter(
                Event.id == event_id,
                Invite.user_id == user.id,
                Invite.status == "accepted",
            )
            .first()
        )
        if not db_event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
            )

    # Use event_serialization utility to return an EventFullOut instance
    return serialize_eventfullout(db_event, db)


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
    return serialize_eventfullout(db_event, db)


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
