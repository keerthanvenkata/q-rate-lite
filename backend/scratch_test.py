import os
import sys

os.environ["SECRET_KEY"] = "mysecret"
os.environ["SUPABASE_JWT_SECRET"] = "mysupabasejwtsecret"
os.environ["META_ACCESS_TOKEN"] = "dummy_token_replace_in_prod"

from fastapi.testclient import TestClient
from main import app
from auth import create_access_token

client = TestClient(app)

def run_tests():
    print("Testing UAT...")
    
    from database import SessionLocal
    from models import Cafe
    db = SessionLocal()
    cafe = db.query(Cafe).filter(Cafe.id == 1).first()
    if not cafe:
        print("Inserting test cafe...")
        cafe = Cafe(name="Test Cafe", slug="test-cafe", auth_id="test_auth")
        db.add(cafe)
        db.commit()
    db.close()

    token_data = {
        "sub": "919999999999",
        "cafe_id": 1,
        "iss": "qrate-customer",
        "aud": "cafe-1"
    }
    token = create_access_token(token_data)
    print("Generated token:", token)

    url = "/feedback/submit"

    print("\n--- Step 1: Invalid Rating ---")
    invalid_payload = {
        "token": token,
        "rating": 6,
        "comment": "Too good!"
    }
    resp1 = client.post(url, json=invalid_payload)
    print("Response Code:", resp1.status_code)
    print("Response Body:", resp1.text)
    
    print("\n--- Step 2: Valid Rating ---")
    valid_payload = {
        "token": token,
        "rating": 4,
        "comment": "Nice place"
    }
    resp2 = client.post(url, json=valid_payload)
    print("Response Code:", resp2.status_code)
    print("Response Body:", resp2.text)

    print("\n--- Step 2: Idempotency ---")
    resp3 = client.post(url, json=valid_payload)
    print("Response Code:", resp3.status_code)
    print("Response Body:", resp3.text)

if __name__ == "__main__":
    run_tests()
