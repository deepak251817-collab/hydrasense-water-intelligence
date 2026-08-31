from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_v1_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Water Quality Intelligence and Predictive Response System - Phase 2 API",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for local development and frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix="/api")


@app.get("/")
def root():
    return {
        "status": "online",
        "project": "HydraSense",
        "phase": 2,
        "description": "AI-Powered Water Quality Intelligence and Predictive Response System",
        "docs": "/docs"
    }
