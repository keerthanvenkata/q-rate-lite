from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, Field
from typing import Optional
from urllib.parse import urlparse
import secrets
import logging

from database import get_db
from models import Feedback, Coupon, Cafe
from auth import decode_access_token
from limiter import limiter

logger = logging.getLogger(__name__)

router = APIRouter()

# ---------------------------------------------------------------------------
# Allowed hostnames for Google Maps redirect URLs.
# This prevents a malicious owner from setting an arbitrary redirect URL.
# ---------------------------------------------------------------------------
_ALLOWED_MAPS_HOSTS = {
    "maps.google.com",
    "www.google.com",
    "goo.gl",
    "maps.app.goo.gl",
    "g.co",
}


def _is_valid_maps_url(url: str) -> bool:
    """Returns True only if the URL is a recognised Google Maps domain."""
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = (parsed.hostname or "").lower()
        return hostname in _ALLOWED_MAPS_HOSTS or any(
            hostname.endswith("." + h) for h in _ALLOWED_MAPS_HOSTS
        )
    except Exception:
        return False


class FeedbackSubmit(BaseModel):
    token: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    # COMPLIANCE: Default is False — opt-in must be explicit and affirmative.
    # Changing this to True would violate India's DPDP Act.
    marketing_opt_in: bool = False


class FeedbackResponse(BaseModel):
    status: str
    message: str
    coupon_code: Optional[str] = None
    redirect_url: Optional[str] = None


def _generate_unique_coupon_code(db: Session, max_attempts: int = 5) -> str:
    """
    Generates a unique 8-char hex coupon code with retry logic.
    Collision probability at 10k coupons: ~0.001%. Retrying handles the tail.
    """
    for _ in range(max_attempts):
        code = secrets.token_hex(4).upper()
        if not db.query(Coupon).filter(Coupon.code == code).first():
            return code
    logger.error("Failed to generate a unique coupon code after %d attempts", max_attempts)
    raise HTTPException(status_code=500, detail="Failed to generate coupon code. Please try again.")


@router.post("/submit", response_model=FeedbackResponse)
@limiter.limit("5/minute")
def submit_feedback(data: FeedbackSubmit, request: Request, db: Session = Depends(get_db)):
    # 1. Decode and validate the customer token
    payload = decode_access_token(data.token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Session expired. Please re-scan the QR code to submit feedback.",
        )

    phone = payload.get("sub")
    cafe_id = payload.get("cafe_id")

    if not phone or not cafe_id:
        raise HTTPException(status_code=401, detail="Invalid token claims")

    # 2. Load and validate the cafe
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")

    # 3. Check for existing feedback (one feedback per customer per cafe, lifetime)
    existing_feedback = db.query(Feedback).filter(
        Feedback.cafe_id == cafe_id,
        Feedback.customer_phone == phone,
    ).with_for_update().first()

    if existing_feedback:
        # Idempotency: return the existing coupon rather than an error
        existing_coupon = db.query(Coupon).filter(
            Coupon.cafe_id == cafe_id,
            Coupon.customer_phone == phone,
        ).first()
        return {
            "status": "exists",
            "message": "You have already submitted feedback. Here is your coupon.",
            "coupon_code": existing_coupon.code if existing_coupon else None,
            "redirect_url": None,  # No redirect on re-submit to avoid spamming Google
        }

    # 4. Save feedback
    new_feedback = Feedback(
        cafe_id=cafe.id,
        customer_phone=phone,
        rating=data.rating,
        comment=data.comment,
        marketing_opt_in=data.marketing_opt_in,
    )
    db.add(new_feedback)

    # 5. Generate a unique coupon code (with collision retry)
    code = _generate_unique_coupon_code(db)
    new_coupon = Coupon(
        cafe_id=cafe_id,
        customer_phone=phone,
        code=code,
        status="issued",
    )
    db.add(new_coupon)

    try:
        db.commit()
    except IntegrityError:
        # Race condition: another request for the same phone/cafe just committed
        db.rollback()
        existing_coupon = db.query(Coupon).filter(
            Coupon.cafe_id == cafe_id,
            Coupon.customer_phone == phone,
        ).first()
        return {
            "status": "exists",
            "message": "You have already submitted feedback. Here is your coupon.",
            "coupon_code": existing_coupon.code if existing_coupon else None,
            "redirect_url": None,
        }
    except Exception:
        db.rollback()
        logger.error("Unhandled error saving feedback for cafe_id=%s", cafe_id, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save feedback. Please try again.")

    # 6. Determine redirect URL for high ratings
    # Only redirect if the URL is a trusted Google Maps domain
    redirect_url = None
    if data.rating >= 4 and cafe.google_maps_link:
        if _is_valid_maps_url(cafe.google_maps_link):
            redirect_url = cafe.google_maps_link
        else:
            logger.warning(
                "Skipping redirect for cafe_id=%s: google_maps_link '%s' is not a recognised Maps URL",
                cafe_id, cafe.google_maps_link,
            )

    return {
        "status": "success",
        "message": "Feedback received! Coupon added.",
        "coupon_code": code,
        "redirect_url": redirect_url,
    }
