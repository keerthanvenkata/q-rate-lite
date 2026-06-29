from fastapi import APIRouter, HTTPException, Depends
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Tuple
import asyncio
import logging

from database import get_db, SessionLocal
from models import Cafe, Feedback
from routers.whatsapp import send_whatsapp_template
from audit import log_audit
from dependencies import get_current_user, require_active_subscription

logger = logging.getLogger(__name__)

router = APIRouter()


class BlastRequest(BaseModel):
    template_name: str
    components: List[dict] = []


@router.get("/audience")
def get_marketing_audience(db: Session = Depends(get_db), cafe: Cafe = Depends(require_active_subscription)):
    opted_in_customers = db.query(Feedback.customer_phone).filter(
        Feedback.cafe_id == cafe.id,
        Feedback.marketing_opt_in == True,
    ).distinct().all()

    audience_size = len(opted_in_customers)

    return {
        "status": "success",
        "audience_size": audience_size,
        "marketing_credits": cafe.marketing_credits,
    }


def _prepare_blast(data: BlastRequest, cafe_id: int) -> Tuple[int, int, list]:
    """
    Validates credits and atomically deducts them.

    IMPORTANT: This runs in a threadpool (called via run_in_threadpool).
    Raises ValueError for business-logic errors — NOT HTTPException, because
    HTTPException raised in a threadpool does not propagate correctly through
    FastAPI's exception handling machinery.
    """
    db = SessionLocal()
    try:
        # SELECT ... FOR UPDATE prevents concurrent blasts double-spending credits
        cafe = db.query(Cafe).filter(Cafe.id == cafe_id).with_for_update().first()
        if not cafe:
            raise ValueError("Cafe not found")

        opted_in_customers = db.query(Feedback.customer_phone).filter(
            Feedback.cafe_id == cafe_id,
            Feedback.marketing_opt_in == True,
        ).distinct().all()

        audience_size = len(opted_in_customers)

        if audience_size == 0:
            raise ValueError("No opted-in audience available")

        if cafe.marketing_credits < audience_size:
            raise ValueError(
                f"Insufficient marketing credits. Need {audience_size}, have {cafe.marketing_credits}"
            )

        cafe.marketing_credits -= audience_size
        db.commit()

        return cafe.id, cafe.marketing_credits, [p for (p,) in opted_in_customers]
    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Database error during credit deduction for cafe {cafe_id}: {e}", exc_info=True)
        raise ValueError("A database error occurred during credit deduction. Please try again.")
    finally:
        db.close()


def _log_blast(cafe_id: int, success_count: int, template_name: str):
    db = SessionLocal()
    try:
        log_audit(
            db=db,
            actor=f"cafe_{cafe_id}",
            action="MARKETING_BLAST",
            target_cafe_id=cafe_id,
            details={"audience_size": success_count, "template": template_name},
        )
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to log blast audit: {e}", exc_info=True)
    finally:
        db.close()


@router.post("/blast")
async def send_marketing_blast(data: BlastRequest, cafe: Cafe = Depends(require_active_subscription)):
    # Run DB preparation in threadpool to avoid blocking event loop
    try:
        cafe_id, remaining_credits, phones = await run_in_threadpool(_prepare_blast, data, cafe.id)
    except ValueError as e:
        # Translate ValueError from threadpool into a proper HTTP response
        raise HTTPException(status_code=400, detail=str(e))

    success_count = 0
    chunk_size = 10

    # Blast out templates in chunks to avoid Vercel serverless timeouts
    for i in range(0, len(phones), chunk_size):
        chunk = phones[i:i + chunk_size]
        tasks = [
            send_whatsapp_template(
                to_phone=phone,
                template_name=data.template_name,
                components=data.components,
            )
            for phone in chunk
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for res in results:
            if isinstance(res, Exception):
                logger.warning(f"WhatsApp send failed for one recipient: {res}")
            elif isinstance(res, dict) and "error" not in res:
                success_count += 1
            else:
                # Covers simulated responses and other non-error dicts
                success_count += 1

    # Log audit in threadpool
    await run_in_threadpool(_log_blast, cafe_id, success_count, data.template_name)

    return {
        "status": "success",
        "message": f"Successfully blasted to {success_count} customers.",
        "credits_remaining": remaining_credits,
    }
