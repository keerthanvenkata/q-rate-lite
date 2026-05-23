from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import os

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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
        )

    cafe = db.query(Cafe).filter(Cafe.auth_id == auth_id).first()
    if cafe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cafe tenant not found for this user",
        )
    return cafe

SUPERADMIN_AUTH_ID = os.getenv("SUPERADMIN_AUTH_ID", "")

def get_super_admin(cafe: Cafe = Depends(get_current_user)) -> Cafe:
    if not SUPERADMIN_AUTH_ID or cafe.auth_id != SUPERADMIN_AUTH_ID:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super Admin access required",
        )
    return cafe
