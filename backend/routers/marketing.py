from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from database import get_db
from models import Cafe, Feedback
from routers.whatsapp import send_whatsapp_template
from audit import log_audit

from dependencies import get_current_user

router = APIRouter()

class BlastRequest(BaseModel):
    template_name: str
    components: List[dict] = []

@router.get("/audience")
def get_marketing_audience(db: Session = Depends(get_db), cafe: Cafe = Depends(get_current_user)):
    
    opted_in_customers = db.query(Feedback.customer_phone).filter(
        Feedback.cafe_id == cafe.id,
        Feedback.marketing_opt_in == True
    ).distinct().all()
    
    audience_size = len(opted_in_customers)
    
    return {
        "status": "success",
        "audience_size": audience_size,
        "marketing_credits": cafe.marketing_credits
    }

from fastapi.concurrency import run_in_threadpool

def _prepare_blast(data: BlastRequest, db: Session, cafe: Cafe):
    
    opted_in_customers = db.query(Feedback.customer_phone).filter(
        Feedback.cafe_id == cafe.id,
        Feedback.marketing_opt_in == True
    ).distinct().all()
    
    audience_size = len(opted_in_customers)
    
    if audience_size == 0:
        raise HTTPException(status_code=400, detail="No opted-in audience available")
        
    if cafe.marketing_credits < audience_size:
        raise HTTPException(status_code=400, detail=f"Insufficient marketing credits. Need {audience_size}, have {cafe.marketing_credits}")
        
    try:
        cafe.marketing_credits -= audience_size
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred during credit deduction")
        
    return cafe.id, cafe.marketing_credits, [p for (p,) in opted_in_customers]

def _log_blast(cafe_id: int, success_count: int, template_name: str, db: Session):
    try:
        log_audit(
            db=db,
            actor=f"cafe_{cafe_id}",
            action="MARKETING_BLAST",
            target_cafe_id=cafe_id,
            details={"audience_size": success_count, "template": template_name}
        )
    except Exception as e:
        db.rollback()
        print(f"Failed to log audit: {e}")

@router.post("/blast")
async def send_marketing_blast(data: BlastRequest, db: Session = Depends(get_db), cafe: Cafe = Depends(get_current_user)):
    # Run DB preparation in threadpool to avoid blocking event loop
    cafe_id, remaining_credits, phones = await run_in_threadpool(_prepare_blast, data, db, cafe)
    
    success_count = 0
    # Blast out templates
    for phone in phones:
        # In a real scalable system, this would be queued in Celery or SQS
        await send_whatsapp_template(
            to_phone=phone,
            template_name=data.template_name,
            components=data.components
        )
        success_count += 1
        
    # Log audit in threadpool
    await run_in_threadpool(_log_blast, cafe_id, success_count, data.template_name, db)
    
    return {
        "status": "success",
        "message": f"Successfully blasted to {success_count} customers.",
        "credits_remaining": remaining_credits
    }
