"""
POST /api/auth/sync

This endpoint is the authoritative source of truth for Cafe tenant creation.
It replaces the Supabase Postgres trigger approach and is called by the
frontend immediately after a successful Supabase Auth signup or login.

Design rationale:
  - Keeps all domain logic (audit logs, trial setup, slug generation) inside
    the FastAPI backend rather than in a Postgres trigger.
  - Idempotent: safe to call multiple times (e.g., on every login).
  - Works identically in local SQLite dev and production PostgreSQL.
"""
import os
import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
import bcrypt

from database import get_db
from models import Cafe
from audit import log_audit

logger = logging.getLogger(__name__)
router = APIRouter()

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
TRIAL_DAYS = 14


class SyncRequest(BaseModel):
    """
    Optional extra metadata the frontend can pass.
    - cafe_name: used when the JWT metadata doesn't have the name (e.g., Google OAuth
      where the user typed a name before clicking 'Continue with Google').
    """
    cafe_name: Optional[str] = None


class SyncResponse(BaseModel):
    status: str          # "created" | "exists"
    cafe_id: int
    name: str


def _decode_supabase_token(token: str) -> dict:
    """Decode and validate a Supabase-issued JWT."""
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except JWTError as e:
        logger.warning(f"Sync: Supabase JWT decode failed: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")


def _slugify(text: str) -> str:
    """Generate a URL-safe slug from arbitrary text."""
    import re
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    slug = re.sub(r"^-+|-+$", "", slug)
    return slug[:40] or "cafe"


def _make_unique_slug(base: str, db: Session) -> str:
    """Ensure the generated slug is unique; append a numeric suffix if needed."""
    slug = base
    counter = 1
    while db.query(Cafe).filter(Cafe.slug == slug).first():
        slug = f"{base}-{counter}"
        counter += 1
    return slug


@router.post("/sync", response_model=SyncResponse)
def sync_user(
    body: SyncRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """
    Syncs a Supabase Auth user into the backend Cafe table.

    Call this:
      1. After `supabase.auth.signUp()` succeeds (passing cafe_name in body).
      2. After `supabase.auth.signInWithPassword()` / OAuth callback succeeds
         (idempotent — returns existing cafe if already synced).

    The frontend must include the Supabase JWT as a Bearer token.
    """
    payload = _decode_supabase_token(credentials.credentials)

    auth_id = payload.get("sub")
    if not auth_id:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    # --- Idempotency check ---
    existing = db.query(Cafe).filter(Cafe.auth_id == auth_id).first()
    if existing:
        logger.info(f"Sync: Cafe already exists for auth_id={auth_id!r}, cafe_id={existing.id}")
        return SyncResponse(status="exists", cafe_id=existing.id, name=existing.name)

    # --- Determine cafe name (priority order) ---
    # 1. Explicit body param (user typed it on signup form or pre-OAuth localStorage)
    # 2. JWT user_metadata.name (set during signUp options.data)
    # 3. JWT user_metadata.full_name (Google OAuth)
    # 4. Email prefix
    # 5. Fallback
    user_meta = payload.get("user_metadata", {})
    raw_meta = payload.get("raw_user_meta_data", {})  # Supabase sometimes uses this key
    meta = {**raw_meta, **user_meta}

    cafe_name = (
        body.cafe_name
        or meta.get("name")
        or meta.get("full_name")
        or (payload.get("email", "").split("@")[0] if payload.get("email") else None)
        or "My Cafe"
    )
    cafe_name = cafe_name.strip() or "My Cafe"

    # --- Generate slug ---
    base_slug = _slugify(cafe_name)
    slug = _make_unique_slug(base_slug, db)

    # --- Create Cafe record ---
    new_cafe = Cafe(
        slug=slug,
        name=cafe_name,
        auth_id=auth_id,
        subscription_status="trial",
        plan_expiry=datetime.now(timezone.utc) + timedelta(days=TRIAL_DAYS),
        marketing_credits=0,
        onboarding_completed=False,
    )
    db.add(new_cafe)

    try:
        db.flush()  # Populate new_cafe.id before logging
        log_audit(
            db=db,
            actor=auth_id,
            action="ACCOUNT_CREATED",
            target_cafe_id=new_cafe.id,
            details={"name": cafe_name, "slug": slug, "trial_days": TRIAL_DAYS},
        )
        db.commit()
    except Exception:
        db.rollback()
        logger.error(f"Sync: Failed to create Cafe for auth_id={auth_id!r}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create cafe account. Please try again.")

    logger.info(f"Sync: Created cafe_id={new_cafe.id} for auth_id={auth_id!r}, name={cafe_name!r}")
    return SyncResponse(status="created", cafe_id=new_cafe.id, name=cafe_name)
