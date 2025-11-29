import smtplib
from email.message import EmailMessage


def send_invite_email(
    to_email: str, title: str, event_link: str, register_link: str
):
    msg = EmailMessage()
    msg["Subject"] = f"You're invited to {title}!"
    msg["From"] = "noreply@yourapp.local"
    msg["To"] = to_email
    msg.set_content(
        f"Hello! You've been invited to {title}. Click here to <a href='{event_link}'>view the event</a> or register <a href='{register_link}'>here</a>!",
        subtype="html",
    )

    # Connect to MailHog SMTP server
    with smtplib.SMTP("mailhog", 1025) as smtp:
        smtp.send_message(msg)
