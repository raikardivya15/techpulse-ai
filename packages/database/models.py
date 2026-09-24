"""
SQLAlchemy models for TechPulse AI.
Includes users, profiles, sources, topics, events, trend signals, embeddings, notifications, and analytics.
"""
import uuid
import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime,
    ForeignKey, Table, JSON, Index, UniqueConstraint
)
from sqlalchemy.orm import relationship
from .db import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    saved_items = relationship("SavedItem", back_populates="user", cascade="all, delete-orphan")
    dismissed_items = relationship("DismissedItem", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    reading_history = relationship("ReadingHistory", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    role = Column(String(100), default="AI Engineer")
    custom_role = Column(String(100), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    skill_level = Column(String(50), default="Intermediate") # Beginner, Intermediate, Advanced, Expert
    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    interests = Column(JSON, default=list) # List of category/tag strings
    followed_topics = Column(JSON, default=list) # List of topic slug strings
    followed_technologies = Column(JSON, default=list)
    followed_companies = Column(JSON, default=list)
    enabled_sources = Column(JSON, default=lambda: ["reddit", "hacker_news", "github", "arxiv", "product_hunt", "yc", "blogs"])
    notification_frequency = Column(String(50), default="Important") # Critical only, Important, Daily intelligence, Everything
    notification_timing = Column(String(50), default="Morning") # Morning, Afternoon, Evening, Custom
    quiet_hours_start = Column(String(10), default="22:00")
    quiet_hours_end = Column(String(10), default="08:00")
    ai_response_style = Column(String(50), default="Technical & Actionable")
    theme_preference = Column(String(20), default="dark") # dark, light, system
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="preferences")

class Source(Base):
    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    key = Column(String(50), unique=True, index=True, nullable=False) # hacker_news, github, reddit, arxiv, etc.
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="General Tech")
    base_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    poll_interval_minutes = Column(Integer, default=15)
    last_polled_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="Healthy") # Healthy, Degraded, Down
    error_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    items = relationship("SourceItem", back_populates="source_rel")

class SourceItem(Base):
    __tablename__ = "source_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    source_id = Column(String(36), ForeignKey("sources.id"), nullable=True)
    source_type = Column(String(50), index=True, nullable=False) # hacker_news, reddit, github, arxiv, etc.
    external_id = Column(String(255), index=True, nullable=True)
    title = Column(String(500), nullable=False)
    url = Column(String(1000), nullable=True)
    author = Column(String(255), nullable=True)
    raw_content = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    published_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    score = Column(Float, default=0.0) # Upvotes, stars, points
    comments_count = Column(Integer, default=0)
    metadata_json = Column(JSON, default=dict)
    is_processed = Column(Boolean, default=False)
    event_id = Column(String(36), ForeignKey("events.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    source_rel = relationship("Source", back_populates="items")
    event = relationship("Event", back_populates="source_items")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    tagline = Column(String(300), nullable=True)
    category = Column(String(100), index=True, default="AI") # AI, Development, Startups, Research, Security, Cloud, Developer Tools
    status = Column(String(50), default="Emerging") # Emerging, Rising, Established, Cooling
    momentum_score = Column(Float, default=0.85) # 0.0 to 1.0
    source_count = Column(Integer, default=1)
    source_diversity = Column(String(100), default="High") # Low, Medium, High, Very High
    is_hero_signal = Column(Boolean, default=False)

    what_happened = Column(Text, nullable=True)
    why_trending = Column(Text, nullable=True)
    why_it_matters = Column(Text, nullable=True)
    technical_explanation = Column(Text, nullable=True)
    business_impact = Column(Text, nullable=True)
    developer_impact = Column(Text, nullable=True)
    what_changed = Column(Text, nullable=True)
    learning_recommendations = Column(JSON, default=list) # [{title, desc, duration, link}]
    expert_quotes = Column(JSON, default=list) # [{expert, role, quote, source}]
    timeline_events = Column(JSON, default=list) # [{date, title, description, source}]
    related_technologies = Column(JSON, default=list) # ["LangGraph", "Mem0", "Redis Vector"]
    source_breakdown = Column(JSON, default=dict) # {"reddit": 18, "github": 12, "arxiv": 4, "news": 7}

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    events = relationship("Event", back_populates="topic")

class Event(Base):
    __tablename__ = "events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    topic_id = Column(String(36), ForeignKey("topics.id"), nullable=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=False)
    what_happened = Column(Text, nullable=True)
    why_it_matters = Column(Text, nullable=True)
    technical_explanation = Column(Text, nullable=True)
    business_impact = Column(Text, nullable=True)
    developer_impact = Column(Text, nullable=True)
    what_changed = Column(Text, nullable=True)
    category = Column(String(100), default="AI")
    published_at = Column(DateTime, default=datetime.datetime.utcnow)
    primary_source_url = Column(String(1000), nullable=True)
    primary_source_name = Column(String(100), default="Hacker News")
    is_verified = Column(Boolean, default=True)
    verification_notes = Column(Text, nullable=True)
    radar_section = Column(String(50), default="trending") # hero, trending, for_you, startup_radar, dev_radar, research_radar, changed_today
    tags = Column(JSON, default=list)
    key_takeaways = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    topic = relationship("Topic", back_populates="events")
    source_items = relationship("SourceItem", back_populates="event")
    saved_by = relationship("SavedItem", back_populates="event")

class SavedItem(Base):
    __tablename__ = "saved_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    event_id = Column(String(36), ForeignKey("events.id"), nullable=True)
    topic_id = Column(String(36), ForeignKey("topics.id"), nullable=True)
    item_type = Column(String(50), default="article") # article, topic, company, tech, paper
    custom_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_items")
    event = relationship("Event", back_populates="saved_by")

class DismissedItem(Base):
    __tablename__ = "dismissed_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    event_id = Column(String(36), nullable=True)
    topic_id = Column(String(36), nullable=True)
    reason = Column(String(100), default="Not relevant") # Not relevant, Too repetitive, Don't want this topic, Too basic, Too advanced
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="dismissed_items")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    category = Column(String(50), default="Trend") # Trend, Security, Release, Digest
    urgency = Column(String(50), default="Important") # Critical, Important, Info
    topic_slug = Column(String(150), nullable=True)
    event_id = Column(String(36), nullable=True)
    deep_link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    is_delivered = Column(Boolean, default=True)
    delivered_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class ReadingHistory(Base):
    __tablename__ = "reading_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    event_id = Column(String(36), nullable=True)
    topic_slug = Column(String(150), nullable=True)
    duration_seconds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reading_history")

class ContentEmbedding(Base):
    __tablename__ = "content_embeddings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    content_id = Column(String(36), index=True, nullable=False) # event_id or topic_id
    content_type = Column(String(50), default="event")
    title = Column(String(500), nullable=False)
    text_chunk = Column(Text, nullable=False)
    embedding_json = Column(JSON, nullable=True) # Vector stored as JSON array for universal fallback
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    agent_name = Column(String(100), nullable=False) # Collector, Classifier, Deduplicator, Trend, etc.
    status = Column(String(50), default="Success") # Running, Success, Failed
    items_processed = Column(Integer, default=0)
    tokens_used = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    details = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AdminMetric(Base):
    __tablename__ = "admin_metrics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    metric_name = Column(String(100), index=True, nullable=False)
    metric_value = Column(Float, nullable=False)
    dimensions = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
