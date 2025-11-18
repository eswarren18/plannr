from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import Event, Participant, User
from src.main.schemas import EventCreate, EventFullOut, EventSummaryOut
from src.main.utils.authentication import get_current_user_from_token

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
    events = db.query(Event).filter(Event.host_id == user.id).all()
    result = []
    for event in events:
        host = db.query(User).filter(User.id == event.host_id).first()
        host_name = (
            f"{host.first_name or ''} {host.last_name or ''}".strip()
            if host
            else "Unknown"
        )
        result.append(
            {"id": event.id, "title": event.title, "host_name": host_name}
        )
    return result


@router.get("/participating", response_model=List[EventSummaryOut])
def get_participating_events(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    event_ids = (
        db.query(Participant.event_id)
        .filter(Participant.user_id == user.id)
        .subquery()
    )
    events = db.query(Event).filter(Event.id.in_(event_ids)).all()
    result = []
    for event in events:
        host = db.query(User).filter(User.id == event.host_id).first()
        host_name = (
            f"{host.first_name or ''} {host.last_name or ''}".strip()
            if host
            else "Unknown"
        )
        result.append(
            {"id": event.id, "title": event.title, "host_name": host_name}
        )
    return result


@router.get("/{event_id}", response_model=EventFullOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    host = db.query(User).filter(User.id == event.host_id).first()
    host_name = (
        f"{host.first_name or ''} {host.last_name or ''}".strip()
        if host
        else "Unknown"
    )
    participants = (
        db.query(User)
        .join(Participant, Participant.user_id == User.id)
        .filter(Participant.event_id == event.id)
        .all()
    )
    participant_names = [
        f"{p.first_name or ''} {p.last_name or ''}".strip() or p.email
        for p in participants
        if p.id != event.host_id
    ]
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "host_name": host_name,
        "participants": participant_names,
    }


@router.put("/{event_id}", response_model=EventFullOut)
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
