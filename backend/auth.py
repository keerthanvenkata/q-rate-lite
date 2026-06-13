from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
import os

SECRET_KEY = os.getenv("SECRET_KEY", "missing_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        # Decode without verification to extract cafe_id
        unverified_payload = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM], 
            options={"verify_signature": False, "verify_aud": False, "verify_iss": False, "verify_exp": False}
        )
        cafe_id = unverified_payload.get("cafe_id")
        
        if cafe_id:
            # Enforce scoping if cafe_id is present (customer token)
            payload = jwt.decode(
                token, 
                SECRET_KEY, 
                algorithms=[ALGORITHM], 
                audience=f"cafe-{cafe_id}", 
                issuer="qrate-customer"
            )
        else:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
