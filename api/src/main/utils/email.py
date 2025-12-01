# AMAZON SES SMTP
# import smtplib
# from email.message import EmailMessage
# import ssl
# import os

# SMTP_HOST = os.getenv("SES_SMTP_HOST")
# SMTP_PORT = int(os.getenv("SES_SMTP_PORT"))
# SMTP_USER = os.getenv("SES_SMTP_USERNAME")
# SMTP_PASS = os.getenv("SES_SMTP_PASSWORD")
# FROM_EMAIL = os.getenv("SES_FROM_EMAIL")


# def send_invite_email(
#     to_email: str, title: str, event_link: str, register_link: str
# ):
#     msg = EmailMessage()
#     msg["Subject"] = f"You're invited to {title}!"
#     msg["From"] = FROM_EMAIL
#     msg["To"] = to_email
#     msg.set_content(
#         f"Hello! You've been invited to {title}. "
#         f"Click here to <a href='{event_link}'>view the event</a> or "
#         f"register <a href='{register_link}'>here</a>!",
#         subtype="html",
#     )

#     context = ssl.create_default_context()

#     # Connect to Amazon SES SMTP
#     with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
#         smtp.starttls(context=context)
#         smtp.login(SMTP_USER, SMTP_PASS)
#         smtp.send_message(msg)


# MAILHOG SETUP FOR DEVELOPMENT
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
