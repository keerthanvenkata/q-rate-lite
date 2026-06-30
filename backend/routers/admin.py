from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
from urllib.parse import urlparse
import bcrypt
import logging

from dependencies import get_current_user, require_active_subscription
from database import get_db
from models import Cafe, Feedback
from audit import log_audit

logger = logging.getLogger(__name__)

router = APIRouter()

# ---------------------------------------------------------------------------
# Shared URL validator (mirrors feedback.py — keeps admin & feedback in sync)
# ---------------------------------------------------------------------------
_ALLOWED_MAPS_HOSTS = {
    "maps.google.com",
    "www.google.com",
    "goo.gl",
    "maps.app.goo.gl",
    "g.co",
}


def _is_valid_maps_url(url: str) -> bool:
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


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

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


class OnboardingRequest(BaseModel):
    """
    Step-by-step onboarding data collected in the 3-step wizard.
    All fields except name are optional so the wizard can call the endpoint
    at any step without errors.
    """
    name: str
    google_maps_link: Optional[str] = None
    reward_text: Optional[str] = None
    # Raw plaintext passcode — backend hashes before storing
    staff_passcode: Optional[str] = None


class SettingsRequest(BaseModel):
    """Post-onboarding settings update. All fields optional."""
    name: Optional[str] = None
    google_maps_link: Optional[str] = None
    reward_text: Optional[str] = None
    staff_passcode: Optional[str] = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/me")
def get_me(cafe: Cafe = Depends(get_current_user)):
    return {
        "id": cafe.id,
        "name": cafe.name,
        "slug": cafe.slug,
        "google_maps_link": cafe.google_maps_link,
        "reward_text": cafe.reward_text,
        "onboarding_completed": cafe.onboarding_completed,
        "subscription_status": cafe.subscription_status,
        "plan_expiry": cafe.plan_expiry.isoformat() if cafe.plan_expiry else None,
    }


@router.get("/dashboard", response_model=AdminDataResponse)
def get_admin_dashboard(db: Session = Depends(get_db), cafe: Cafe = Depends(require_active_subscription)):
    stats = db.query(
        func.count(Feedback.id).label("total"),
        func.avg(Feedback.rating).label("average"),
    ).filter(Feedback.cafe_id == cafe.id).first()

    total_fb = stats.total or 0
    avg_fb = round(stats.average, 1) if stats.average else 0.0

    feedbacks = (
        db.query(Feedback)
        .filter(Feedback.cafe_id == cafe.id)
        .order_by(Feedback.created_at.desc())
        .limit(50)
        .all()
    )

    fb_items = [
        FeedbackItem(
            id=f.id,
            rating=f.rating,
            comment=f.comment,
            customer_phone=f.customer_phone,
            created_at=f.created_at,
        )
        for f in feedbacks
    ]

    return AdminDataResponse(
        cafe_id=cafe.id,
        total_feedback=total_fb,
        average_rating=avg_fb,
        recent_feedbacks=fb_items,
    )


@router.patch("/me/onboarding")
def update_onboarding(
    data: OnboardingRequest,
    db: Session = Depends(get_db),
    cafe: Cafe = Depends(get_current_user),
):
    """
    Completes the onboarding wizard. Idempotent — subsequent calls are blocked
    after onboarding_completed is True (owners should use PATCH /me/settings).
    """
    if cafe.onboarding_completed:
        raise HTTPException(status_code=400, detail="Onboarding already completed. Use PATCH /me/settings to update.")

    cafe.name = data.name.strip() or cafe.name

    if data.google_maps_link is not None:
        if data.google_maps_link and not _is_valid_maps_url(data.google_maps_link):
            raise HTTPException(
                status_code=422,
                detail="google_maps_link must be a Google Maps URL (maps.google.com, goo.gl, etc.)",
            )
        cafe.google_maps_link = data.google_maps_link or None

    if data.reward_text is not None:
        cafe.reward_text = data.reward_text.strip() or None

    if data.staff_passcode:
        hashed = bcrypt.hashpw(data.staff_passcode.encode("utf-8"), bcrypt.gensalt())
        cafe.hashed_password = hashed.decode("utf-8")

    cafe.onboarding_completed = True

    try:
        log_audit(
            db=db,
            actor=cafe.auth_id or str(cafe.id),
            action="ONBOARDING_COMPLETED",
            target_cafe_id=cafe.id,
            details={"name": cafe.name},
        )
        db.commit()
    except Exception:
        db.rollback()
        logger.error("Failed to save onboarding for cafe_id=%s", cafe.id, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save onboarding. Please try again.")

    return {"status": "success", "message": "Onboarding completed", "name": cafe.name}


@router.patch("/me/settings")
def update_settings(
    data: SettingsRequest,
    db: Session = Depends(get_db),
    cafe: Cafe = Depends(get_current_user),
):
    """
    Post-onboarding settings update. All fields optional — only provided
    fields are changed. This is the "Settings" tab endpoint.
    """
    changed: dict = {}

    if data.name is not None:
        cafe.name = data.name.strip() or cafe.name
        changed["name"] = cafe.name

    if data.google_maps_link is not None:
        if data.google_maps_link and not _is_valid_maps_url(data.google_maps_link):
            raise HTTPException(
                status_code=422,
                detail="google_maps_link must be a Google Maps URL (maps.google.com, goo.gl, etc.)",
            )
        cafe.google_maps_link = data.google_maps_link or None
        changed["google_maps_link"] = cafe.google_maps_link

    if data.reward_text is not None:
        cafe.reward_text = data.reward_text.strip() or None
        changed["reward_text"] = cafe.reward_text

    if data.staff_passcode:
        hashed = bcrypt.hashpw(data.staff_passcode.encode("utf-8"), bcrypt.gensalt())
        cafe.hashed_password = hashed.decode("utf-8")
        changed["staff_passcode"] = "updated"

    if not changed:
        return {"status": "no_change", "message": "No fields were updated"}

    try:
        log_audit(
            db=db,
            actor=cafe.auth_id or str(cafe.id),
            action="SETTINGS_UPDATED",
            target_cafe_id=cafe.id,
            details=changed,
        )
        db.commit()
    except Exception:
        db.rollback()
        logger.error("Failed to save settings for cafe_id=%s", cafe.id, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save settings. Please try again.")

    return {"status": "success", "message": "Settings saved successfully"}
