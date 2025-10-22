import uuid

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from src.main.database import get_db
from src.main.models.event import Event, Participant
from src.main.models.invite import Invite
from src.main.models.user import User
from src.main.schemas.invite_schema import (
    InviteCreate,
    InviteOut,
    InviteStatusUpdate,
)
from src.main.utils import get_current_user_from_token, send_invite_email

router = APIRouter(tags=["Invites"])


@router.post(
    "/events/{event_id}/invites",
    response_model=InviteOut,
    summary="Invite a participant",
)
def create_invite(
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


@router.put(
    "/invites/{token}", summary="Respond to an invite (accept or decline)"
)
def update_invite(
    token: str,
    status_update: InviteStatusUpdate = Body(
        ..., example={"status": "accepted"}
    ),
    db: Session = Depends(get_db),
):
    invite = db.query(Invite).filter(Invite.token == token).first()
    if not invite or invite.status != "pending":
        raise HTTPException(
            status_code=404, detail="Invalid or expired invite."
        )
    user = db.query(User).filter(User.email == invite.email).first()
    if status_update.status not in ["accepted", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status.")
    invite.status = status_update.status
    if user:
        invite.user_id = user.id
    db.commit()
    if status_update.status == "accepted" and user:
        event_participant = Participant(
            event_id=invite.event_id, user_id=user.id, role=invite.role
        )
        db.add(event_participant)
        db.commit()
        return {"detail": "Invite accepted!"}
    elif status_update.status == "accepted":
        return {"detail": "Invite accepted! (register to participate fully)"}
    else:
        return {"detail": "Invite declined."}


@router.delete("/invites/{invite_id}", status_code=204)
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
