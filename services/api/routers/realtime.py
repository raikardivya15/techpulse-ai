"""
Real-time WebSocket & Event Broadcasting Hub for TechPulse AI.
Supports live signal ingestion, real-time push notifications, and simulated technology radar telemetry.
"""
import asyncio
import datetime
import json
import random
import uuid
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from packages.database.db import get_db, AsyncSessionLocal
from packages.database.models import User, Event, Topic, Notification, AgentRun

router = APIRouter(tags=["Realtime Telemetry & WebSockets"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"📡 Realtime WebSocket client connected. Active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"📡 Realtime WebSocket client disconnected. Active: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any]):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Failed to send to client: {e}")
                disconnected.append(connection)
        for dead in disconnected:
            self.disconnect(dead)

    async def send_to(self, websocket: WebSocket, message: Dict[str, Any]):
        try:
            await websocket.send_json(message)
        except Exception:
            self.disconnect(websocket)

manager = ConnectionManager()

# Library of high-signal emerging technology events for real-time live simulation
SIMULATION_SCENARIOS = [
    {
        "title": "Anthropic Releases Claude 3.7 Sonnet with Hybrid Reasoning",
        "category": "AI",
        "summary": "Anthropic introduces Claude 3.7 Sonnet, combining instant standard generation with dynamically scaleable internal reasoning tokens.",
        "what_happened": "Anthropic announced Claude 3.7 Sonnet, introducing a unified model capable of both near-instant response and deep Chain-of-Thought reasoning.",
        "why_it_matters": "Eliminates the need to choose between fast latency models and slow reasoning models for agent workflows.",
        "technical_explanation": "Combines reinforcement learning with verifiable reward tokens, allowing dynamic compute allocation per query.",
        "primary_source_name": "Anthropic Engineering",
        "primary_source_url": "https://anthropic.com/news/claude-3-7-sonnet",
        "topic_slug": "ai-coding-agents",
        "radar_section": "trending",
        "tags": ["Claude 3.7", "Reasoning Models", "LLMs", "Anthropic"],
        "notification_title": "🚨 Major Release: Claude 3.7 Sonnet Hybrid Reasoning",
        "notification_body": "Anthropic just launched Claude 3.7 Sonnet with unified hybrid thinking modes. Velocity +88% across HN & GitHub.",
        "urgency": "Critical"
    },
    {
        "title": "PostgreSQL 18 Adds Native In-Memory SIMD Vector Indexing",
        "category": "Development",
        "summary": "Core PostgreSQL team merges native AVX-512 SIMD vector cosine distance acceleration, boosting pgvector search speed by 4.2x.",
        "what_happened": "The PostgreSQL development group committed native vectorized index primitives into the core tree.",
        "why_it_matters": "Enables companies to run multi-million embedding searches directly inside transactional databases without external vector DBs.",
        "technical_explanation": "Implements hardware-accelerated HNSW distance calculations directly within the storage engine cache buffers.",
        "primary_source_name": "PostgreSQL Hacker List",
        "primary_source_url": "https://postgresql.org",
        "topic_slug": "ai-agent-memory",
        "radar_section": "dev_radar",
        "tags": ["PostgreSQL", "SIMD", "Vector DB", "Embeddings"],
        "notification_title": "⚡ PostgreSQL 18 Merges Native Vector Acceleration",
        "notification_body": "Native AVX-512 vector index acceleration merged into PostgreSQL core tree. +54% developer discussion.",
        "urgency": "Important"
    },
    {
        "title": "Vercel Announces Next.js Turbopack 100% Rust Engine GA",
        "category": "Development",
        "summary": "Turbopack reaches general availability, delivering 10x faster local HMR and zero-config compilation for large TypeScript codebases.",
        "what_happened": "Vercel marked Turbopack as stable default for Next.js 15.2+, retiring the legacy Webpack pipeline.",
        "why_it_matters": "Dramatically lowers developer iteration cycle times on large enterprise web applications.",
        "technical_explanation": "Rust-based persistent caching architecture with function-level incremental computation graph.",
        "primary_source_name": "Vercel Blog",
        "primary_source_url": "https://vercel.com/blog",
        "topic_slug": "react-server-actions-v19",
        "radar_section": "dev_radar",
        "tags": ["Next.js", "Turbopack", "Rust", "Frontend"],
        "notification_title": "🚀 Next.js Turbopack Reaches Stable 1.0",
        "notification_body": "Vercel officially made the Rust Turbopack bundler default for all Next.js applications.",
        "urgency": "Important"
    },
    {
        "title": "DeepSeek Open-Sources DeepSeek-V3.2 Math & Code Specialist",
        "category": "Research",
        "summary": "DeepSeek publishes open weights and reproducible GRPO training recipe for 32B model matching proprietary benchmarks.",
        "what_happened": "DeepSeek released full model weights and distillation pipeline on Hugging Face.",
        "why_it_matters": "Democratizes state-of-the-art reasoning weights for local and self-hosted inference.",
        "technical_explanation": "Group Relative Policy Optimization with verifiable rule-based code execution rewards.",
        "primary_source_name": "arXiv / DeepSeek",
        "primary_source_url": "https://arxiv.org",
        "topic_slug": "deepseek-v3-r1-open-weights",
        "radar_section": "research_radar",
        "tags": ["DeepSeek", "Open Weights", "GRPO", "Reasoning"],
        "notification_title": "🔬 DeepSeek Releases New Open-Weights Specialist",
        "notification_body": "DeepSeek open-sourced new 32B reasoning model with 92.4% on SWE-bench Verified.",
        "urgency": "Important"
    },
    {
        "title": "Model Context Protocol (MCP) Adopted by JetBrains & VS Code Ecosystem",
        "category": "AI",
        "summary": "Major IDE maintainers release native client support for MCP servers, creating universal tool standards for coding agents.",
        "what_happened": "JetBrains and Visual Studio Code plugins officially integrated MCP client specifications.",
        "why_it_matters": "Transforms agentic tool integration into an open standard equivalent to the Language Server Protocol (LSP).",
        "technical_explanation": "Standardized JSON-RPC 2.0 protocol over stdio and Server-Sent Events for tool discovery and execution.",
        "primary_source_name": "GitHub Trending",
        "primary_source_url": "https://github.com",
        "topic_slug": "model-context-protocol",
        "radar_section": "trending",
        "tags": ["MCP", "IDE", "Anthropic", "JSON-RPC"],
        "notification_title": "🌐 MCP Standard Surges: JetBrains & VS Code Support",
        "notification_body": "Model Context Protocol is now integrated across all major developer environments. Velocity +72%.",
        "urgency": "Important"
    }
]

