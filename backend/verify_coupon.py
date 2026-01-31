from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from models import Cafe, Feedback, Coupon
import sys
import os

sys.path.append(os.path.join(os.getcwd()))
client = TestClient(app)

def verify_redemption():
    print("--- Verifying Coupon Redemption ---")
    db = SessionLocal()
    # 1. Setup Data: Cafe + Coupon
    cafe = db.query(Cafe).filter(Cafe.slug == "test-cafe-hyd").first()
    # Reset pw just in case
    cafe.hashed_password = "staff-secret"
    db.commit()

    # Create a fresh coupon
    coupon = Coupon(cafe_id=cafe.id, customer_phone="919000000009", code="REDEEM123", status="issued")
    db.add(coupon)
    db.commit()

    # 2. Try Redeem with Wrong Passcode
    payload = {"coupon_code": "REDEEM123", "passcode": "wrong-pw"}
    resp = client.post("/coupon/redeem", json=payload)
    print(f"Wrong PW Response: {resp.status_code}")
    assert resp.status_code == 403

    # 3. Try Redeem with Correct Passcode
    payload["passcode"] = "staff-secret"
    resp = client.post("/coupon/redeem", json=payload)
    print(f"Success Response: {resp.json()}")
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
    
    # Verify in DB
    db.refresh(coupon)
    assert coupon.status == "redeemed"
    assert coupon.redeemed_at is not None
    print(">> Redemption Success Test PASSED")

    # 4. Try Redeem Again (Double Spend)
    resp = client.post("/coupon/redeem", json=payload)
    print(f"Double Spend Response: {resp.status_code}")
    assert resp.status_code == 400
    print(">> Double Spend Protection PASSED")

if __name__ == "__main__":
    verify_redemption()
