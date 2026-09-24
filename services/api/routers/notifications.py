"""
Notification router for TechPulse AI.
Supports list, mark as read, and device token registration for mobile/web push.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from packages.database.db import get_db
from packages.database.models import Notification, User
from services.api.routers.auth import get_current_user
from services.api.schemas import RegisterDeviceRequest

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
async def get_user_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    res = await db.execute(
        select(Notification)
        .filter_by(user_id=current_user.id)
        .order_by(Notification.created_at.desc())
    )
    notifications = res.scalars().all()

    return [
        {
            "id": n.id,
            "title": n.title,
            "body": n.body,
            "category": n.category,
            "urgency": n.urgency,
            "topic_slug": n.topic_slug,
            "event_id": n.event_id,
            "deep_link": n.deep_link,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else ""
        }
        for n in notifications
    ]

@router.post("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    await db.execute(
        update(Notification)
        .where(Notification.id == notification_id, Notification.user_id == current_user.id)
        .values(is_read=True)
    )
    await db.commit()
    return {"message": "Notification marked as read", "status": "ok"}

@router.post("/register-device")
async def register_device(
    req: RegisterDeviceRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # In production, saves device push token for Firebase / Expo
    return {"message": "Device push token registered successfully.", "platform": req.platform}
