from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from auth import create_access_token, decode_access_token
from typing import Optional

router = APIRouter()

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    redirect_url: str

@router.post("/login_stub", response_model=TokenResponse)
def login_stub(phone: str, cafe_id: int):
    """
    STUB: Simulates a user scanning a QR code and getting a link via WhatsApp.
    In prod, this would be a Gupshup webhook.
    Here, it just returns the valid token.
    """
    if not phone or not cafe_id:
        raise HTTPException(status_code=400, detail="Phone and Cafe ID required")
    
    # Create the session token
    # We embed cafe_id to ensure the feedback is for the right place
    token_data = {"sub": phone, "cafe_id": cafe_id}
    token = create_access_token(token_data)
    
    # In reality, the redirect URL handles the "resume" of the flow
    # Frontend URL e.g. /feedback?token=...
    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": f"/feedback?token={token}"
    }

@router.get("/verify")
def verify_session(token: str):
    """
    Verifies the token and returns the user context.
    """
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return {
        "status": "valid",
        "phone": payload.get("sub"),
        "cafe_id": payload.get("cafe_id")
    }
