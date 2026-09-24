"""
Article / Event detail router for TechPulse AI.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from packages.database.db import get_db
from packages.database.models import Event, SourceItem, User, SavedItem
from services.api.routers.auth import get_current_user
from services.api.routers.feed import serialize_event

router = APIRouter(prefix="/articles", tags=["Articles"])

@router.get("/{identifier}")
async def get_article_detail(
    identifier: str,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Try finding by ID first, then by slug
    result = await db.execute(select(Event).filter((Event.id == identifier) | (Event.slug == identifier)))
    event = result.scalars().first()

    if not event:
        raise HTTPException(status_code=404, detail="Article/Event not found")

    is_saved = False
    if current_user:
        saved_res = await db.execute(select(SavedItem).filter_by(user_id=current_user.id, event_id=event.id))
        is_saved = saved_res.scalars().first() is not None

    # Fetch sources linked to this event
    source_res = await db.execute(select(SourceItem).filter_by(event_id=event.id))
    sources = source_res.scalars().all()

    return {
        "article": serialize_event(event, is_saved),
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
            for s in sources
        ]
    }
