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
    try:
        cafes = db.query(Cafe).order_by(Cafe.id.desc()).all()
        cafe_list = [{
            "id": c.id, "slug": c.slug, "name": c.name,
            "subscription_status": c.subscription_status,
            "subscription_plan": c.subscription_plan,
            "plan_expiry": str(c.plan_expiry) if c.plan_expiry else None,
            "marketing_credits": c.marketing_credits
        } for c in cafes]
        return {"status": "success", "cafes": cafe_list}
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Error in list_all_cafes: {str(e)}\n{traceback.format_exc()}")

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
        raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")

    return {"status": "success", "message": f"Cafe {cafe_id} updated successfully"}

@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db), admin: dict = Depends(get_super_admin)):
    try:
        logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()
        log_list = [{
            "id": l.id, "actor": l.actor, "action": l.action,
            "target_cafe_id": l.target_cafe_id, "details": l.details,
            "created_at": str(l.created_at) if l.created_at else None
        } for l in logs]
        return {"status": "success", "logs": log_list}
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Error in get_audit_logs: {str(e)}\n{traceback.format_exc()}")

from models import ContactMessage

@router.get("/messages")
def get_contact_messages(db: Session = Depends(get_db), admin: dict = Depends(get_super_admin)):
    try:
        messages = db.query(ContactMessage).order_by(ContactMessage.id.desc()).all()
        msg_list = [{
            "id": m.id, "name": m.name, "email": m.email,
            "company": m.company, "phone": m.phone,
            "message": m.message, "status": m.status,
            "created_at": str(m.created_at) if m.created_at else None
        } for m in messages]
        return {"status": "success", "messages": msg_list}
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Error in get_contact_messages: {str(e)}\n{traceback.format_exc()}")
