"""
State definitions for the TechPulse AI Multi-Agent pipeline.
"""
from typing import TypedDict, List, Dict, Any, Optional
from pydantic import BaseModel, Field

class RawSignal(BaseModel):
    source_type: str
    external_id: str
    title: str
    url: Optional[str] = None
    author: Optional[str] = None
    content: Optional[str] = None
    score: float = 0.0
    comments_count: int = 0
    published_at: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ClassifiedSignal(RawSignal):
    category: str = "AI"
    tags: List[str] = Field(default_factory=list)
    entities: List[str] = Field(default_factory=list)
    importance_score: float = 0.5
    topic_slug: Optional[str] = None

class EventCluster(BaseModel):
    id: str
    title: str
    topic_slug: str
    category: str
    sources: List[ClassifiedSignal] = Field(default_factory=list)
    is_duplicate: bool = False
    momentum_score: float = 0.5
    verified: bool = True
    verification_notes: Optional[str] = None
    explanation: Dict[str, Any] = Field(default_factory=dict)

class AgentState(TypedDict):
    raw_signals: List[Dict[str, Any]]
    classified_signals: List[Dict[str, Any]]
    event_clusters: List[Dict[str, Any]]
    trending_topics: List[Dict[str, Any]]
    user_context: Optional[Dict[str, Any]]
    personalized_feed: List[Dict[str, Any]]
    approved_notifications: List[Dict[str, Any]]
    errors: List[str]
