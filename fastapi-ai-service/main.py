from fastapi import FastAPI
from typing import Dict

app = FastAPI(title="E-commerce AI Service")

@app.get("/")
def read_root() -> Dict[str, str]:
    return {"message": "AI Service is running"}

# Placeholder for future development
# from routers import content_generation, translation
# app.include_router(content_generation.router, prefix="/api/v1")
# app.include_router(translation.router, prefix="/api/v1")
