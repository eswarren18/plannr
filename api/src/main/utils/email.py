import smtplib
from email.message import EmailMessage


def send_invite_email(to_email: str, title: str, link: str):
    msg = EmailMessage()
    msg["Subject"] = f"You're invited to {title}!"
    msg["From"] = "noreply@yourapp.local"
    msg["To"] = to_email
    msg.set_content(
        f"Hello! You've been invited to {title}. Click here to <a href='{link}'>check it out</a>!",
        subtype="html",
    )

    # Connect to MailHog SMTP server
    with smtplib.SMTP("mailhog", 1025) as smtp:
        smtp.send_message(msg)
