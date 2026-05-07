from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from database import get_db
from models import Cafe, Feedback
from routers.whatsapp import send_whatsapp_template
from audit import log_audit

router = APIRouter()

class MarketingAuth(BaseModel):
    cafe_id: int
    passcode: str

class BlastRequest(MarketingAuth):
    template_name: str
    components: List[dict] = []

def verify_cafe_owner(cafe_id: int, passcode: str, db: Session):
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe or cafe.hashed_password != passcode:
        raise HTTPException(status_code=403, detail="Invalid Cafe Auth")
    return cafe

@router.post("/audience")
def get_marketing_audience(data: MarketingAuth, db: Session = Depends(get_db)):
    cafe = verify_cafe_owner(data.cafe_id, data.passcode, db)
    
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

@router.post("/blast")
async def send_marketing_blast(data: BlastRequest, db: Session = Depends(get_db)):
    cafe = verify_cafe_owner(data.cafe_id, data.passcode, db)
    
    opted_in_customers = db.query(Feedback.customer_phone).filter(
        Feedback.cafe_id == cafe.id,
        Feedback.marketing_opt_in == True
    ).distinct().all()
    
    audience_size = len(opted_in_customers)
    
    if audience_size == 0:
        raise HTTPException(status_code=400, detail="No opted-in audience available")
        
    if cafe.marketing_credits < audience_size:
        raise HTTPException(status_code=400, detail=f"Insufficient marketing credits. Need {audience_size}, have {cafe.marketing_credits}")
        
    # Deduct credits
    cafe.marketing_credits -= audience_size
    db.commit()
    
    success_count = 0
    # Blast out templates
    for (phone,) in opted_in_customers:
        # In a real scalable system, this would be queued in Celery or SQS
        await send_whatsapp_template(
            to_phone=phone,
            template_name=data.template_name,
            components=data.components
        )
        success_count += 1
        
    log_audit(
        db=db,
        actor=f"cafe_{cafe.id}",
        action="MARKETING_BLAST",
        target_cafe_id=cafe.id,
        details={"audience_size": success_count, "template": data.template_name}
    )
    
    return {
        "status": "success",
        "message": f"Successfully blasted to {success_count} customers.",
        "credits_remaining": cafe.marketing_credits
    }
