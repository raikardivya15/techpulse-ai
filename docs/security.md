# TechPulse AI — Security, Privacy & Data Policies

1. **Authentication & Session Security**:
   - SHA-256 + Bcrypt compatible password hashing.
   - JWT stateless token validation with 7-day expiration.
   - Global session invalidation endpoint (`/auth/logout-all`).

2. **Source Ingestion & Platform Compliance**:
   - Strictly uses official APIs and public RSS feeds.
   - No unauthorized scraping or rate-limit violations.
   - Circuit breakers isolate failing external connectors.

3. **Factual Grounding & Zero Hallucination**:
   - System prompts prohibit inventing sources, quotes, or statistics.
   - Claims with single unverified sources are tagged with "Early unconfirmed report".

4. **Privacy & Data Minimization**:
   - Only role, technology interests, and explicitly followed topics are stored.
   - Full account and data deletion available under `/settings/account`.
