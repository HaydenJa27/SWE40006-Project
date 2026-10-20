import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from prometheus_fastapi_instrumentator import Instrumentator

from app.database import engine, Base, get_db
from app.api.v1.items import router as items_router
from app.seed import seed_items

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("TESTING") != "True":
        try:
            Base.metadata.create_all(bind=engine)
            seed_items()
        except Exception as exc:
            print(f"Database connection warning on startup: {exc}")
    yield

app = FastAPI(
    title="SWE40006 Inventory Tracking API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app, endpoint="/metrics")

@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint to verify live database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database unreachable: {str(exc)}"
        )

app.include_router(items_router, prefix="/api/v1")