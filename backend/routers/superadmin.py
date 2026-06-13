from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os

from database import get_db
from models import Cafe, AuditLog
from audit import log_audit
from dependencies import get_super_admin

router = APIRouter()

# --- Dependencies & Schemas ---

class UpdateSubRequest(BaseModel):
    subscription_status: str
    subscription_plan: Optional[str]

# --- Endpoints ---

@router.get("/cafes")
def list_all_cafes(db: Session = Depends(get_db), admin: dict = Depends(get_super_admin)):
    cafes = db.query(Cafe).order_by(Cafe.id.desc()).all()
    return {"status": "success", "cafes": cafes}

@router.post("/cafes/{cafe_id}/subscription")
def update_cafe_subscription(cafe_id: int, data: UpdateSubRequest, db: Session = Depends(get_db), admin: dict = Depends(get_super_admin)):
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

@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db), admin: dict = Depends(get_super_admin)):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()
    return {"status": "success", "logs": logs}

from models import ContactMessage

@router.get("/messages")
def get_contact_messages(db: Session = Depends(get_db), admin: dict = Depends(get_super_admin)):
    messages = db.query(ContactMessage).order_by(ContactMessage.id.desc()).all()
    return {"status": "success", "messages": messages}