async def create_and_broadcast_signal(scenario: Dict[str, Any], db: AsyncSession) -> Dict[str, Any]:
    """Helper to persist a simulated signal and broadcast over WebSocket."""
    # Find default user to assign notification
    user_res = await db.execute(select(User).limit(1))
    user = user_res.scalars().first()

    event_id = str(uuid.uuid4())
    slug = f"{scenario['topic_slug']}-{int(datetime.datetime.utcnow().timestamp())}"

    # 1. Create Event
    new_event = Event(
        id=event_id,
        title=scenario["title"],
        slug=slug,
        summary=scenario["summary"],
        what_happened=scenario["what_happened"],
        why_it_matters=scenario["why_it_matters"],
        technical_explanation=scenario["technical_explanation"],
        business_impact="Accelerates engineering velocity and platform adoption.",
        developer_impact="Reduces boilerplate and unlocks higher system throughput.",
        what_changed="Brings production-grade capabilities previously requiring custom infrastructure.",
        category=scenario["category"],
        primary_source_name=scenario["primary_source_name"],
        primary_source_url=scenario["primary_source_url"],
        is_verified=True,
        radar_section=scenario["radar_section"],
        tags=scenario["tags"],
        key_takeaways=[
            f"Verified signal from {scenario['primary_source_name']}",
            "High momentum detected across GitHub and developer communities",
            "Actionable for engineering teams planning roadmap updates"
        ],
        published_at=datetime.datetime.utcnow()
    )
    db.add(new_event)

    # 2. Create Notification if user exists
    notif_data = None
    if user:
        notif_id = str(uuid.uuid4())
        new_notif = Notification(
            id=notif_id,
            user_id=user.id,
            title=scenario["notification_title"],
            body=scenario["notification_body"],
            category=scenario["category"],
            urgency=scenario["urgency"],
            topic_slug=scenario["topic_slug"],
            event_id=event_id,
            deep_link=f"/article/{slug}",
            is_read=False,
            is_delivered=True,
            created_at=datetime.datetime.utcnow()
        )
        db.add(new_notif)
        notif_data = {
            "id": notif_id,
            "title": new_notif.title,
            "body": new_notif.body,
            "category": new_notif.category,
            "urgency": new_notif.urgency,
            "topic_slug": new_notif.topic_slug,
            "event_id": new_notif.event_id,
            "deep_link": new_notif.deep_link,
            "is_read": False,
            "created_at": new_notif.created_at.isoformat()
        }

    # 3. Log an agent run
    db.add(AgentRun(
        id=str(uuid.uuid4()),
        agent_name="Live Telemetry Ingestion",
        status="Success",
        items_processed=1,
        tokens_used=1240,
        latency_ms=145,
        details={"source": scenario["primary_source_name"], "event": scenario["title"]}
    ))

    await db.commit()

    # 4. Broadcast to all active WebSocket clients
    payload = {
        "type": "NEW_SIGNAL",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "event": {
            "id": event_id,
            "title": new_event.title,
            "slug": new_event.slug,
            "summary": new_event.summary,
            "category": new_event.category,
            "primary_source_name": new_event.primary_source_name,
            "radar_section": new_event.radar_section,
            "published_at": new_event.published_at.isoformat(),
            "tags": new_event.tags,
            "is_verified": True
        },
        "notification": notif_data
    }

    await manager.broadcast(payload)
    return payload

