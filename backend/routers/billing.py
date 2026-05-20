from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Cafe
from audit import log_audit

from dependencies import get_current_user

router = APIRouter()

class CreateOrderRequest(BaseModel):
    plan: str # "monthly" or "annual"

@router.post("/create-order")
def create_razorpay_order(data: CreateOrderRequest, db: Session = Depends(get_db), cafe: Cafe = Depends(get_current_user)):
    # cafe is automatically fetched by get_current_user

    # In production, initialize Razorpay client and call order.create()
    # e.g. amount = 999 * 100 (in paise)
    amount_paise = 99900 if data.plan == "monthly" else 999900

    # For Phase 2 dev, we return a dummy order ID to wire up the frontend
    dummy_order_id = f"order_dummy_{cafe.id}_{data.plan}"

    return {
        "status": "success",
        "order_id": dummy_order_id,
        "amount": amount_paise,
        "currency": "INR",
        "key_id": "rzp_test_placeholder" # Provide real test key in frontend later
    }

from fastapi.concurrency import run_in_threadpool

def _process_webhook(cafe_id: str, plan: str, db: Session):
    try:
        cafe = db.query(Cafe).filter(Cafe.id == int(cafe_id)).first()
        if cafe:
            old_status = cafe.subscription_status
            cafe.subscription_status = "active"
            cafe.subscription_plan = plan
            db.commit()
            
            log_audit(
                db=db,
                actor="system_razorpay",
                action="SUBSCRIPTION_RENEWED",
                target_cafe_id=cafe.id,
                details={"old_status": old_status, "new_status": "active", "plan": plan}
            )
    except Exception as e:
        db.rollback()
        print(f"Failed to process webhook DB updates: {e}")

@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    # 1. In production, verify the x-razorpay-signature header here
    payload = await request.json()
    
    event = payload.get("event")
    
    if event == "payment.captured":
        # Extract metadata (notes) we passed during order creation
        notes = payload.get("payload", {}).get("payment", {}).get("entity", {}).get("notes", {})
        cafe_id = notes.get("cafe_id")
        plan = notes.get("plan", "monthly")
        
        if cafe_id:
            await run_in_threadpool(_process_webhook, cafe_id, plan, db)
    
    return {"status": "ok"}

@router.get("/status")
def get_billing_status(cafe: Cafe = Depends(get_current_user)):
    return {
        "subscription_status": cafe.subscription_status,
        "subscription_plan": cafe.subscription_plan,
        "plan_expiry": cafe.plan_expiry,
        "marketing_credits": cafe.marketing_credits
    }
