"""
Integration tests for FastAPI REST endpoints.
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from services.api.main import app
from packages.database.db import init_db
from packages.database.seed_data import seed_database

@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    await init_db()
    await seed_database()

@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_auth_login():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/auth/login", json={
            "email": "divya@techpulse.ai",
            "password": "password123"
        })
        assert res.status_code == 200
        data = res.json()
        assert "token" in data
        assert data["user"]["email"] == "divya@techpulse.ai"

@pytest.mark.asyncio
async def test_home_feed():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/feed")
        assert res.status_code == 200
        data = res.json()
        assert "hero_signal" in data
        assert "trending" in data
        assert len(data["trending"]) > 0

@pytest.mark.asyncio
async def test_topic_detail():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/topics/ai-agent-memory")
        assert res.status_code == 200
        data = res.json()
        assert data["topic"]["slug"] == "ai-agent-memory"
        assert len(data["sources"]) > 0

@pytest.mark.asyncio
async def test_ai_chat():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/ai/chat", json={
            "message": "Why is AI Agent Memory trending?",
            "topic_slug": "ai-agent-memory"
        })
        assert res.status_code == 200
        data = res.json()
        assert "response" in data
        assert len(data["citations"]) > 0

@pytest.mark.asyncio
async def test_admin_overview():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/admin/overview")
        assert res.status_code == 200
        data = res.json()
        assert data["system_health"] == "Optimal"
        assert len(data["sources"]) > 0
