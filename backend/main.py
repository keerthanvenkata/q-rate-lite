from fastapi import FastAPI
from routers import auth, feedback, coupon, admin, superadmin, billing, whatsapp, marketing, contact
from limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI(title="Q-Rate Lite")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(coupon.router, prefix="/coupon", tags=["coupon"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(superadmin.router, prefix="/superadmin", tags=["superadmin"])
app.include_router(billing.router, prefix="/billing", tags=["billing"])
app.include_router(whatsapp.router, prefix="/whatsapp", tags=["whatsapp"])
app.include_router(marketing.router, prefix="/marketing", tags=["marketing"])
app.include_router(contact.router, prefix="/contact", tags=["contact"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Q-Rate Lite Backend is running"}
