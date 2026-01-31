from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from models import Cafe, Feedback, Coupon
import sys
import os

# Add backend to path so imports work
sys.path.append(os.path.join(os.getcwd()))

client = TestClient(app)

def setup_test_data():
    db = SessionLocal()
    # Ensure test cafe exists with google link
    cafe = db.query(Cafe).filter(Cafe.slug == "test-cafe-hyd").first()
    if not cafe:
        cafe = Cafe(name="Test Cafe", slug="test-cafe-hyd", hashed_password="pw", google_maps_link="https://maps.google.com")
        db.add(cafe)
    else:
        cafe.google_maps_link = "https://maps.google.com"
    
    # Clean previous data for this test
    db.query(Feedback).delete()
    db.query(Coupon).delete()
    db.commit()
    return cafe.id

def verify_feedback_flow():
    print("--- Verifying Feedback Flow ---")
    cafe_id = setup_test_data()

    # 1. Get Token (Stub)
    phone_5star = "919000000005"
    resp = client.post(f"/auth/login_stub?phone={phone_5star}&cafe_id={cafe_id}")
    assert resp.status_code == 200
    token_5star = resp.json()["access_token"]

    # 2. Submit 5-Star Feedback (Expect Redirect)
    payload = {"token": token_5star, "rating": 5, "comment": "Loved it!"}
    resp = client.post("/feedback/submit", json=payload)
    print(f"5-Star Response: {resp.json()}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["coupon_code"] is not None
    assert data["redirect_url"] == "https://maps.google.com"
    print(">> 5-Star Test PASSED (Got Redirect)")

    # 3. Submit 2-Star Feedback (Expect No Redirect)
    phone_2star = "919000000002"
    resp = client.post(f"/auth/login_stub?phone={phone_2star}&cafe_id={cafe_id}")
    token_2star = resp.json()["access_token"]
    
    payload = {"token": token_2star, "rating": 2, "comment": "Too cold"}
    resp = client.post("/feedback/submit", json=payload)
    print(f"2-Star Response: {resp.json()}")
    data = resp.json()
    assert data["status"] == "success"
    assert data["coupon_code"] is not None
    assert data["redirect_url"] is None
    print(">> 2-Star Test PASSED (No Redirect)")

    # 4. Duplicate Check
    resp = client.post("/feedback/submit", json=payload)
    print(f"Duplicate Response: {resp.json()}")
    data = resp.json()
    assert data["status"] == "exists"
    assert data["coupon_code"] is not None # Should return same code
    print(">> Duplicate Test PASSED")

if __name__ == "__main__":
    verify_feedback_flow()
