from src.main.models import User


def serialize_eventout(event, db):
    host = db.query(User).filter(User.id == event.host_id).first()
    host_name = (
        f"{host.first_name or ''} {host.last_name or ''}".strip() or host.email
    )
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description or None,
        "host_id": event.host_id,
        "host_name": host_name,
        "start_time": event.start_time,
        "end_time": event.end_time,
    }


def serialize_participantout(invite):
    user = invite.user
    if user:
        name = (
            f"{user.first_name or ''} {user.last_name or ''}".strip()
            or user.email
        )
    else:
        name = invite.email
    return {
        "participant_name": name,
        "role": invite.role,
    }
