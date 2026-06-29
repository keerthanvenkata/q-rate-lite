import os
import logging
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from auth import create_access_token, decode_access_token
from database import get_db
from models import Cafe
from routers.whatsapp import send_whatsapp_template
from limiter import limiter

logger = logging.getLogger(__name__)

router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    redirect_url: str
    whatsapp_status: Optional[dict] = None


def _get_active_cafe(cafe_id: int, db: Session) -> Cafe:
    """Validates that the cafe exists and has an active or trial subscription."""
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    if cafe.subscription_status not in ("active", "trial"):
        raise HTTPException(
            status_code=403,
            detail="This cafe's subscription is inactive. Feedback collection is paused.",
        )
    return cafe


@router.post("/request-feedback-link", response_model=TokenResponse)
@limiter.limit("10/minute")
async def request_feedback_link(
    phone: str,
    cafe_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Called when a user scans the QR code or staff enters their number.
    Validates the cafe exists and has an active subscription before issuing
    a scoped customer token and sending the feedback link via WhatsApp.
    """
    if not phone or not cafe_id:
        raise HTTPException(status_code=400, detail="Phone and Cafe ID required")

    # Validate that the target cafe is real and active before issuing a token.
    # Without this check, anyone could generate tokens scoped to arbitrary cafe IDs.
    await run_in_threadpool(_get_active_cafe, cafe_id, db)

    # Create a scoped, short-lived session token for this customer
    token_data = {
        "sub": phone,
        "cafe_id": cafe_id,
        "iss": "qrate-customer",
        "aud": f"cafe-{cafe_id}",
    }
    token = create_access_token(token_data)
    feedback_url = f"{FRONTEND_URL}/feedback?token={token}"

    # Send the WhatsApp message (async, non-blocking)
    components = [
        {
            "type": "body",
            "parameters": [{"type": "text", "text": feedback_url}],
        }
    ]

    wa_response = await send_whatsapp_template(
        to_phone=phone,
        template_name="feedback_request_v1",
        components=components,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": feedback_url,
        "whatsapp_status": wa_response,
    }


@router.get("/verify")
def verify_session(token: str):
    """
    Verifies the token and returns the customer session context.
    Used by the FeedbackPage to validate the token before rendering the form.
    """
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token. Please re-scan the QR code.")

    return {
        "status": "valid",
        "phone": payload.get("sub"),
        "cafe_id": payload.get("cafe_id"),
    }
