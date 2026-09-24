"""
Pydantic v2 schemas for API requests, responses, and validation.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field

# Auth Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: Optional[str] = None
    agree_terms: bool = True

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class AuthResponse(BaseModel):
    token: str
    user: Dict[str, Any]

# Onboarding Schemas
class OnboardingRequest(BaseModel):
    role: str
    custom_role: Optional[str] = None
    interests: List[str]
    skill_level: str # Beginner, Intermediate, Advanced, Expert
    sources: List[str]
    notification_frequency: str
    notification_timing: str
    quiet_hours_start: Optional[str] = "22:00"
    quiet_hours_end: Optional[str] = "08:00"

# Feed & Topic Schemas
class EventResponse(BaseModel):
    id: str
    title: str
    slug: str
    summary: str
    what_happened: Optional[str] = None
    why_it_matters: Optional[str] = None
    technical_explanation: Optional[str] = None
    business_impact: Optional[str] = None
    developer_impact: Optional[str] = None
    what_changed: Optional[str] = None
    category: str
    published_at: str
    primary_source_name: str
    primary_source_url: Optional[str] = None
    is_verified: bool = True
    radar_section: str
    tags: List[str] = []
    key_takeaways: List[str] = []
    is_saved: Optional[bool] = False

class TopicResponse(BaseModel):
    id: str
    slug: str
    title: str
    tagline: Optional[str] = None
    category: str
    status: str
    momentum_score: float
    source_count: int
    source_diversity: str
    is_hero_signal: bool
    what_happened: Optional[str] = None
    why_trending: Optional[str] = None
    why_it_matters: Optional[str] = None
    technical_explanation: Optional[str] = None
    business_impact: Optional[str] = None
    developer_impact: Optional[str] = None
    what_changed: Optional[str] = None
    learning_recommendations: List[Dict[str, Any]] = []
    expert_quotes: List[Dict[str, Any]] = []
    timeline_events: List[Dict[str, Any]] = []
    related_technologies: List[str] = []
    source_breakdown: Dict[str, int] = {}
    is_followed: Optional[bool] = False

class FeedResponse(BaseModel):
    hero_signal: Optional[TopicResponse] = None
    trending: List[TopicResponse] = []
    for_you: List[EventResponse] = []
    changed_today: List[EventResponse] = []
    startup_radar: List[EventResponse] = []
    dev_radar: List[EventResponse] = []
    research_radar: List[EventResponse] = []

# AI Chat Schemas
class ChatMessage(BaseModel):
    role: str # user, assistant, system
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    topic_slug: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    citations: List[Dict[str, Any]] = []

# Library & Interaction
class SaveItemRequest(BaseModel):
    event_id: Optional[str] = None
    topic_id: Optional[str] = None
    item_type: str = "article"
    custom_notes: Optional[str] = None

class FollowTopicRequest(BaseModel):
    topic_slug: str

class FeedbackRequest(BaseModel):
    event_id: Optional[str] = None
    topic_id: Optional[str] = None
    reason: str # "Not relevant", "Too repetitive", "Don't want this topic", "Too basic", "Too advanced"

# Notification Registration
class RegisterDeviceRequest(BaseModel):
    push_token: str
    platform: str # "ios", "android", "web"

# Settings
class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    skill_level: Optional[str] = None
    avatar_url: Optional[str] = None

class UpdatePreferencesRequest(BaseModel):
    interests: Optional[List[str]] = None
    followed_topics: Optional[List[str]] = None
    enabled_sources: Optional[List[str]] = None
    notification_frequency: Optional[str] = None
    notification_timing: Optional[str] = None
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None
    theme_preference: Optional[str] = None