@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial connection handshake
        await websocket.send_json({
            "type": "CONNECTED",
            "message": "Connected to TechPulse AI Realtime Radar Telemetry Stream",
            "active_nodes": 8,
            "timestamp": datetime.datetime.utcnow().isoformat()
        })

        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                action = msg.get("action")
                if action == "PING":
                    await websocket.send_json({
                        "type": "PONG",
                        "timestamp": datetime.datetime.utcnow().isoformat()
                    })
                elif action == "SIMULATE":
                    # Trigger an instant live simulation
                    async with AsyncSessionLocal() as session:
                        scenario = random.choice(SIMULATION_SCENARIOS)
                        res = await create_and_broadcast_signal(scenario, session)
            except Exception as e:
                print(f"Error handling websocket message: {e}")

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

@router.post("/realtime/simulate")
async def trigger_realtime_simulation(db: AsyncSession = Depends(get_db)):
    """
    Manually triggers an intelligent real-time signal and broadcasts push notification to all connected clients.
    """
    scenario = random.choice(SIMULATION_SCENARIOS)
    payload = await create_and_broadcast_signal(scenario, db)
    return {
        "status": "success",
        "message": "Real-time signal simulated and dispatched via WebSocket",
        "data": payload
    }

@router.get("/realtime/status")
async def get_realtime_status():
    return {
        "active_clients": len(manager.active_connections),
        "pipeline_status": "Online & Streaming",
        "telemetry_protocol": "WebSocket + SSE",
        "connected_nodes": ["Reddit", "Hacker News", "GitHub", "arXiv", "Y Combinator", "Product Hunt"]
    }
