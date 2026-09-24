"""
Feed and Discover router for TechPulse AI.
Powers the Home Radar, Today's Signal, Trending Now, and Discover page.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_

from packages.database.db import get_db
from packages.database.models import Topic, Event, User, UserPreference, SavedItem
from services.api.routers.auth import get_current_user

router = APIRouter(tags=["Feed & Radar"])

def serialize_event(ev: Event, is_saved: bool = False) -> dict:
    return {
        "id": ev.id,
        "title": ev.title,
        "slug": ev.slug,
        "summary": ev.summary,
        "what_happened": ev.what_happened,
        "why_it_matters": ev.why_it_matters,
        "technical_explanation": ev.technical_explanation,
        "business_impact": ev.business_impact,
        "developer_impact": ev.developer_impact,
        "what_changed": ev.what_changed,
        "category": ev.category,
        "published_at": ev.published_at.isoformat() if ev.published_at else "",
        "primary_source_name": ev.primary_source_name or "Verified Signal",
        "primary_source_url": ev.primary_source_url,
        "is_verified": ev.is_verified,
        "radar_section": ev.radar_section,
        "tags": ev.tags or [],
        "key_takeaways": ev.key_takeaways or [],
        "is_saved": is_saved
    }

def serialize_topic(t: Topic, is_followed: bool = False) -> dict:
    return {
        "id": t.id,
        "slug": t.slug,
        "title": t.title,
        "tagline": t.tagline,
        "category": t.category,
        "status": t.status,
        "momentum_score": t.momentum_score,
        "source_count": t.source_count,
        "source_diversity": t.source_diversity,
        "is_hero_signal": t.is_hero_signal,
        "what_happened": t.what_happened,
        "why_trending": t.why_trending,
        "why_it_matters": t.why_it_matters,
        "technical_explanation": t.technical_explanation,
        "business_impact": t.business_impact,
        "developer_impact": t.developer_impact,
        "what_changed": t.what_changed,
        "learning_recommendations": t.learning_recommendations or [],
        "expert_quotes": t.expert_quotes or [],
        "timeline_events": t.timeline_events or [],
        "related_technologies": t.related_technologies or [],
        "source_breakdown": t.source_breakdown or {},
        "is_followed": is_followed
    }

@router.get("/feed")
async def get_home_feed(
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch followed topics and saved items for current user
    user_followed_slugs = set()
    user_saved_event_ids = set()

    if current_user:
        pref_res = await db.execute(select(UserPreference).filter_by(user_id=current_user.id))
        pref = pref_res.scalars().first()
        if pref and pref.followed_topics:
            user_followed_slugs = set(pref.followed_topics)

        saved_res = await db.execute(select(SavedItem).filter_by(user_id=current_user.id))
        saved_items = saved_res.scalars().all()
        user_saved_event_ids = set(s.event_id for s in saved_items if s.event_id)

    # 1. Hero Signal Topic
    hero_res = await db.execute(select(Topic).filter_by(is_hero_signal=True))
    hero_topic = hero_res.scalars().first()
    if not hero_topic:
        all_topics_res = await db.execute(select(Topic).order_by(Topic.momentum_score.desc()))
        hero_topic = all_topics_res.scalars().first()

    # 2. Trending Topics
    trending_res = await db.execute(select(Topic).order_by(Topic.momentum_score.desc()).limit(6))
    trending_topics = trending_res.scalars().all()

    # 3. All Events by Radar Section
    events_res = await db.execute(select(Event).order_by(Event.published_at.desc()))
    all_events = events_res.scalars().all()

    for_you = []
    changed_today = []
    startup_radar = []
    dev_radar = []
    research_radar = []

    for ev in all_events:
        is_saved = ev.id in user_saved_event_ids
        s_ev = serialize_event(ev, is_saved)

        if ev.radar_section == "changed_today":
            changed_today.append(s_ev)
        elif ev.radar_section == "startup_radar":
            startup_radar.append(s_ev)
        elif ev.radar_section == "dev_radar":
            dev_radar.append(s_ev)
        elif ev.radar_section == "research_radar":
            research_radar.append(s_ev)
        else:
            for_you.append(s_ev)

    return {
        "hero_signal": serialize_topic(hero_topic, hero_topic.slug in user_followed_slugs) if hero_topic else None,
        "trending": [serialize_topic(t, t.slug in user_followed_slugs) for t in trending_topics],
        "for_you": for_you[:6],
        "changed_today": changed_today,
        "startup_radar": startup_radar,
        "dev_radar": dev_radar,
        "research_radar": research_radar
    }

@router.get("/discover")
async def get_discover(
    category: Optional[str] = Query("All"),
    timeframe: Optional[str] = Query("Today"),
    query: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Event).order_by(Event.published_at.desc())

    if category and category != "All":
        stmt = stmt.filter(Event.category == category)

    if query:
        q = f"%{query}%"
        stmt = stmt.filter(or_(Event.title.ilike(q), Event.summary.ilike(q), Event.what_happened.ilike(q)))

    result = await db.execute(stmt)
    events = result.scalars().all()

    # Also search topics
    topic_stmt = select(Topic).order_by(Topic.momentum_score.desc())
    if category and category != "All":
        topic_stmt = topic_stmt.filter(Topic.category == category)
    if query:
        q = f"%{query}%"
        topic_stmt = topic_stmt.filter(or_(Topic.title.ilike(q), Topic.tagline.ilike(q), Topic.what_happened.ilike(q)))

    topic_res = await db.execute(topic_stmt)
    topics = topic_res.scalars().all()

    return {
        "category": category,
        "query": query,
        "topics": [serialize_topic(t) for t in topics],
        "events": [serialize_event(e) for e in events]
    }
