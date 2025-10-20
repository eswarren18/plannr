import uuid
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
from src.main.utils.authentication import get_current_user_from_token
from src.main.utils.email import send_invite_email

router = APIRouter(tags=["Events"], prefix="/events")


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
    participant = EventParticipant(
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
        db.query(EventParticipant.event_id)
        .filter(EventParticipant.user_id == user.id)
        .subquery()
    )
    return db.query(Event).filter(Event.id.in_(event_ids)).all()


@router.post("/{event_id}/invite", response_model=InviteOut)
def invite_participant(
    event_id: int,
    invite: InviteCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    # Only the host can invite participants
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event or event.host_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized.")

    # Get invite from DB if it already exists
    existing_invite = (
        db.query(Invite)
        .filter(Invite.event_id == event_id, Invite.email == invite.email)
        .first()
    )

    # Handle if an invite has already been sent for the user & event
    if existing_invite:
        if existing_invite.status == "accepted":
            raise HTTPException(
                status_code=400, detail="User already accepted invite."
            )
        elif existing_invite.status == "pending":
            # TODO: Optionally, resend email
            return existing_invite
        else:
            # TODO: Optionally, resend email
            raise HTTPException(
                status_code=400, detail="User already declined invite."
            )

    # Create an invite. Commit it to DB.
    new_invite = Invite(
        event_id=event_id,
        email=invite.email,
        role=invite.role,
        token=str(uuid.uuid4()),
    )
    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)

    # Send invite email
    # TODO: email needs to send a clickable link
    subject = "You're invited to an event!"
    body = f"Hello! You've been invited to event {event_id}. Click here to accept: <accept_link>"
    send_invite_email(invite.email, subject, body)

    return new_invite


@router.get("/invite/accept/{token}")
def accept_invite(token: str, db: Session = Depends(get_db)):
    invite = db.query(Invite).filter(Invite.token == token).first()
    if not invite or invite.status != "pending":
        raise HTTPException(
            status_code=404, detail="Invalid or expired invite."
        )

    # Update invite status
    invite.status = "accepted"
    db.commit()

    # Look up the user by email
    # TODO: eventually, users don't need to register
    user = db.query(User).filter(User.email == invite.email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found. Please register before accepting the invite.",
        )

    # Add to EventParticipant
    event_participant = EventParticipant(
        event_id=invite.event_id, user_id=user.id, role=invite.role
    )
    db.add(event_participant)
    db.commit()
    return {"detail": "Invite accepted!"}


@router.delete("/invite/{invite_id}", status_code=204)
def delete_invite(
    invite_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_from_token),
):
    invite = db.query(Invite).filter(Invite.id == invite_id).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found.")
    event = db.query(Event).filter(Event.id == invite.event_id).first()
    if not event or event.host_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized.")
    db.delete(invite)
    db.commit()
    return
