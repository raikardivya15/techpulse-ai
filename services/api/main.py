"""
TechPulse AI - FastAPI Production Backend Application.
Provides RESTful APIs, SSE streaming, RAG conversational engine, and multi-agent coordination.
"""
import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from packages.database.db import init_db
from packages.database.seed_data import seed_database
from services.api.routers import (
    auth, feed, topics, articles, ai, library,
    notifications, digests, admin, settings, realtime
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and seed intelligence dataset
    print("🚀 Initializing TechPulse AI Database & Knowledge Base...")
    await init_db()
    try:
        await seed_database()
    except Exception as e:
        print(f"Warning during seed data population: {e}")
    print("✅ TechPulse AI Backend Service Ready!")
    yield
    print("🛑 Shutting down TechPulse AI Backend Service...")

app = FastAPI(
    title="TechPulse AI API",
    description="Your AI radar for what's happening in technology. Real-time multi-agent intelligence platform.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Next.js frontend, Expo mobile app, and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All API Routers
app.include_router(auth.router)
app.include_router(feed.router)
app.include_router(topics.router)
app.include_router(articles.router)
app.include_router(ai.router)
app.include_router(library.router)
app.include_router(notifications.router)
app.include_router(digests.router)
app.include_router(admin.router)
app.include_router(settings.router)
app.include_router(realtime.router)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "techpulse-api",
        "version": "1.0.0",
        "environment": os.getenv("ENV", "production")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.main:app", host="0.0.0.0", port=8000, reload=True)
