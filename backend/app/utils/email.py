from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.config import settings
from typing import List
from loguru import logger

class EmailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_STARTTLS=settings.MAIL_TLS,
            MAIL_SSL_TLS=settings.MAIL_SSL,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True
        )
        self.fm = FastMail(self.conf)
    
    async def send_welcome_email(self, email: str, username: str):
        """Send welcome email to new user"""
        
        html_content = f"""
        <html>
            <body>
                <h2>Welcome to Resume Analyzer Pro! 🎉</h2>
                <p>Hello {username},</p>
                <p>Thank you for signing up! We're excited to help you create the perfect resume.</p>
                <p>Here's what you can do:</p>
                <ul>
                    <li>Upload and analyze your resume</li>
                    <li>Get AI-powered suggestions</li>
                    <li>Compare with job descriptions</li>
                    <li>Optimize for ATS systems</li>
                </ul>
                <p>Get started now and land your dream job!</p>
                <p>Best regards,<br>Resume Analyzer Pro Team</p>
            </body>
        </html>
        """
        
        message = MessageSchema(
            subject="Welcome to Resume Analyzer Pro!",
            recipients=[email],
            body=html_content,
            subtype="html"
        )
        
        try:
            await self.fm.send_message(message)
            logger.info(f"Welcome email sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send welcome email: {str(e)}")
    
    async def send_analysis_complete_email(
        self, 
        email: str, 
        username: str,
        score: float,
        resume_title: str
    ):
        """Send email when analysis is complete"""
        
        html_content = f"""
        <html>
            <body>
                <h2>Your Resume Analysis is Complete! ✅</h2>
                <p>Hello {username},</p>
                <p>We've finished analyzing your resume: <strong>{resume_title}</strong></p>
                <p>Your overall score: <strong>{score:.1f}/100</strong></p>
                <p>Log in to view detailed insights and recommendations.</p>
                <p>Best regards,<br>Resume Analyzer Pro Team</p>
            </body>
        </html>
        """
        
        message = MessageSchema(
            subject=f"Resume Analysis Complete - Score: {score:.1f}/100",
            recipients=[email],
            body=html_content,
            subtype="html"
        )
        
        try:
            await self.fm.send_message(message)
            logger.info(f"Analysis email sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send analysis email: {str(e)}")

email_service = EmailService()