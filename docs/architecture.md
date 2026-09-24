# TechPulse AI — Architecture & Multi-Agent Design

## 1. Modular Source Connectors
The ingestion layer uses a connector pattern where each provider (`HackerNewsConnector`, `GitHubConnector`, `ArxivConnector`, `RedditConnector`, `ProductHuntConnector`) executes independently with circuit breaking and rate-limit guards.

## 2. Multi-Agent Pipeline
```
RAW SIGNALS
  ↓ [Collector Agent] — Schema Normalization
  ↓ [Classification Agent] — Category & Entity Extraction
  ↓ [Deduplication Agent] — Cross-Source Event Clustering
  ↓ [Trend Detection Agent] — Momentum & Diversity Scoring
  ↓ [Research Agent] — Multi-Source Context Building
  ↓ [Fact Verifier Agent] — Date & Credibility Checking
  ↓ [Personalization Agent] — User Profile Weighting
  ↓ [Explanation Agent] — Multi-Tier Syntheses (TLDR/Beginner/Technical/Impact/Learn)
  ↓ [Notification Agent] — Push Threshold Filtering (Usefulness > Frequency)
USER RADAR & CLIENTS
```

## 3. Transparent Momentum Scoring Formula
$$\text{Momentum} = 0.35 \times \text{Diversity} + 0.30 \times \text{Velocity} + 0.20 \times \text{Engagement} + 0.15 \times \text{Recency}$$
- **Emerging**: High diversity velocity across fresh sources.
- **Rising**: Growing cross-community discussion.
- **Established**: Broad enterprise / developer adoption.
- **Cooling**: Velocity decay.
