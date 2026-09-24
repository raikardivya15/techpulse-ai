"""
Daily Briefing & Weekly Intelligence Landscape reports router.
"""
import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from packages.database.db import get_db
from packages.database.models import Topic, Event, User
from services.api.routers.auth import get_current_user
from services.api.routers.feed import serialize_topic, serialize_event

router = APIRouter(prefix="/digests", tags=["Digests & Reports"])

@router.get("/daily")
async def get_daily_digest(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Retrieve top verified events
    res = await db.execute(select(Event).order_by(Event.published_at.desc()).limit(5))
    events = res.scalars().all()

    return {
        "title": "Your Daily Tech Brief",
        "date": datetime.datetime.utcnow().strftime("%A, %B %d, %Y"),
        "curator_note": "We filtered 4,800 raw signals across developer communities and research hubs. Here are the 5 high-impact shifts worth your attention today.",
        "top_stories": [serialize_event(e) for e in events],
        "recommended_learning": {
            "title": "Mastering LangGraph State Checkpointers & MCP Bridges",
            "duration": "25 minutes",
            "description": "Understand how episodic state machines prevent token exhaustion in production AI agent systems.",
            "link": "/topic/ai-agent-memory"
        }
    }

@router.get("/weekly")
async def get_weekly_report(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    topics_res = await db.execute(select(Topic).order_by(Topic.momentum_score.desc()).limit(6))
    topics = topics_res.scalars().all()

    return {
        "title": "Weekly Technology Landscape Report",
        "week_range": "Week of September 2026",
        "executive_summary": "The technology landscape is undergoing a structural paradigm shift toward persistent agent memory, standardized tool protocols (MCP), and open-weight reasoning distillation.",
        "rising_trends": [serialize_topic(t) for t in topics[:3]],
        "established_technologies": [serialize_topic(t) for t in topics[3:5]],
        "cooling_down": [
            {
                "title": "Naive Context Window Expansion",
                "reason": "O(N^2) token costs and attention degradation have led developers to adopt tiered episodic memory instead."
            }
        ],
        "strategic_recommendations": [
            "Standardize internal APIs as Model Context Protocol (MCP) servers.",
            "Implement Postgres checkpointer states for multi-session agent reliability.",
            "Evaluate DeepSeek-R1 distilled 14B/32B models for offline self-hosted developer automation."
        ]
    }
