from fastapi import FastAPI
from routers import auth

app = FastAPI(title="Q-Rate Lite")

app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Q-Rate Lite Backend is running"}
