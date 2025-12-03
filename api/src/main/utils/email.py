import os
import smtplib
import ssl
from email.message import EmailMessage

ENV = os.getenv("ENV")


def send_invite_email(
    to_email: str, title: str, event_link: str, register_link: str
):
    # Use Amazon SES SMTP in production
    if ENV == "prod":
        SMTP_HOST = os.getenv("SES_SMTP_HOST")
        SMTP_PORT = int(os.getenv("SES_SMTP_PORT"))
        SMTP_USER = os.getenv("SES_SMTP_USERNAME")
        SMTP_PASS = os.getenv("SES_SMTP_PASSWORD")
        FROM_EMAIL = os.getenv("SES_FROM_EMAIL")

        msg = EmailMessage()
        msg["Subject"] = f"You're invited to {title}!"
        msg["From"] = FROM_EMAIL
        msg["To"] = to_email
        msg.set_content(
            f"Hello! You've been invited to {title}. "
            f"Click here to <a href='{event_link}'>view the event</a> or "
            f"register <a href='{register_link}'>here</a>!",
            subtype="html",
        )

        context = ssl.create_default_context()

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls(context=context)
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)

    # Use Mailhog in development
    else:
        msg = EmailMessage()
        msg["Subject"] = f"You're invited to {title}!"
        msg["From"] = "noreply@yourapp.local"
        msg["To"] = to_email
        msg.set_content(
            f"Hello! You've been invited to {title}. Click here to <a href='{event_link}'>view the event</a> or register <a href='{register_link}'>here</a>!",
            subtype="html",
        )

        with smtplib.SMTP("mailhog", 1025) as smtp:
            smtp.send_message(msg)
