from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os

from database import get_db
from models import Cafe, AuditLog
from audit import log_audit

router = APIRouter()

SUDO_PASSWORD = os.getenv("SUDO_PASSWORD", "dev_sudo")

# --- Dependencies & Schemas ---
def verify_sudo(passcode: str):
    if passcode != SUDO_PASSWORD:
        raise HTTPException(status_code=403, detail="Invalid Super Admin Passcode")
    return True

class SudoAuthRequest(BaseModel):
    passcode: str

class UpdateSubRequest(BaseModel):
    passcode: str
    subscription_status: str
    subscription_plan: Optional[str]

# --- Endpoints ---

@router.post("/cafes")
def list_all_cafes(data: SudoAuthRequest, db: Session = Depends(get_db)):
    verify_sudo(data.passcode)
    
    cafes = db.query(Cafe).order_by(Cafe.id.desc()).all()
    return {"status": "success", "cafes": cafes}

@router.post("/cafes/{cafe_id}/subscription")
def update_cafe_subscription(cafe_id: int, data: UpdateSubRequest, db: Session = Depends(get_db)):
    verify_sudo(data.passcode)
    
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")

    old_status = cafe.subscription_status
    old_plan = cafe.subscription_plan

    try:
        cafe.subscription_status = data.subscription_status
        cafe.subscription_plan = data.subscription_plan
        db.commit()

        # Immutable Audit Log
        log_audit(
            db=db, 
            actor="superadmin", 
            action="UPDATE_SUBSCRIPTION", 
            target_cafe_id=cafe.id, 
            details={
                "old_status": old_status, "new_status": data.subscription_status,
                "old_plan": old_plan, "new_plan": data.subscription_plan
            }
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database update failed")

    return {"status": "success", "message": f"Cafe {cafe_id} updated successfully"}

@router.post("/audit-logs")
def get_audit_logs(data: SudoAuthRequest, db: Session = Depends(get_db)):
    verify_sudo(data.passcode)
    
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()
    return {"status": "success", "logs": logs}

from models import ContactMessage

@router.post("/messages")
def get_contact_messages(data: SudoAuthRequest, db: Session = Depends(get_db)):
    verify_sudo(data.passcode)
    
    messages = db.query(ContactMessage).order_by(ContactMessage.id.desc()).all()
    return {"status": "success", "messages": messages}
