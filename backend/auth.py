from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
import os

# Fallback to empty string; startup validation in main.py will warn/error
# if SECRET_KEY is missing in the correct environment.
SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = "HS256"

# Customer tokens are single-use (UniqueConstraint prevents replay),
# so a longer TTL gives customers time to fill the form without session expiry.
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


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
    """
    Safely decode and verify a Q-Rate customer token.

    Security invariant: the signature is ALWAYS verified first.
    We never decode with verify_signature=False.  Instead we do a
    two-pass approach:
      1. Decode with audience/issuer verification relaxed to extract cafe_id.
      2. If cafe_id is present, re-decode with strict per-cafe audience and
         issuer enforcement to prevent cross-cafe token reuse.
    """
    try:
        # Pass 1: verify signature + expiry; relax aud/iss to read cafe_id claim
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_aud": False, "verify_iss": False},
        )
        cafe_id = payload.get("cafe_id")

        if cafe_id:
            # Pass 2: re-verify with strict per-cafe audience and issuer
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM],
                audience=f"cafe-{cafe_id}",
                issuer="qrate-customer",
            )
        return payload
    except JWTError:
        return None
