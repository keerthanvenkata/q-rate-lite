from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Cafe(Base):
    __tablename__ = "cafes"
    __table_args__ = (
        CheckConstraint("subscription_status IN ('trial', 'active', 'cancelled', 'past_due')", name="check_valid_status"),
    )

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False) # e.g., "blue-tokai-hyd"
    name = Column(String, nullable=False)
    # Simple auth for staff/owners for now (Deprecated for Supabase Auth)
    hashed_password = Column(String, nullable=True) 
    
    # Supabase Auth User ID
    auth_id = Column(String, unique=True, index=True, nullable=True)
    
    # Metadata for Option 1 Flow
    google_maps_link = Column(String, nullable=True) # For 4-5 star redirect
    reward_text = Column(String, default="10% off on your next visit", nullable=True) # Nullable for migration safety

    # Billing & Subscriptions
    subscription_status = Column(String, server_default="trial", default="trial", nullable=False) # trial, active, past_due, cancelled
    subscription_plan = Column(String, nullable=True) # monthly, annual
    razorpay_customer_id = Column(String, nullable=True)
    plan_expiry = Column(DateTime, nullable=True)
    marketing_credits = Column(Integer, server_default="0", default=0, nullable=False)
    onboarding_completed = Column(Boolean, server_default="0", default=False, nullable=False)

    feedbacks = relationship("Feedback", back_populates="cafe")
    coupons = relationship("Coupon", back_populates="cafe")

class Feedback(Base):
    __tablename__ = "feedbacks"
    __table_args__ = (UniqueConstraint('cafe_id', 'customer_phone', name='uix_cafe_customer_feedback'),)

    id = Column(Integer, primary_key=True, index=True)
    cafe_id = Column(Integer, ForeignKey("cafes.id"), index=True, nullable=False)
    customer_phone = Column(String, index=True, nullable=False) # WhatsApp number
    rating = Column(Integer, nullable=False) # 1-5
    comment = Column(Text, nullable=True)
    marketing_opt_in = Column(Boolean, server_default="1", default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    cafe = relationship("Cafe", back_populates="feedbacks")

class Coupon(Base):
    __tablename__ = "coupons"
    __table_args__ = (UniqueConstraint('cafe_id', 'customer_phone', name='uix_cafe_customer_coupon'),)

    id = Column(Integer, primary_key=True, index=True)
    cafe_id = Column(Integer, ForeignKey("cafes.id"), index=True, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False) # e.g., "ABCD-1234"
    customer_phone = Column(String, index=True, nullable=False)
    status = Column(String, default="issued") # issued, redeemed, expired
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    redeemed_at = Column(DateTime, nullable=True)

    cafe = relationship("Cafe", back_populates="coupons")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor = Column(String, nullable=False) # e.g. "superadmin"
    action = Column(String, nullable=False) # e.g. "UPDATE_SUBSCRIPTION"
    target_cafe_id = Column(Integer, index=True, nullable=True)
    details = Column(Text, nullable=True) # JSON dump of what changed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    company = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String, server_default="unread", default="unread", nullable=False) # unread, read, archived
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ProcessedWebhook(Base):
    __tablename__ = "processed_webhooks"

    message_id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
