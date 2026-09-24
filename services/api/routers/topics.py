"""
Topic Deep-Dive router for TechPulse AI.
Provides complete intelligence on specific emerging topics.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from packages.database.db import get_db
from packages.database.models import Topic, Event, SourceItem, User, UserPreference
from services.api.routers.auth import get_current_user
from services.api.routers.feed import serialize_topic, serialize_event

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.get("")
async def list_all_topics(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).order_by(Topic.momentum_score.desc()))
    topics = result.scalars().all()
    return [serialize_topic(t) for t in topics]

@router.get("/{slug}")
async def get_topic_by_slug(
    slug: str,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Topic).filter_by(slug=slug))
    topic = result.scalars().first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    is_followed = False
    if current_user:
        pref_res = await db.execute(select(UserPreference).filter_by(user_id=current_user.id))
        pref = pref_res.scalars().first()
        if pref and pref.followed_topics and slug in pref.followed_topics:
            is_followed = True

    # Get associated events
    events_res = await db.execute(select(Event).filter_by(topic_id=topic.id).order_by(Event.published_at.desc()))
    events = events_res.scalars().all()

    # Get all linked source items
    source_items_res = await db.execute(
        select(SourceItem).join(Event, SourceItem.event_id == Event.id).filter(Event.topic_id == topic.id)
    )
    source_items = source_items_res.scalars().all()

    return {
        "topic": serialize_topic(topic, is_followed),
        "events": [serialize_event(e) for e in events],
        "sources": [
            {
                "id": s.id,
                "source_type": s.source_type,
                "title": s.title,
                "url": s.url,
                "author": s.author,
                "summary": s.summary,
                "score": s.score,
                "comments_count": s.comments_count,
                "published_at": s.published_at.isoformat() if s.published_at else ""
            }
            for s in source_items
        ]
    }
