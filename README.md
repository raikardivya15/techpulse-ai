# TECHPULSE AI

> **"Your AI radar for what's happening in technology."**  
> *The internet moves fast. Your AI keeps watch.*

---

## 🌟 Overview

TechPulse AI is a **production-ready, mobile-first AI technology intelligence platform** designed to continuously monitor the technology ecosystem across **Reddit, Hacker News, GitHub, arXiv, Y Combinator, Product Hunt, engineering blogs, and research publications**.

Instead of dumping hundreds of unread articles, TechPulse answers:
1. **What happened?**
2. **Why is it trending?**
3. **Is it actually important?**
4. **Why should I care?**
5. **How does it affect me?**
6. **What should I learn next?**

---

## 🏗️ Multi-Agent Intelligence Pipeline

TechPulse AI coordinates **9 specialized agents**:

1. **Collector Agent**: Modular ingestion across APIs and public feeds with error isolation.
2. **Classification Agent**: Categorization (AI, Dev, Startups, Research, Security) and framework entity extraction.
3. **Deduplication Agent**: Semantic clustering merging 10+ identical news stories into one unified canonical event.
4. **Trend Detection Agent**: Transparent momentum scoring ($0.35 \times \text{diversity} + 0.30 \times \text{velocity} + 0.20 \times \text{engagement} + 0.15 \times \text{recency}$).
5. **Research Agent**: Multi-source context synthesis and claim grounding.
6. **Fact Verification Agent**: Credibility checks and uncertainty labeling.
7. **Personalization Agent**: User-specific relevance matching by profession, skills, and followed topics.
8. **Explanation Agent**: Multi-tier syntheses (TL;DR, Beginner, Technical, Business & Dev impact, and Learning roadmaps).
9. **Notification Agent**: High-precision push filtering optimizing strictly for **usefulness > frequency**.

---

## 🚀 Quickstart & Local Setup

### 1. Backend (FastAPI + Async SQLite / PostgreSQL)

```bash
# In project root:
source venv/bin/activate
# Run all unit and integration tests:
PYTHONPATH=. pytest tests/

# Launch API server (with automatic DB init and seed intelligence):
python3 services/api/main.py
# API is live at http://localhost:8000 (OpenAPI docs at http://localhost:8000/docs)
```

### 2. Web Application (Next.js 14 + Tailwind CSS + Editorial Design)

```bash
cd apps/web
npm install
npm run dev
# Web application is live at http://localhost:3000
```

### 3. Mobile Application (React Native + Expo)

```bash
cd apps/mobile
npm install
npm run web  # or npm start for Expo Go on iOS / Android
```

---

## 🔑 Default Demo User Credentials

For testing and exploration:
- **Email**: `divya@techpulse.ai`
- **Password**: `password123`
- **Role**: AI Engineer (Topics: AI Agent Memory, MCP, React 19)

---

## 🧪 Running Tests

```bash
PYTHONPATH=. ./venv/bin/pytest tests/ -v
```

Output:
```text
tests/test_agents.py::test_collector_agent PASSED
tests/test_agents.py::test_classification_agent PASSED
tests/test_agents.py::test_deduplication_agent PASSED
tests/test_agents.py::test_trend_detection_scoring PASSED
tests/test_agents.py::test_personalization_agent PASSED
tests/test_agents.py::test_notification_agent_filter PASSED
tests/test_api.py::test_health_check PASSED
tests/test_api.py::test_auth_login PASSED
tests/test_api.py::test_home_feed PASSED
tests/test_api.py::test_topic_detail PASSED
tests/test_api.py::test_ai_chat PASSED
tests/test_api.py::test_admin_overview PASSED
============================== 12 passed in 0.84s ==============================
```

---

## 🏛️ Monorepo Structure

```text
techpulse/
├── apps/
│   ├── web/                        # Next.js 14 Web Intelligence Platform
│   └── mobile/                     # React Native Expo Mobile Application
├── services/
│   ├── api/                        # FastAPI REST & SSE Streaming Server
│   ├── agents/                     # 9-Agent Pipeline Orchestrator
│   └── workers/                    # Modular Source Connectors & Schedulers
├── packages/
│   ├── ai/                         # Multi-Provider LLM abstraction & routing
│   ├── database/                   # SQLAlchemy async models & seed intelligence
│   └── types/                      # Shared schema definitions
├── tests/                          # Automated Pytest suite
├── docker-compose.yml              # Container orchestration
└── README.md
```
