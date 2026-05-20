from fastapi import APIRouter, Request, Response, HTTPException
import os
import httpx

router = APIRouter()

META_VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "qrate_verify_123")
META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN", "dummy_token_replace_in_prod")
META_PHONE_ID = os.getenv("META_PHONE_ID", "dummy_phone_id")
WABA_PHONE_NUMBER = os.getenv("WABA_PHONE_NUMBER", "919999999999")

@router.get("/config")
def get_whatsapp_config():
    """
    Returns public config required by the frontend (like the WhatsApp bot phone number)
    """
    return {
        "waba_phone_number": WABA_PHONE_NUMBER
    }

@router.get("/webhook")
def verify_webhook(request: Request):
    """
    Required by Meta to verify the webhook endpoint URL during setup.
    """
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == META_VERIFY_TOKEN:
        return Response(content=challenge, media_type="text/plain")
    raise HTTPException(status_code=403, detail="Forbidden")


from routers.auth import create_access_token

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@router.post("/webhook")
async def receive_webhook(request: Request):
    """
    Receives inbound messages and delivery status updates from Meta.
    """
    try:
        body = await request.json()
        
        # Parse inbound WhatsApp Message
        # WhatsApp payload structure is heavily nested
        if body.get("object") == "whatsapp_business_account":
            for entry in body.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    if "messages" in value:
                        for msg in value.get("messages", []):
                            phone_number = msg.get("from")
                            text_body = msg.get("text", {}).get("body", "").strip().lower()
                            
                            # If customer sends "RateMyVisit" (or similar), auto-reply with feedback link
                            # We assume cafe_id = 1 for the MVP since the wa.me link can't easily pass hidden context
                            # In prod, we'd use dynamic wa.me text like "RateMyVisit Cafe=1"
                            if "rate" in text_body or "visit" in text_body:
                                cafe_id = 1 
                                
                                # Generate Session Token
                                token_data = {"sub": phone_number, "cafe_id": cafe_id}
                                token = create_access_token(token_data)
                                feedback_url = f"{FRONTEND_URL}/feedback?token={token}"
                                
                                # Reply via Meta Cloud API using a Service Conversation (Free Tier)
                                # For Service replies, we don't need a pre-approved template, we can send raw text!
                                await send_whatsapp_text(
                                    to_phone=phone_number,
                                    text_message=f"Thank you for visiting! Please leave your feedback and claim your reward here: {feedback_url}"
                                )
                                
        return {"status": "ok"}
    except Exception as e:
        print(f"Webhook Error: {e}")
        return {"status": "error"}

async def send_whatsapp_text(to_phone: str, text_message: str):
    """
    Fires a raw text message to the customer. 
    This ONLY works if they messaged us within the last 24 hours (Service Conversation).
    """
    url = f"https://graph.facebook.com/v18.0/{META_PHONE_ID}/messages"
    headers = {
        "Authorization": f"Bearer {META_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    if len(to_phone) == 10:
        to_phone = "91" + to_phone

    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "text",
        "text": {
            "preview_url": True,
            "body": text_message
        }
    }

    if META_ACCESS_TOKEN == "dummy_token_replace_in_prod":
        print(f"DUMMY MODE: Simulating WhatsApp Text to {to_phone}: {text_message}")
        return {"simulated": True}

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"Failed to send text: {e}")
            return {"error": str(e)}

async def send_whatsapp_template(to_phone: str, template_name: str, components: list):
    """
    Fires a business-initiated template message to the customer (costs ~$0.01 / ~₹0.80).
    Requires the template to be pre-approved in Meta Business Manager.
    """
    url = f"https://graph.facebook.com/v18.0/{META_PHONE_ID}/messages"
    headers = {
        "Authorization": f"Bearer {META_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Normalize India phone number if needed
    if len(to_phone) == 10:
        to_phone = "91" + to_phone

    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {
                "code": "en_US" # or en, based on your template
            },
            "components": components
        }
    }

    # Don't actually hit the Meta API if we are just testing with dummy tokens
    if META_ACCESS_TOKEN == "dummy_token_replace_in_prod":
        print(f"DUMMY MODE: Simulating WhatsApp Template '{template_name}' sent to {to_phone}")
        return {"messaging_product": "whatsapp", "simulated": True}

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            print(f"Meta API Error: {e.response.text}")
            return {"error": e.response.text}
        except Exception as e:
            print(f"Request Error: {e}")
            return {"error": str(e)}
