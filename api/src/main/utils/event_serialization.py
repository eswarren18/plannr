from src.main.models import Participant, User


def serialize_eventfullout(event, db, user):
    # Get participants
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
        "description": event.description or None,
        "host_name": f"{user.first_name or ''} {user.last_name or ''}".strip()
        or user.email,
        "participants": participant_names,
    }


def serialize_eventsummaryout(event, user):
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description or None,
        "host_name": f"{user.first_name or ''} {user.last_name or ''}".strip()
        or user.email,
    }
