from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Cafe(Base):
    __tablename__ = "cafes"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False) # e.g., "blue-tokai-hyd"
    name = Column(String, nullable=False)
    # Simple auth for staff/owners for now
    hashed_password = Column(String, nullable=False) 
    
    # Metadata for Option 1 Flow
    google_maps_link = Column(String, nullable=True) # For 4-5 star redirect
    reward_text = Column(String, default="10% off on your next visit", nullable=True) # Nullable for migration safety

    feedbacks = relationship("Feedback", back_populates="cafe")
    coupons = relationship("Coupon", back_populates="cafe")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    cafe_id = Column(Integer, ForeignKey("cafes.id"), nullable=False)
    customer_phone = Column(String, index=True, nullable=False) # WhatsApp number
    rating = Column(Integer, nullable=False) # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    cafe = relationship("Cafe", back_populates="feedbacks")

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    cafe_id = Column(Integer, ForeignKey("cafes.id"), nullable=False)
    code = Column(String, unique=True, index=True, nullable=False) # e.g., "ABCD-1234"
    customer_phone = Column(String, index=True, nullable=False)
    status = Column(String, default="issued") # issued, redeemed, expired
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    redeemed_at = Column(DateTime, nullable=True)

    cafe = relationship("Cafe", back_populates="coupons")
