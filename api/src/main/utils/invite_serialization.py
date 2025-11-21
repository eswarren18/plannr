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
            "host_name": host_name,
        }
    return {
        "id": invite.id,
        "email": invite.email,
        "role": invite.role,
        "event": event_summary,
        "token": invite.token,
    }
