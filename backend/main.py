from fastapi import FastAPI

app = FastAPI(title="Q-Rate Lite")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Q-Rate Lite Backend is running"}
