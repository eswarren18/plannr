import uuid
from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models import Event, EventParticipant, Invite, User
from src.main.schemas import (
    EventCreate,
    EventOut,
    EventParticipantBase,
    InviteCreate,
    InviteOut,
    InviteStatusUpdate,
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

    # Check if the invitee is a registered user
    invited_user = db.query(User).filter(User.email == invite.email).first()
    new_invite = Invite(
        event_id=event_id,
        email=invite.email,
        role=invite.role,
        token=str(uuid.uuid4()),
        user_id=invited_user.id if invited_user else None,
    )
    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)

    # Send invite email with clickable accept and decline links
    link = "http://PLACEHOLDER"
    send_invite_email(invite.email, event.title, link)

    return new_invite


@router.put("/invite/{token}", summary="Respond to an invite")
def respond_invite(
    token: str,
    status_update: InviteStatusUpdate = Body(
        ..., example={"status": "accepted"}
    ),
    db: Session = Depends(get_db),
):
    # Get the invite from the DB that is associated with the token (input)
    invite = db.query(Invite).filter(Invite.token == token).first()
    if not invite or invite.status != "pending":
        raise HTTPException(
            status_code=404, detail="Invalid or expired invite."
        )

    # Allow unregistered users to accept/decline invites
    user = db.query(User).filter(User.email == invite.email).first()
    if status_update.status not in ["accepted", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status.")
    invite.status = status_update.status
    if user:
        invite.user_id = user.id
    db.commit()
    if status_update.status == "accepted" and user:
        event_participant = EventParticipant(
            event_id=invite.event_id, user_id=user.id, role=invite.role
        )
        db.add(event_participant)
        db.commit()
        return {"detail": "Invite accepted!"}
    elif status_update.status == "accepted":
        return {"detail": "Invite accepted! (register to participate fully)"}
    else:
        return {"detail": "Invite declined."}


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
