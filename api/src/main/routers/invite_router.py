import os
import uuid

from fastapi import APIRouter, Body, Depends, HTTPException, Query
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
from src.main.utils import (
    get_current_user_from_token,
    send_invite_email,
    serialize_inviteout,
)

router = APIRouter(tags=["Invites"], prefix="/api")


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

    # Send invite email with clickable link to the event
    print(os.environ.get("FRONTEND_HOST"))
    link = (
        f"{os.environ.get('FRONTEND_HOST', 'http://localhost:5173')}/invites"
    )
    send_invite_email(invite.email, event.title, link)

    return serialize_inviteout(new_invite, db)


@router.put(
    "/invites/{token}",
    response_model=InviteOut,
    summary="Respond to an invite (accept or decline)",
)
def update_invite(
    token: str,
    status_update: InviteStatusUpdate = Body(
        ..., examples={"status": "accepted"}
    ),
    db: Session = Depends(get_db),
):
    # Fetch the invite from the DB
    invite = db.query(Invite).filter(Invite.token == token).first()
    if not invite or invite.status != "pending":
        raise HTTPException(
            status_code=404, detail="Invalid or expired invite."
        )

    # Fetch the user from the DB
    user = db.query(User).filter(User.email == invite.email).first()

    # Validate the new status data, update the invite status
    if status_update.status not in ["accepted", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status.")
    invite.status = status_update.status
    if user:
        invite.user_id = user.id
    db.commit()

    # Add the user as a participant
    if status_update.status == "accepted" and user:
        event_participant = Participant(
            event_id=invite.event_id, user_id=user.id, role=invite.role
        )
        db.add(event_participant)
        db.commit()
        db.refresh(invite)
        return serialize_inviteout(invite, db)
    elif status_update.status == "accepted":
        db.refresh(invite)
        return serialize_inviteout(invite, db)
    else:
        db.refresh(invite)
        return serialize_inviteout(invite, db)


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


@router.get("/invites", response_model=list[InviteOut])
def get_invites(
    status: str = Query(
        None, description="Invite status: pending, accepted, declined, all"
    ),
    user_id: int = Query(None, description="Filter by user_id"),
    event_id: int = Query(None, description="Filter by event_id"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token),
):
    """
    Fetch invites filtered by user_id, event_id, and status.
    If no user_id is provided, defaults to current user.
    """
    query = db.query(Invite)
    # If user_id is specified, filter by user_id
    if user_id is not None:
        query = query.filter(Invite.user_id == user_id)
    # If event_id is specified and user_id is not, filter by event_id only
    elif event_id is not None:
        query = query.filter(Invite.event_id == event_id)
    # If neither user_id nor event_id is specified, default to current user
    else:
        query = query.filter(Invite.user_id == current_user.id)
    if event_id is not None and user_id is not None:
        query = query.filter(Invite.event_id == event_id)
    if status and status != "all":
        if status not in ["pending", "accepted", "declined"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid status parameter. Must be 'pending', 'accepted', 'declined', or 'all'.",
            )
        query = query.filter(Invite.status == status)
    invites = query.all()
    return [serialize_inviteout(invite, db) for invite in invites]
