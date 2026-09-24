"""
User Library, Saved Items, Followed Topics, and Feedback router.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from packages.database.db import get_db
from packages.database.models import SavedItem, DismissedItem, User, UserPreference, Event, Topic
from services.api.routers.auth import get_current_user
from services.api.schemas import SaveItemRequest, FollowTopicRequest, FeedbackRequest
from services.api.routers.feed import serialize_event, serialize_topic

router = APIRouter(prefix="/library", tags=["Library & Preferences"])

@router.get("")
async def get_user_library(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Fetch saved items
    saved_res = await db.execute(select(SavedItem).filter_by(user_id=current_user.id).order_by(SavedItem.created_at.desc()))
    saved_records = saved_res.scalars().all()

    saved_articles = []
    for s in saved_records:
        if s.event_id:
            ev_res = await db.execute(select(Event).filter_by(id=s.event_id))
            ev = ev_res.scalars().first()
            if ev:
                saved_articles.append({
                    "saved_id": s.id,
                    "custom_notes": s.custom_notes,
                    "saved_at": s.created_at.isoformat(),
                    "event": serialize_event(ev, True)
                })

    # Fetch followed topics
    pref_res = await db.execute(select(UserPreference).filter_by(user_id=current_user.id))
    pref = pref_res.scalars().first()
    followed_topics = []
    if pref and pref.followed_topics:
        topics_res = await db.execute(select(Topic).filter(Topic.slug.in_(pref.followed_topics)))
        topics = topics_res.scalars().all()
        followed_topics = [serialize_topic(t, True) for t in topics]

    return {
        "saved_articles": saved_articles,
        "followed_topics": followed_topics
    }

@router.post("/save")
async def save_item(
    req: SaveItemRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    existing_res = await db.execute(select(SavedItem).filter_by(user_id=current_user.id, event_id=req.event_id))
    if existing_res.scalars().first():
        return {"message": "Item already in library", "status": "exists"}

    saved = SavedItem(
        user_id=current_user.id,
        event_id=req.event_id,
        topic_id=req.topic_id,
        item_type=req.item_type,
        custom_notes=req.custom_notes
    )
    db.add(saved)
    await db.commit()
    return {"message": "Saved to library successfully", "status": "saved", "id": saved.id}

@router.delete("/save/{event_id}")
async def unsave_item(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    await db.execute(delete(SavedItem).filter_by(user_id=current_user.id, event_id=event_id))
    await db.commit()
    return {"message": "Removed from library", "status": "unsaved"}

@router.post("/follow/topic")
async def follow_topic(
    req: FollowTopicRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    pref_res = await db.execute(select(UserPreference).filter_by(user_id=current_user.id))
    pref = pref_res.scalars().first()
    if pref:
        current_list = list(pref.followed_topics or [])
        if req.topic_slug not in current_list:
            current_list.append(req.topic_slug)
            pref.followed_topics = current_list
            await db.commit()

    return {"message": f"Now following {req.topic_slug}", "is_followed": True}

@router.delete("/follow/topic/{slug}")
async def unfollow_topic(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    pref_res = await db.execute(select(UserPreference).filter_by(user_id=current_user.id))
    pref = pref_res.scalars().first()
    if pref and pref.followed_topics:
        current_list = list(pref.followed_topics)
        if slug in current_list:
            current_list.remove(slug)
            pref.followed_topics = current_list
            await db.commit()

    return {"message": f"Unfollowed {slug}", "is_followed": False}

@router.post("/feedback")
async def give_feedback(
    req: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    dismissed = DismissedItem(
        user_id=current_user.id,
        event_id=req.event_id,
        topic_id=req.topic_id,
        reason=req.reason
    )
    db.add(dismissed)
    await db.commit()
    return {"message": "Feedback recorded. Your personal radar has been updated.", "status": "ok"}
