from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timezone

from database import get_db
from models import Coupon, Cafe

router = APIRouter()

class RedeemRequest(BaseModel):
    coupon_code: str
    passcode: str # Simple staff pin/password

@router.post("/redeem")
def redeem_coupon(data: RedeemRequest, db: Session = Depends(get_db)):
    # 1. Find Coupon
    coupon = db.query(Coupon).filter(Coupon.code == data.coupon_code).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Invalid coupon code")

    # 2. Verify Staff Access (Simple Check)
    # in real app, we would check session/jwt of staff.
    # Here, we validate against the cafe's "hashed_password" (which we treat as a passcode for MVP)
    cafe = db.query(Cafe).filter(Cafe.id == coupon.cafe_id).first()
    if not cafe or cafe.hashed_password != data.passcode:
        raise HTTPException(status_code=403, detail="Invalid staff passcode")

    # 3. Check Status
    if coupon.status == "redeemed":
        raise HTTPException(status_code=400, detail="Coupon already redeemed")
    
    if coupon.status != "issued":
        raise HTTPException(status_code=400, detail=f"Coupon is {coupon.status}")

    # 4. Redeem
    coupon.status = "redeemed"
    coupon.redeemed_at = datetime.now(timezone.utc)
    db.commit()

    return {
        "status": "success", 
        "message": "Coupon redeemed successfully",
        "discount_text": cafe.reward_text
    }
