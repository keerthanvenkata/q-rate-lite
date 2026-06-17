from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
import hmac
import hashlib
import os

import httpx
import logging

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "dummy_razorpay_secret")

from database import get_db, SessionLocal
from models import Cafe, AuditLog
from audit import log_audit
from datetime import datetime, timedelta, timezone

from dependencies import get_current_user

router = APIRouter()

class CreateOrderRequest(BaseModel):
    plan: str # "monthly" or "annual"

@router.post("/create-order")
def create_razorpay_order(data: CreateOrderRequest, db: Session = Depends(get_db), cafe: Cafe = Depends(get_current_user)):
    amount_paise = 99900 if data.plan == "monthly" else 999900

    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay credentials not configured")

    payload = {
        "amount": amount_paise,
        "currency": "INR",
        "receipt": f"receipt_{cafe.id}_{data.plan}",
        "notes": {
            "cafe_id": str(cafe.id),
            "plan": data.plan
        }
    }

    try:
        response = httpx.post(
            "https://api.razorpay.com/v1/orders",
            json=payload,
            auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET),
            timeout=10.0
        )
        response.raise_for_status()
        order_data = response.json()
    except Exception as e:
        logging.error(f"Razorpay order creation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")

    return {
        "status": "success",
        "order_id": order_data["id"],
        "amount": amount_paise,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID
    }

from fastapi.concurrency import run_in_threadpool

def _process_webhook(payment_id: str, cafe_id: str, plan: str, amount: int):
    db = SessionLocal()
    try:
        # 1. Idempotency: Check if this payment was already processed
        existing = db.query(AuditLog).filter(
            AuditLog.details.contains(payment_id)
        ).first()
        if existing:
            return  # Already processed

        # 2. Verify amount matches plan
        expected = 99900 if plan == "monthly" else 999900
        if amount != expected:
            log_audit(db, "system", "PAYMENT_AMOUNT_MISMATCH", target_cafe_id=int(cafe_id), details={"payment_id": payment_id, "amount": amount, "expected": expected})
            db.commit()
            return

        # 3. Update subscription with proper expiry
        cafe = db.query(Cafe).filter(Cafe.id == int(cafe_id)).first()
        if cafe:
            old_status = cafe.subscription_status
            cafe.subscription_status = "active"
            cafe.subscription_plan = plan
            cafe.plan_expiry = datetime.now(timezone.utc) + timedelta(
                days=30 if plan == "monthly" else 365
            )
            
            log_audit(
                db=db,
                actor="system_razorpay",
                action="SUBSCRIPTION_RENEWED",
                target_cafe_id=cafe.id,
                details={"old_status": old_status, "new_status": "active", "plan": plan, "payment_id": payment_id}
            )
            db.commit()
    except Exception as e:
        db.rollback()
        import logging
        logging.error(f"Failed to process webhook DB updates: {e}")
    finally:
        db.close()

@router.post("/webhook")
async def razorpay_webhook(request: Request):
    signature = request.headers.get("x-razorpay-signature")
    body_bytes = await request.body()
    
    expected_signature = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
        body_bytes,
        hashlib.sha256
    ).hexdigest()
    
    if not signature or not hmac.compare_digest(expected_signature, signature):
        raise HTTPException(status_code=403, detail="Invalid Razorpay signature")

    payload = await request.json()
    
    event = payload.get("event")
    
    if event == "payment.captured":
        # Extract metadata (notes) we passed during order creation
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        notes = payment_entity.get("notes", {})
        cafe_id = notes.get("cafe_id")
        plan = notes.get("plan", "monthly")
        amount = payment_entity.get("amount")
        payment_id = payment_entity.get("id")
        
        if cafe_id and payment_id and amount is not None:
            await run_in_threadpool(_process_webhook, payment_id, cafe_id, plan, amount)
    
    return {"status": "ok"}

@router.get("/status")
def get_billing_status(cafe: Cafe = Depends(get_current_user)):
    return {
        "subscription_status": cafe.subscription_status,
        "subscription_plan": cafe.subscription_plan,
        "plan_expiry": cafe.plan_expiry,
        "marketing_credits": cafe.marketing_credits
    }
