from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Cafe, Feedback

router = APIRouter()

class AdminAuthRequest(BaseModel):
    cafe_id: int
    passcode: str

class FeedbackItem(BaseModel):
    id: int
    rating: int
    comment: Optional[str]
    customer_phone: str
    created_at: datetime
    
class AdminDataResponse(BaseModel):
    total_feedback: int
    average_rating: float
    recent_feedbacks: List[FeedbackItem]

@router.post("/dashboard", response_model=AdminDataResponse)
def get_admin_dashboard(data: AdminAuthRequest, db: Session = Depends(get_db)):
    # 1. Simple Auth
    cafe = db.query(Cafe).filter(Cafe.id == data.cafe_id).first()
    if not cafe or cafe.hashed_password != data.passcode:
        raise HTTPException(status_code=403, detail="Invalid admin passcode")

    # 2. Get Analytics (Counts & Avg)
    stats = db.query(
        func.count(Feedback.id).label("total"),
        func.avg(Feedback.rating).label("average")
    ).filter(Feedback.cafe_id == data.cafe_id).first()

    total_fb = stats.total or 0
    avg_fb = round(stats.average, 1) if stats.average else 0.0

    # 3. Get Recent Feedbacks (newest first)
    feedbacks = db.query(Feedback)\
        .filter(Feedback.cafe_id == data.cafe_id)\
        .order_by(Feedback.created_at.desc())\
        .limit(50)\
        .all()

    fb_items = [
        FeedbackItem(
            id=f.id,
            rating=f.rating,
            comment=f.comment,
            customer_phone=f.customer_phone,
            created_at=f.created_at
        ) for f in feedbacks
    ]

    return AdminDataResponse(
        total_feedback=total_fb,
        average_rating=avg_fb,
        recent_feedbacks=fb_items
    )
