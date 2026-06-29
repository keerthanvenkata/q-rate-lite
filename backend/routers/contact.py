from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
from models import ContactMessage
from limiter import limiter
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    company: str | None = None
    phone: str | None = None

@router.post("/")
@limiter.limit("3/hour")
def submit_contact_message(message: ContactMessageCreate, request: Request, db: Session = Depends(get_db)):
    db_message = ContactMessage(
        name=message.name,
        email=message.email,
        company=message.company,
        phone=message.phone,
        message=message.message
    )
    db.add(db_message)
    try:
        db.commit()
        db.refresh(db_message)
    except Exception:
        db.rollback()
        logger.error("Failed to save contact message", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save your message. Please try again.")
    return {"status": "success", "message_id": db_message.id}
