import os
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from routers import auth, feedback, coupon, admin, superadmin, billing, whatsapp, marketing, contact, sync
from limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# ---------------------------------------------------------------------------
# Centralised logging configuration
# ---------------------------------------------------------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Startup secret validation
# Refuse to start in production if critical secrets are missing.
# ---------------------------------------------------------------------------
REQUIRED_SECRETS = [
    "SECRET_KEY",
    "SUPABASE_JWT_SECRET",
    "META_APP_SECRET",
    "RAZORPAY_WEBHOOK_SECRET",
]

if os.getenv("ENVIRONMENT", "development") != "development":
    missing = [v for v in REQUIRED_SECRETS if not os.getenv(v)]
    if missing:
        raise RuntimeError(
            f"FATAL: The following required environment variables are not set: {', '.join(missing)}. "
            "The application cannot start in a non-development environment without them."
        )
else:
    # Warn in dev so developers know which vars are missing
    for var in REQUIRED_SECRETS:
        if not os.getenv(var):
            logger.warning(
                f"[DEV MODE] Environment variable '{var}' is not set. "
                "This would cause a startup failure in production."
            )

# ---------------------------------------------------------------------------
# Security headers middleware
# ---------------------------------------------------------------------------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------
app = FastAPI(title="Q-Rate Lite")

# CORS — must be added before other middleware
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.add_middleware(SecurityHeadersMiddleware)

# Rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Global exception handler — never expose internal details to the client
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router,       prefix="/api/auth",       tags=["auth"])
app.include_router(sync.router,       prefix="/api/auth",       tags=["auth"])
app.include_router(feedback.router,   prefix="/api/feedback",   tags=["feedback"])
app.include_router(coupon.router,     prefix="/api/coupon",     tags=["coupon"])
app.include_router(admin.router,      prefix="/api/admin",      tags=["admin"])
app.include_router(superadmin.router, prefix="/api/superadmin", tags=["superadmin"])
app.include_router(billing.router,    prefix="/api/billing",    tags=["billing"])
app.include_router(whatsapp.router,   prefix="/api/whatsapp",   tags=["whatsapp"])
app.include_router(marketing.router,  prefix="/api/marketing",  tags=["marketing"])
app.include_router(contact.router,    prefix="/api/contact",    tags=["contact"])

@app.get("/api/")
def read_root():
    return {"status": "ok", "message": "Q-Rate Lite Backend is running"}
