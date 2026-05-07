from sqlalchemy.orm import Session
from models import AuditLog
import json

def log_audit(db: Session, actor: str, action: str, target_cafe_id: int = None, details: dict = None):
    """
    Central helper to write immutable audit logs to the database.
    """
    log_entry = AuditLog(
        actor=actor,
        action=action,
        target_cafe_id=target_cafe_id,
        details=json.dumps(details) if details else None
    )
    db.add(log_entry)
    db.commit()
