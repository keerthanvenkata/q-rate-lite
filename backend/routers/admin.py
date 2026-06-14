from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from dependencies import get_current_user, require_active_subscription
from database import get_db
from models import Cafe, Feedback

router = APIRouter()

class FeedbackItem(BaseModel):
    id: int
    rating: int
    comment: Optional[str]
    customer_phone: str
    created_at: datetime
    
class AdminDataResponse(BaseModel):
    cafe_id: int
    total_feedback: int
    average_rating: float
    recent_feedbacks: List[FeedbackItem]

@router.get("/dashboard", response_model=AdminDataResponse)
def get_admin_dashboard(db: Session = Depends(get_db), cafe: Cafe = Depends(require_active_subscription)):
    # 2. Get Analytics (Counts & Avg) using the authenticated cafe
    stats = db.query(
        func.count(Feedback.id).label("total"),
        func.avg(Feedback.rating).label("average")
    ).filter(Feedback.cafe_id == cafe.id).first()

    total_fb = stats.total or 0
    avg_fb = round(stats.average, 1) if stats.average else 0.0

    # 3. Get Recent Feedbacks (newest first)
    feedbacks = db.query(Feedback)\
        .filter(Feedback.cafe_id == cafe.id)\
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
        cafe_id=cafe.id,
        total_feedback=total_fb,
        average_rating=avg_fb,
        recent_feedbacks=fb_items
    )

class OnboardingRequest(BaseModel):
    name: str

@router.get("/me")
def get_me(cafe: Cafe = Depends(get_current_user)):
    return {
        "id": cafe.id,
        "name": cafe.name,
        "slug": cafe.slug,
        "onboarding_completed": cafe.onboarding_completed,
        "subscription_status": cafe.subscription_status
    }

@router.patch("/me/onboarding")
def update_onboarding(data: OnboardingRequest, db: Session = Depends(get_db), cafe: Cafe = Depends(get_current_user)):
    if cafe.onboarding_completed:
        raise HTTPException(status_code=400, detail="Onboarding already completed")
    
    cafe.name = data.name
    cafe.onboarding_completed = True
    db.commit()
    return {"status": "success", "message": "Onboarding completed", "name": cafe.name}
