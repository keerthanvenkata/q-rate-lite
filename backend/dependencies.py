from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import os
from datetime import datetime, timezone

from database import get_db
from models import Cafe

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.environ["SUPABASE_JWT_SECRET"]

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Cafe:
    token = credentials.credentials
    try:
        # Supabase uses HS256 by default
        # The audience is usually 'authenticated'
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=["HS256"], 
            options={"verify_aud": False}
        )
        auth_id = payload.get("sub")
        if auth_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except JWTError as e:
        import logging
        logging.error(f"JWT validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    cafe = db.query(Cafe).filter(Cafe.auth_id == auth_id).first()
    if cafe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cafe tenant not found for this user",
        )
    return cafe

SUPERADMIN_EMAIL = os.getenv("SUPERADMIN_EMAIL", "keerthanvenkata@gmail.com")

def get_super_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=["HS256"], 
            options={"verify_aud": False}
        )
        email = payload.get("email")
        if not SUPERADMIN_EMAIL or email != SUPERADMIN_EMAIL:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super Admin access required",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super Admin access required",
        )
    return payload

def require_active_subscription(cafe: Cafe = Depends(get_current_user)) -> Cafe:
    if cafe.subscription_status not in ["active", "trial"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Active subscription required",
        )
    if cafe.plan_expiry and cafe.plan_expiry < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Subscription expired",
        )
    return cafe
