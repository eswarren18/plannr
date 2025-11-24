from src.main.models.event import Event
from src.main.models.user import User


def serialize_inviteout(invite, db):
    event = db.query(Event).filter(Event.id == invite.event_id).first()
    host = (
        db.query(User).filter(User.id == event.host_id).first()
        if event
        else None
    )
    event_summary = None
    if event:
        host_name = None
        if host:
            host_name = (
                f"{host.first_name or ''} {host.last_name or ''}".strip()
                or host.email
            )
        event_summary = {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "host_id": event.host_id,
            "host_name": host_name,
            "start_time": event.start_time,
            "end_time": event.end_time,
        }
    # Get user_name from invite.user_id
    user_name = None
    if invite.user_id:
        user = db.query(User).filter(User.id == invite.user_id).first()
        if user:
            user_name = (
                f"{user.first_name or ''} {user.last_name or ''}".strip()
                or user.email
            )
    return {
        "id": invite.id,
        "token": invite.token,
        "email": invite.email,
        "role": invite.role,
        "status": invite.status,
        "event": event_summary,
        "user_name": user_name,
    }
