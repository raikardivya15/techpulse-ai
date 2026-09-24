# TechPulse AI — API Documentation

Interactive Swagger / OpenAPI UI is accessible at `http://localhost:8000/docs`.

### Key Endpoints

#### Authentication & Onboarding
- `POST /auth/signup` — Create new user account with initial preferences.
- `POST /auth/login` — Login with JWT bearer token generation.
- `POST /auth/onboarding` — 6-step user role, taxonomy, source, and notification sensitivity setup.
- `POST /auth/logout-all` — Invalidate all active device sessions.

#### Radar Feeds & Discovery
- `GET /feed` — Get personalized home radar (Hero Signal, Trending Topics, For You, What Changed, Startup/Dev/Research radars).
- `GET /discover` — Filterable discovery by category (AI, Dev, Startups, Research, Security) and natural language search.
- `GET /topics/{slug}` — Topic deep dive with source breakdown, chronological timeline, expert commentary, and multi-tier explanations.
- `GET /articles/{id}` — Article detail with primary source links, key takeaways, and AI analysis.

#### AI Assistant & RAG
- `POST /ai/chat` — Conversational assistant with retrieved factual citations.
- `GET /ai/chat/stream` — Real-time Server-Sent Events (SSE) token stream.
- `GET /ai/explain` — Quick explanation endpoint (`tldr`, `beginner`, `technical`, `impact`, `learn`).

#### Library & Interactions
- `GET /library` — User's saved articles and followed topics.
- `POST /library/save` — Bookmark signal with optional notes.
- `DELETE /library/save/{id}` — Remove bookmark.
- `POST /library/follow/topic` — Follow topic for elevated radar priority.
- `POST /library/feedback` — Submit "Not Interested" tuning feedback.

#### Notifications & Briefings
- `GET /notifications` — Intelligent push alerts list.
- `POST /notifications/{id}/read` — Mark alert as read.
- `GET /digests/daily` — Daily 5-item executive briefing with recommended learning.
- `GET /digests/weekly` — Macro technology landscape report.

#### Admin Observability
- `GET /admin/overview` — Collector health, agent run latencies, token spending, deduplication rate.
