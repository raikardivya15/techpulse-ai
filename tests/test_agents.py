"""
Unit tests for the 9 TechPulse AI specialized agents.
"""
import pytest
import asyncio
from services.agents.pipeline import (
    CollectorAgent, ClassificationAgent, DeduplicationAgent,
    TrendDetectionAgent, ResearchAgent, VerificationAgent,
    PersonalizationAgent, ExplanationAgent, NotificationAgent,
    agent_pipeline
)

@pytest.mark.asyncio
async def test_collector_agent():
    collector = CollectorAgent()
    raw = [
        {"source_type": "hacker_news", "title": "Show HN: Model Context Protocol", "score": 300, "comments_count": 50},
        {"source_type": "github", "title": "langchain-ai/langgraph", "score": 1000, "comments_count": 20}
    ]
    signals = await collector.run(raw)
    assert len(signals) == 2
    assert signals[0]["source_type"] == "hacker_news"
    assert signals[0]["score"] == 300.0

@pytest.mark.asyncio
async def test_classification_agent():
    classifier = ClassificationAgent()
    signals = [
        {"title": "Mem0 and LangGraph bring persistent memory to AI agents", "content": "Memory checkpointer with PostgreSQL"},
        {"title": "Next.js 15.2 ships with Dynamic IO and React 19 compiler", "content": "use cache directive"},
        {"title": "Emergency security advisory: patch applied for Redis memory leak", "content": "CVE advisory"}
    ]
    classified = await classifier.run(signals)
    assert len(classified) == 3
    assert classified[0]["category"] == "AI"
    assert "AI Agents" in classified[0]["tags"]
    assert classified[1]["category"] == "Development"
    assert classified[2]["category"] == "Security"

@pytest.mark.asyncio
async def test_deduplication_agent():
    deduplicator = DeduplicationAgent()
    classified = [
        {"title": "AI Agent Memory Standardization", "topic_slug": "ai-agent-memory", "category": "AI", "source_type": "reddit"},
        {"title": "Show HN: Memory for LLM Agents", "topic_slug": "ai-agent-memory", "category": "AI", "source_type": "hacker_news"},
        {"title": "React 19 GA Announced", "topic_slug": "react-server-actions-v19", "category": "Development", "source_type": "blogs"}
    ]
    clusters = await deduplicator.run(classified)
    assert len(clusters) == 2 # 2 distinct topics
    agent_memory_cluster = next(c for c in clusters if c["topic_slug"] == "ai-agent-memory")
    assert len(agent_memory_cluster["sources"]) == 2

@pytest.mark.asyncio
async def test_trend_detection_scoring():
    trend_agent = TrendDetectionAgent()
    clusters = [
        {
            "id": "evt-ai-agent-memory",
            "title": "AI Agent Memory",
            "topic_slug": "ai-agent-memory",
            "category": "AI",
            "sources": [
                {"source_type": "reddit", "score": 100, "comments_count": 50},
                {"source_type": "hacker_news", "score": 400, "comments_count": 180},
                {"source_type": "github", "score": 1200, "comments_count": 40},
                {"source_type": "arxiv", "score": 50, "comments_count": 10}
            ]
        }
    ]
    scored = await trend_agent.run(clusters)
    assert len(scored) == 1
    assert scored[0]["momentum_score"] >= 0.85
    assert scored[0]["source_diversity"] == "Very High"

@pytest.mark.asyncio
async def test_personalization_agent():
    personalizer = PersonalizationAgent()
    items = [
        {"title": "AI Agent Memory", "topic_slug": "ai-agent-memory", "category": "AI"},
        {"title": "React 19 Release", "topic_slug": "react-server-actions-v19", "category": "Development"}
    ]
    user_profile = {
        "interests": ["AI", "AI Agents"],
        "followed_topics": ["ai-agent-memory"]
    }
    personalized = await personalizer.run(items, user_profile)
    assert personalized[0]["topic_slug"] == "ai-agent-memory"
    assert personalized[0]["personal_relevance_score"] > 0.90

@pytest.mark.asyncio
async def test_notification_agent_filter():
    notifier = NotificationAgent()
    items = [
        {"title": "AI Agent Memory Spike", "topic_slug": "ai-agent-memory", "category": "AI", "personal_relevance_score": 0.95, "momentum_score": 0.92},
        {"title": "Random Minor Framework", "topic_slug": "minor-tool", "category": "General", "personal_relevance_score": 0.40, "momentum_score": 0.50}
    ]
    approved = await notifier.run(items)
    # Only the high-relevance high-momentum item should pass the spam filter
    assert len(approved) == 1
    assert "AI Agent Memory" in approved[0]["title"]
