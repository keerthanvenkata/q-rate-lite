from fastapi import APIRouter, HTTPException, Depends, Query, Request
from pydantic import BaseModel
from auth import create_access_token, decode_access_token
from typing import Optional

router = APIRouter()

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    redirect_url: str
    whatsapp_status: Optional[dict] = None

from routers.whatsapp import send_whatsapp_template
import os
from limiter import limiter

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@router.post("/request-feedback-link", response_model=TokenResponse)
@limiter.limit("10/minute")
async def request_feedback_link(phone: str, cafe_id: int, request: Request):
    """
    Called when a user scans the QR code or staff enters their number.
    Generates a token and sends the feedback link via Meta WhatsApp Cloud API.
    """
    if not phone or not cafe_id:
        raise HTTPException(status_code=400, detail="Phone and Cafe ID required")
    
    # Create the session token
    token_data = {"sub": phone, "cafe_id": cafe_id}
    token = create_access_token(token_data)
    
    feedback_url = f"{FRONTEND_URL}/feedback?token={token}"
    
    # Send the WhatsApp message (async)
    # The template must be approved in Meta. E.g. "feedback_request_v1"
    # Assuming the template takes 1 variable: the feedback URL
    components = [
        {
            "type": "body",
            "parameters": [
                {
                    "type": "text",
                    "text": feedback_url
                }
            ]
        }
    ]
    
    wa_response = await send_whatsapp_template(
        to_phone=phone,
        template_name="feedback_request_v1",
        components=components
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": feedback_url,
        "whatsapp_status": wa_response
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
