from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import random
import string

from database import get_db
from models import Feedback, Coupon, Cafe
from routers.auth import verify_session # Reuse the verification logic

router = APIRouter()

class FeedbackCreate(BaseModel):
    token: str
    rating: int # 1-5
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    status: str
    message: str
    coupon_code: Optional[str] = None
    redirect_url: Optional[str] = None

def generate_coupon_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@router.post("/submit", response_model=FeedbackResponse)
def submit_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    # 1. Verify User
    # We call the logic from auth directly or use the dependency?
    # For simplicity, let's just decode here or rely on specific endpoints.
    # To keep code clean, let's call the helper function we exposed in auth router or just use the utils.
    # Actually, better to use the dependency injection for "current_user" pattern, but we have a custom token flow.
    # Let's verify manually for now as per the "Boring" principle.
    
    from auth import decode_access_token
    payload = decode_access_token(data.token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    phone = payload.get("sub")
    cafe_id = payload.get("cafe_id")

    # 2. Check for existing feedback (Lifetime Rule)
    existing_feedback = db.query(Feedback).filter(
        Feedback.cafe_id == cafe_id,
        Feedback.customer_phone == phone
    ).first()

    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
         raise HTTPException(status_code=404, detail="Cafe not found")

    if existing_feedback:
        # User has already submitted.
        # Idempotency: Return the existing coupon if they possess one.
        existing_coupon = db.query(Coupon).filter(
            Coupon.cafe_id == cafe_id,
            Coupon.customer_phone == phone
        ).first()

        return {
            "status": "exists",
            "message": "You have already submitted feedback. Here is your coupon.",
            "coupon_code": existing_coupon.code if existing_coupon else None,
            "redirect_url": None # No redirect on re-submit to avoid spamming google
        }

    # 3. Save Feedback
    new_feedback = Feedback(
        cafe_id=cafe_id,
        customer_phone=phone,
        rating=data.rating,
        comment=data.comment
    )
    db.add(new_feedback)

    # 4. Generate Coupon (Invariant: ALL valid feedback gets a coupon)
    code = generate_coupon_code()
    # Ensure uniqueness loop could be here but odds are low for MVP
    
    new_coupon = Coupon(
        cafe_id=cafe_id,
        customer_phone=phone,
        code=code,
        status="issued"
    )
    db.add(new_coupon)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    # 5. Determine Redirect (Option 1 Logic)
    redirect_url = None
    if data.rating >= 4 and cafe.google_maps_link:
        redirect_url = cafe.google_maps_link

    return {
        "status": "success",
        "message": "Feedback received! Coupon added.",
        "coupon_code": code,
        "redirect_url": redirect_url
    }
