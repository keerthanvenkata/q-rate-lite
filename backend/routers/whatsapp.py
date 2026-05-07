from fastapi import APIRouter, Request, Response, HTTPException
import os
import httpx

router = APIRouter()

META_VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "qrate_verify_123")
META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN", "dummy_token_replace_in_prod")
META_PHONE_ID = os.getenv("META_PHONE_ID", "dummy_phone_id")

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


@router.post("/webhook")
async def receive_webhook(request: Request):
    """
    Receives inbound messages and delivery status updates from Meta.
    (Currently we only care about outbound messages, but we must return 200 OK)
    """
    try:
        body = await request.json()
        # In the future, log inbound errors or user replies here
        return {"status": "ok"}
    except Exception:
        return {"status": "ok"}

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
