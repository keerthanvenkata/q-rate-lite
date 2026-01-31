from fastapi import FastAPI
from routers import auth, feedback, coupon

app = FastAPI(title="Q-Rate Lite")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(coupon.router, prefix="/coupon", tags=["coupon"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Q-Rate Lite Backend is running"}
