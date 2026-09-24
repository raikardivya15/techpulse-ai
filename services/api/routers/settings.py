"""
User Settings & Security router.
Supports profile updates, interest preferences, notification thresholds, quiet hours, and data export/deletion.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from packages.database.db import get_db
from packages.database.models import User, Profile, UserPreference
from services.api.routers.auth import get_current_user
from services.api.schemas import UpdateProfileRequest, UpdatePreferencesRequest

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("")
async def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    prof_res = await db.execute(select(Profile).filter_by(user_id=current_user.id))
    profile = prof_res.scalars().first()

    pref_res = await db.execute(select(UserPreference).filter_by(user_id=current_user.id))
    pref = pref_res.scalars().first()

    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": profile.role if profile else "AI Engineer",
            "skill_level": profile.skill_level if profile else "Advanced",
            "avatar_url": profile.avatar_url if profile else None
        },
        "preferences": {
            "interests": pref.interests if pref else [],
            "followed_topics": pref.followed_topics if pref else [],
            "followed_technologies": pref.followed_technologies if pref else [],
            "enabled_sources": pref.enabled_sources if pref else [],
            "notification_frequency": pref.notification_frequency if pref else "Important",
            "notification_timing": pref.notification_timing if pref else "Morning",
            "quiet_hours_start": pref.quiet_hours_start if pref else "22:00",
            "quiet_hours_end": pref.quiet_hours_end if pref else "08:00",
            "ai_response_style": pref.ai_response_style if pref else "Technical & Actionable",
            "theme_preference": pref.theme_preference if pref else "dark"
        }
    }

@router.post("/profile")
async def update_profile(
    req: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if req.name:
        current_user.name = req.name

    prof_res = await db.execute(select(Profile).filter_by(user_id=current_user.id))
    profile = prof_res.scalars().first()
    if profile:
        if req.role:
            profile.role = req.role
        if req.skill_level:
            profile.skill_level = req.skill_level
        if req.avatar_url:
            profile.avatar_url = req.avatar_url

    await db.commit()
    return {"message": "Profile updated successfully.", "status": "ok"}

@router.post("/preferences")
async def update_preferences(
    req: UpdatePreferencesRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    pref_res = await db.execute(select(UserPreference).filter_by(user_id=current_user.id))
    pref = pref_res.scalars().first()
    if pref:
        if req.interests is not None:
            pref.interests = req.interests
        if req.followed_topics is not None:
            pref.followed_topics = req.followed_topics
        if req.enabled_sources is not None:
            pref.enabled_sources = req.enabled_sources
        if req.notification_frequency is not None:
            pref.notification_frequency = req.notification_frequency
        if req.notification_timing is not None:
            pref.notification_timing = req.notification_timing
        if req.quiet_hours_start is not None:
            pref.quiet_hours_start = req.quiet_hours_start
        if req.quiet_hours_end is not None:
            pref.quiet_hours_end = req.quiet_hours_end
        if req.theme_preference is not None:
            pref.theme_preference = req.theme_preference

    await db.commit()
    return {"message": "Preferences updated successfully.", "status": "ok"}

@router.delete("/account")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    await db.delete(current_user)
    await db.commit()
    return {"message": "Account and all associated personal data permanently deleted."}
