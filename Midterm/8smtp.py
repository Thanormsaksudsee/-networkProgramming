import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_host = "your_smtp_host"
smtp_port = 587  # Default SMTP port

from_email = input("Your email: ")
password = input("Your email password: ")
to_email = input("Recipient email: ")
subject = input("Subject: ")
message_body = input("Message: ")

msg = MIMEMultipart()
msg["From"] = from_email
msg["To"] = to_email
msg["Subject"] = subject
msg.attach(MIMEText(message_body, "plain"))

with smtplib.SMTP(smtp_host, smtp_port) as server:
    server.starttls()
    server.login(from_email, password)
    server.sendmail(from_email, to_email, msg.as_string())
    print("Email sent successfully!")
