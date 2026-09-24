"""
Rich, highly detailed, realistic seed dataset for TechPulse AI.
Includes users, sources, topics, multi-source aggregated events, timeline milestones,
learning roadmaps, agent run history, and admin telemetry.
"""
import datetime
import hashlib
from sqlalchemy import select
from .db import AsyncSessionLocal, init_db
from .models import (
    User, Profile, UserPreference, Source, SourceItem,
    Topic, Event, SavedItem, Notification, AgentRun, AdminMetric
)

def hash_password(password: str) -> str:
    # SHA-256 for simple robust mock/dev auth fallback + bcrypt compatible format
    return hashlib.sha256(password.encode()).hexdigest()

async def seed_database():
    await init_db()
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        result = await session.execute(select(User).filter_by(email="divya@techpulse.ai"))
        existing_user = result.scalars().first()
        if existing_user:
            return

        now = datetime.datetime.utcnow()
        yesterday = now - datetime.timedelta(days=1)
        two_days_ago = now - datetime.timedelta(days=2)

        # 1. Create Default Demo User
        demo_user = User(
            email="divya@techpulse.ai",
            name="Divya Raikar",
            hashed_password=hash_password("password123"),
            is_active=True,
            is_verified=True,
            is_admin=True,
            created_at=now
        )
        session.add(demo_user)
        await session.flush()

        # User Profile
        demo_profile = Profile(
            user_id=demo_user.id,
            role="AI Engineer",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
            skill_level="Advanced",
            onboarding_completed=True,
            created_at=now
        )
        session.add(demo_profile)

        # User Preferences
        demo_prefs = UserPreference(
            user_id=demo_user.id,
            interests=["AI", "Generative AI", "AI Agents", "LLMs", "RAG", "Full Stack", "Developer Tools", "Startups"],
            followed_topics=["ai-agent-memory", "model-context-protocol", "agentic-rag-architectures"],
            followed_technologies=["LangGraph", "Mem0", "Next.js", "FastAPI", "React", "Rust", "vLLM"],
            followed_companies=["Anthropic", "OpenAI", "Y Combinator", "Meta AI", "Vercel"],
            enabled_sources=["reddit", "hacker_news", "github", "arxiv", "product_hunt", "yc", "blogs"],
            notification_frequency="Important",
            notification_timing="Morning",
            quiet_hours_start="22:00",
            quiet_hours_end="08:00",
            ai_response_style="Technical & Actionable",
            theme_preference="dark"
        )
        session.add(demo_prefs)

        # 2. Ingestion Sources
        sources_data = [
            {"key": "hacker_news", "name": "Hacker News", "category": "Community Discussions", "base_url": "https://news.ycombinator.com", "status": "Healthy"},
            {"key": "github", "name": "GitHub Ecosystem", "category": "Open Source Code", "base_url": "https://github.com", "status": "Healthy"},
            {"key": "reddit", "name": "Reddit Tech", "category": "Developer Communities", "base_url": "https://reddit.com", "status": "Healthy"},
            {"key": "arxiv", "name": "arXiv CS & AI", "category": "Research Publications", "base_url": "https://arxiv.org", "status": "Healthy"},
            {"key": "product_hunt", "name": "Product Hunt", "category": "Product Launches", "base_url": "https://producthunt.com", "status": "Healthy"},
            {"key": "yc", "name": "Y Combinator Launches", "category": "Startups & VC", "base_url": "https://www.ycombinator.com", "status": "Healthy"},
            {"key": "blogs", "name": "Engineering Publications", "category": "Technical Blogs", "base_url": "https://engineering.atspotify.com", "status": "Healthy"},
            {"key": "hugging_face", "name": "Hugging Face Models", "category": "Model Hub", "base_url": "https://huggingface.co", "status": "Healthy"},
        ]
        created_sources = {}
        for s in sources_data:
            src = Source(
                key=s["key"],
                name=s["name"],
                category=s["category"],
                base_url=s["base_url"],
                status=s["status"],
                poll_interval_minutes=15,
                last_polled_at=now,
                error_count=0
            )
            session.add(src)
            created_sources[s["key"]] = src
        await session.flush()

        # 3. Comprehensive Topics
        topic_agent_memory = Topic(
            slug="ai-agent-memory",
            title="AI Agent Memory & Long-Term State Orchestration",
            tagline="Transitioning autonomous agents from stateless token sessions to persistent episodic & semantic cognitive memory.",
            category="AI",
            status="Emerging",
            momentum_score=0.96,
            source_count=42,
            source_diversity="Very High",
            is_hero_signal=True,
            what_happened="Over the past 72 hours, independent discussions across Hacker News, GitHub repository releases (Mem0, LangGraph Checkpointers), and 4 arXiv preprints converged on standardizing tiered agent memory architectures (short-term working context, episodic historical memory, and semantic graph indexing).",
            why_trending="Developers building autonomous coding and business automation agents have hit the strict limits of single-turn context windows, prompting a rush toward persistent memory architectures that survive multi-session executions without losing user preferences or tool execution histories.",
            why_it_matters="Without structured memory, AI agents remain brittle chatbots. Long-term memory enables agents to execute workflows spanning days or weeks, learning continuously from human corrections and enterprise knowledge graphs.",
            technical_explanation="State-of-the-art implementations use a tri-layer memory model: (1) In-context Working Memory bounded by attention limits, (2) Episodic Memory stored in vector databases (e.g. pgvector, Qdrant) with temporal decay scoring, and (3) Semantic Knowledge Graphs using Neo4j/RDF for relationship validation.",
            business_impact="Enterprises can deploy autonomous customer engineering and developer automation agents with high retention rates, saving up to 80% on redundant LLM prompt tokens while drastically reducing hallucination risks.",
            developer_impact="Engineers must move beyond simple stateless LangChain chains to state machines (like LangGraph) with persistent Postgres/Redis checkpointers, transactional rollback hooks, and structured memory retrieval APIs.",
            what_changed="Shifted from naive brute-force RAG prompt stuffing to hierarchical memory consolidation where background agent threads summarize and distill conversation history into long-term profile records.",
            learning_recommendations=[
                {"title": "Implement LangGraph Postgres Checkpointers", "desc": "Set up fault-tolerant agent state machines with time-travel debugging.", "duration": "45 min", "link": "https://langchain-ai.github.io/langgraph/"},
                {"title": "Memory Consolidation Patterns", "desc": "Study how Mem0 & Generative Agents distill raw event streams into semantic knowledge.", "duration": "30 min", "link": "https://mem0.ai"},
                {"title": "Temporal Vector Decay in pgvector", "desc": "Calculate recency-weighted similarity scores for agent recall.", "duration": "25 min", "link": "https://github.com/pgvector/pgvector"}
            ],
            expert_quotes=[
                {"expert": "Harrison Chase", "role": "CEO, LangChain", "quote": "The biggest leap in 2025 agent engineering isn't bigger base models; it's persistent state management that survives network disconnects and multi-agent delegation.", "source": "Engineering Podcast"},
                {"expert": "Swyx", "role": "AI Engineer Foundation", "quote": "Memory is the bridge between a toy chatbot demo and a reliable software engineer colleague.", "source": "Latent Space"}
            ],
            timeline_events=[
                {"date": "3 days ago", "title": "Mem0 v2 Architecture Released", "description": "Graph-augmented personal memory layer introduced for LLM agents.", "source": "GitHub"},
                {"date": "2 days ago", "title": "arXiv:2502.14920 Paper Published", "description": "Benchmarking Hierarchical Episodic Memory in Long-Horizon Coding Tasks.", "source": "arXiv"},
                {"date": "Yesterday", "title": "Hacker News #1 Discussion", "description": "850+ comments analyzing state persistence versus expanding context windows.", "source": "Hacker News"},
                {"date": "Today", "title": "Standardized Spec Proposals", "description": "OpenAgentMemory RFC drafted across major developer communities.", "source": "TechPulse Radar"}
            ],
            related_technologies=["LangGraph", "Mem0", "pgvector", "Redis Stack", "Neo4j", "LlamaIndex"],
            source_breakdown={"reddit": 18, "github": 12, "hacker_news": 7, "arxiv": 5, "yc": 3}
        )

        topic_mcp = Topic(
            slug="model-context-protocol",
            title="Model Context Protocol (MCP) Open Ecosystem Explosion",
            tagline="Anthropic's open standard for connecting AI models to local development tools, databases, and enterprise APIs gains massive adoption.",
            category="Developer Tools",
            status="Rising",
            momentum_score=0.92,
            source_count=35,
            source_diversity="High",
            is_hero_signal=False,
            what_happened="Anthropic's Model Context Protocol (MCP) saw over 120 new open-source server connectors released in 7 days, including official bridges for PostgreSQL, GitHub, Linear, Slack, Google Drive, and local filesystem tools.",
            why_trending="Engineers are standardizing on MCP as the 'USB-C for AI applications' instead of writing custom proprietary tool-calling integrations for every individual LLM framework.",
            why_it_matters="MCP provides a clean separation of concerns: tool makers write one MCP server, and any compliant client (Claude Desktop, Cursor, Custom Agent) can instantly discover and use it safely.",
            technical_explanation="MCP operates via JSON-RPC 2.0 over standard IO (stdio) or Server-Sent Events (SSE). It exposes three primitives: Resources (readable data), Prompts (user-controlled templates), and Tools (executable functions with JSON schema arguments).",
            business_impact="Drastically decreases tool integration costs and accelerates enterprise AI deployment by turning existing REST APIs into zero-friction agent tool registries.",
            developer_impact="Devs can write lightweight TypeScript or Python MCP servers to expose internal microservices, database schemas, or monitoring clusters directly to agentic coding tools.",
            what_changed="Replaced ad-hoc OpenAI function calling boilerplates with a standardized client-server protocol with built-in capability negotiation and security boundary prompts.",
            learning_recommendations=[
                {"title": "Build a Custom Python MCP Server", "desc": "Expose internal SQL query runners safely to Claude Desktop and Cursor.", "duration": "20 min", "link": "https://modelcontextprotocol.io"},
                {"title": "MCP Security Best Practices", "desc": "Implement client confirmation gates to prevent unauthorized write tool execution.", "duration": "15 min", "link": "https://anthropic.com"}
            ],
            expert_quotes=[
                {"expert": "Alex Albert", "role": "Head of Developer Relations, Anthropic", "quote": "MCP isn't just an API; it's the foundation for how agents interface with human infrastructure safely.", "source": "Dev Tweet"}
            ],
            timeline_events=[
                {"date": "1 week ago", "title": "Initial MCP Specification Released", "description": "Open protocol specification open-sourced by Anthropic.", "source": "Anthropic Blog"},
                {"date": "4 days ago", "title": "Cursor & Zed Integration Support", "description": "IDE maintainers announce native MCP server configuration.", "source": "GitHub"},
                {"date": "Yesterday", "title": "Over 200 Community Servers Cataloged", "description": "Smithery and awesome-mcp lists reach peak GitHub star velocity.", "source": "Hacker News"}
            ],
            related_technologies=["MCP SDK", "JSON-RPC", "Claude 3.7", "Cursor", "Zed", "FastAPI"],
            source_breakdown={"github": 16, "hacker_news": 9, "reddit": 7, "blogs": 3}
        )

        topic_react19 = Topic(
            slug="react-server-actions-v19",
            title="React 19 & Next.js Dynamic IO Optimization",
            tagline="Next.js 15 & React 19 introduce compiler-driven caching and eliminate boilerplate memoization.",
            category="Development",
            status="Established",
            momentum_score=0.78,
            source_count=28,
            source_diversity="Medium",
            is_hero_signal=False,
            what_happened="Vercel and the React core team shipped Next.js 15.2 with Dynamic IO and the React 19 Compiler in general availability, replacing manual useMemo/useCallback hooks with automated AST optimization.",
            why_trending="Frontend engineers are refactoring large codebases to leverage automatic component memoization and async Server Actions with streamlined error handling.",
            why_it_matters="Removes an entire class of subtle rerender performance bugs while simplifying state synchronization between client React trees and server edge workers.",
            technical_explanation="The React Compiler analyzes JavaScript semantics to memoize values and components at compile-time. Dynamic IO automatically treats uncached data fetches as dynamic while keeping surrounding layout shells static.",
            business_impact="Reduces frontend page load latency by up to 35% and improves Core Web Vitals with zero client-side hydration overhead on static page sections.",
            developer_impact="Developers can delete hundreds of useMemo/useCallback invocations and rely on native `use()` hooks for promise resolution in React components.",
            what_changed="Caching behavior shifted from aggressive default caching in Next 14 to opt-in explicit caching (`'use cache'`) in Next 15.",
            learning_recommendations=[
                {"title": "Mastering the 'use cache' Directive", "desc": "Granular component-level caching patterns in Next.js 15.", "duration": "20 min", "link": "https://nextjs.org/docs"},
                {"title": "React 19 Migration Guide", "desc": "Upgrading legacy forms and ref handling to React 19 standards.", "duration": "30 min", "link": "https://react.dev"}
            ],
            expert_quotes=[
                {"expert": "Lee Robinson", "role": "VP of Product, Vercel", "quote": "With 'use cache' and the React Compiler, the framework does the heavy lifting so developers write pure idiomatic JavaScript.", "source": "Next.js Conf"}
            ],
            timeline_events=[
                {"date": "2 weeks ago", "title": "Next.js 15.1 Released", "description": "Experimental Dynamic IO stabilization.", "source": "Vercel Blog"},
                {"date": "3 days ago", "title": "React 19 Production Rollouts", "description": "Major SaaS platforms report 20-30% TTFB improvements.", "source": "Reddit r/reactjs"}
            ],
            related_technologies=["React 19", "Next.js 15", "Turbopack", "Server Actions", "Tailwind CSS"],
            source_breakdown={"reddit": 12, "github": 8, "hacker_news": 5, "blogs": 3}
        )

        topic_deepseek = Topic(
            slug="deepseek-v3-r1-open-weights",
            title="Open-Weight Reasoning & Distilled LLM Paradigm",
            tagline="DeepSeek-R1 and distilled reasoning architectures shake up closed-source AI economics.",
            category="Research",
            status="Established",
            momentum_score=0.94,
            source_count=50,
            source_diversity="Very High",
            is_hero_signal=False,
            what_happened="The release of DeepSeek-R1 and its open distilled weights (Qwen 1.5B-32B, Llama 8B-70B) proved that pure reinforcement learning (RL) without human supervised fine-tuning (SFT) can match OpenAI o1 reasoning capabilities.",
            why_trending="Massive global adoption among researchers and self-hosted enterprises running local inference via Ollama, vLLM, and llama.cpp at a fraction of cloud API costs.",
            why_it_matters="Democratizes frontier reasoning intelligence, allowing private medical, legal, and financial codebases to operate offline without transmitting sensitive data to third-party APIs.",
            technical_explanation="Uses Group Relative Policy Optimization (GRPO) directly on base models with rule-based reward verification for math and coding correctness, eliminating the need for expensive critic models during RL training.",
            business_impact="Drives down enterprise AI token economics by 10x-20x, forcing commercial API providers to slash prices and open-source their developer tooling.",
            developer_impact="Engineers can run fast, high-accuracy reasoning models locally on Apple Silicon (M-series) or affordable GPUs using quantized GGUF weights.",
            what_changed="Shifted AI focus from scaling pre-training compute to scaling test-time reasoning compute with explicit `<think>` tokens.",
            learning_recommendations=[
                {"title": "Run DeepSeek-R1 Distill with vLLM & Ollama", "desc": "Set up low-latency local reasoning server with GPU acceleration.", "duration": "25 min", "link": "https://docs.vllm.ai"},
                {"title": "Understanding GRPO & Test-Time Compute", "desc": "Mathematical breakdown of Group Relative Policy Optimization.", "duration": "40 min", "link": "https://arxiv.org"}
            ],
            expert_quotes=[
                {"expert": "Andrej Karpathy", "role": "AI Educator & Researcher", "quote": "DeepSeek-R1 is a magnificent validation that open research and RL scaling can produce world-class frontier reasoning.", "source": "X / Twitter"}
            ],
            timeline_events=[
                {"date": "3 weeks ago", "title": "DeepSeek-R1 Weights Open-Sourced", "description": "Full 671B MoE and distilled 1.5B-70B models released on Hugging Face.", "source": "Hugging Face"},
                {"date": "1 week ago", "title": "Ollama & vLLM Zero-Day Support", "description": "Instant 1-click local deployment for all developers.", "source": "GitHub"},
                {"date": "2 days ago", "title": "Enterprise Self-Hosted Deployment Benchmark", "description": "Independent benchmarks confirm 95% o1 parity on SWE-bench coding.", "source": "arXiv"}
            ],
            related_technologies=["DeepSeek-R1", "vLLM", "Ollama", "GRPO", "Hugging Face", "PyTorch"],
            source_breakdown={"arxiv": 15, "github": 14, "hacker_news": 12, "reddit": 9}
        )

        topic_webgpu = Topic(
            slug="webgpu-local-inference",
            title="WebGPU & Browser-Native AI Inference",
            tagline="Zero-server LLM and whisper inference directly in the user's browser with WebGPU and Transformers.js.",
            category="AI",
            status="Emerging",
            momentum_score=0.86,
            source_count=22,
            source_diversity="Medium",
            is_hero_signal=False,
            what_happened="Transformers.js v3 and WebLLM enabled running 1B-3B parameter language models, vision models, and Whisper speech transcription fully on-device inside standard web browsers via WebGPU.",
            why_trending="SaaS applications are eliminating backend server GPU costs by offloading lightweight summarization, transcription, and text embedding directly to client hardware.",
            why_it_matters="Offers total data privacy (zero cloud data transmission) and zero operational infrastructure cost per user for client-side AI features.",
            technical_explanation="WebGPU exposes modern graphics hardware (Metal, DirectX 12, Vulkan) to JavaScript/Wasm with compute shaders, enabling fast tensor GEMM operations with near-native FLOPS.",
            business_impact="Zero-marginal-cost AI features for SaaS startups, plus complete HIPAA / GDPR compliance by keeping user audio and text strictly local.",
            developer_impact="Front-end developers can integrate speech-to-text, text classification, and embedding search using standard npm packages without spinning up Python backends.",
            what_changed="Browser AI shifted from slow CPU-bound WebAssembly to hardware-accelerated GPU compute shaders.",
            learning_recommendations=[
                {"title": "Transformers.js v3 Quickstart", "desc": "Run client-side Whisper transcription in 10 lines of JavaScript.", "duration": "15 min", "link": "https://huggingface.co/docs/transformers.js"},
                {"title": "WebGPU Compute Shaders 101", "desc": "Writing high-performance matrix multiplication in WGSL.", "duration": "35 min", "link": "https://webgpu.rocks"}
            ],
            expert_quotes=[
                {"expert": "Philipp Schmid", "role": "Technical Lead, Hugging Face", "quote": "WebGPU is turning every laptop and phone into an edge AI server without the user installing anything.", "source": "Hugging Face Blog"}
            ],
            timeline_events=[
                {"date": "5 days ago", "title": "Transformers.js v3 Official GA", "description": "Complete WebGPU support for 100+ Hugging Face architectures.", "source": "Product Hunt"},
                {"date": "2 days ago", "title": "Chrome & Safari WebGPU Parity", "description": "Apple Silicon WebGPU compute benchmarks show 12x speedup over Wasm.", "source": "Hacker News"}
            ],
            related_technologies=["WebGPU", "Transformers.js", "WebLLM", "ONNX Runtime Web", "Wasm"],
            source_breakdown={"github": 10, "product_hunt": 6, "hacker_news": 4, "blogs": 2}
        )

        session.add_all([topic_agent_memory, topic_mcp, topic_react19, topic_deepseek, topic_webgpu])
        await session.flush()

        # 4. Ingested Events with Multi-Source Attribution
        events_data = [
            # Hero Signal Event
            {
                "topic_id": topic_agent_memory.id,
                "title": "Hierarchical Memory Consolidation Becomes Standard for Production AI Agents",
                "slug": "hierarchical-memory-consolidation-standard-ai-agents",
                "summary": "Engineering teams across leading AI labs have converged on 3-tier memory consolidation systems to enable long-running autonomous workflows without token exhaustion.",
                "what_happened": "A coordinated wave of releases from open-source teams and research papers showed that treating agent memory as a structured tiered database outperforms expanding context windows.",
                "why_it_matters": "Autonomous agents can now remember user preferences, architectural decisions, and past bug fixes across months of interactions.",
                "technical_explanation": "Implements dual-pass memory: fast in-memory KV cache for current turn, episodic semantic search via vector embeddings for past tasks, and an asynchronous memory agent that extracts facts into user profile graphs.",
                "business_impact": "Reduces repetitive user prompting and cuts API token expenditure by up to 75% in enterprise customer workflows.",
                "developer_impact": "Requires implementing state machines with persistent checkpointer databases rather than stateless REST API calls.",
                "what_changed": "Replaced unbounded context accumulation with active memory pruning and summarization.",
                "category": "AI",
                "published_at": now - datetime.timedelta(hours=2),
                "primary_source_name": "Hacker News",
                "primary_source_url": "https://news.ycombinator.com/item?id=43100001",
                "radar_section": "hero",
                "is_verified": True,
                "tags": ["AI Agents", "LangGraph", "Mem0", "pgvector", "RAG"],
                "key_takeaways": [
                    "Stateless LLM sessions are giving way to tiered episodic memory databases.",
                    "Active memory background workers distill raw transcripts into compact semantic facts.",
                    "Postgres + pgvector remains the most cost-effective foundation for production agent state."
                ]
            },
            # Trending Section Events
            {
                "topic_id": topic_mcp.id,
                "title": "Model Context Protocol (MCP) Gains 120+ Open Source Connectors in One Week",
                "slug": "mcp-gains-120-open-source-connectors-one-week",
                "summary": "Anthropic's open-standard Model Context Protocol is becoming the de-facto standard for connecting AI coding assistants to developer tools and databases.",
                "what_happened": "Community developers and infrastructure providers (Supabase, Neon, GitHub, Linear) shipped official MCP servers.",
                "why_it_matters": "Eliminates repetitive custom plugin engineering for every distinct AI assistant.",
                "technical_explanation": "Uses standard JSON-RPC 2.0 primitives to expose tools, resources, and prompt templates over stdio or SSE streams.",
                "business_impact": "SaaS tools gain instant zero-friction compatibility with Cursor, Claude, and internal enterprise agent hubs.",
                "developer_impact": "Build one MCP server in TypeScript/Python and expose your data to any modern agent.",
                "what_changed": "Standardized tool definition and security approval flow across AI tools.",
                "category": "Developer Tools",
                "published_at": now - datetime.timedelta(hours=5),
                "primary_source_name": "GitHub Trending",
                "primary_source_url": "https://github.com/modelcontextprotocol",
                "radar_section": "trending",
                "is_verified": True,
                "tags": ["MCP", "Anthropic", "Developer Tools", "APIs", "Cursor"],
                "key_takeaways": [
                    "MCP acts as a universal adapter between AI agents and local/remote developer tools.",
                    "Native client support in Claude Desktop, Cursor, and Zed is accelerating ecosystem growth.",
                    "Strict client-side authorization gates ensure security against rogue tool execution."
                ]
            },
            {
                "topic_id": topic_react19.id,
                "title": "Next.js 15.2 Ships Dynamic IO and General Availability of React 19 Compiler",
                "slug": "nextjs-15-2-dynamic-io-react-19-compiler",
                "summary": "The new release introduces automatic compile-time memoization and the 'use cache' directive, simplifying full-stack React architecture.",
                "what_happened": "Vercel released Next.js 15.2, enabling automated component-level memoization without manual hook tuning.",
                "why_it_matters": "Eliminates React rendering bottlenecks and reduces boilerplate code.",
                "technical_explanation": "The React Compiler parses component trees to insert granular memoization wrappers automatically during build time.",
                "business_impact": "Higher Core Web Vitals scores and lower cloud hosting bills from smarter server-side edge caching.",
                "developer_impact": "Write clean React functions without worrying about re-creating objects or dependency arrays.",
                "what_changed": "Default caching was overhauled in favor of explicit, deterministic directives.",
                "category": "Development",
                "published_at": yesterday,
                "primary_source_name": "Vercel Engineering",
                "primary_source_url": "https://vercel.com/blog/next-15-2",
                "radar_section": "trending",
                "is_verified": True,
                "tags": ["React 19", "Next.js", "Frontend", "JavaScript", "Turbopack"],
                "key_takeaways": [
                    "React Compiler eliminates manual useMemo and useCallback hooks.",
                    "The new 'use cache' directive provides fine-grained control over server component caching.",
                    "Async request headers are explicitly isolated from static prerendered HTML shells."
                ]
            },
            # Startup Radar Event
            {
                "topic_id": topic_agent_memory.id,
                "title": "YC W25 Startups Pivot En Masse Toward Autonomous Vertical AI Agents",
                "slug": "yc-w25-startups-pivot-autonomous-vertical-agents",
                "summary": "Over 60% of the current Y Combinator batch is building autonomous agents for specialized workflows in legal, accounting, compliance, and devops.",
                "what_happened": "Analysis of YC W25 batch launches reveals a dominant shift from copilot assistants to full-stack autonomous employee software.",
                "why_it_matters": "Signals the venture capital and founder consensus that autonomous execution with verification gates will capture the next wave of enterprise SaaS.",
                "technical_explanation": "Founders are wrapping domain-specific tool suites with human-in-the-loop escalation workflows and audit logging.",
                "business_impact": "Disrupts legacy seat-based SaaS pricing in favor of outcome-based and work-completed billing.",
                "developer_impact": "High demand for AI engineers experienced with agent evaluation frameworks and reliability testing.",
                "what_changed": "Moved away from generic wrappers toward deep vertical integrations with legacy ERP/CRM systems.",
                "category": "Startups",
                "published_at": yesterday - datetime.timedelta(hours=4),
                "primary_source_name": "Y Combinator",
                "primary_source_url": "https://www.ycombinator.com/companies",
                "radar_section": "startup_radar",
                "is_verified": True,
                "tags": ["YC", "Startups", "Venture Capital", "Enterprise AI", "Automation"],
                "key_takeaways": [
                    "Outcome-based pricing is replacing traditional per-seat enterprise software licensing.",
                    "Reliability evaluations and guardrails are the top founder priorities in YC W25.",
                    "Vertical domain expertise is proving more defensive than generalist AI wrappers."
                ]
            },
            # Developer Radar Event
            {
                "topic_id": topic_webgpu.id,
                "title": "Transformers.js v3 Brings Hardware-Accelerated Local AI to Web Browsers",
                "slug": "transformers-js-v3-webgpu-local-ai",
                "summary": "Developers can now run 120+ open-source AI models directly in Chrome, Edge, and Safari with WebGPU acceleration.",
                "what_happened": "Hugging Face released Transformers.js v3 with zero-dependency WebGPU compute kernels.",
                "why_it_matters": "Enables completely private, offline, zero-cloud-cost AI capabilities for web applications.",
                "technical_explanation": "Leverages ONNX Runtime Web with WebGPU compute shaders to run FP16/INT4 quantized models on client GPUs.",
                "business_impact": "Drastically slashes cloud infrastructure costs for transcription and text classification tasks.",
                "developer_impact": "Easily implement speech-to-text, text classification, and embeddings using a simple npm package.",
                "what_changed": "Transitions browser-based machine learning from an experimental novelty into a production-grade technique.",
                "category": "Developer Tools",
                "published_at": two_days_ago,
                "primary_source_name": "Product Hunt",
                "primary_source_url": "https://producthunt.com/posts/transformers-js-v3",
                "radar_section": "dev_radar",
                "is_verified": True,
                "tags": ["WebGPU", "Hugging Face", "JavaScript", "Client AI", "Privacy"],
                "key_takeaways": [
                    "Browser apps can perform offline Whisper speech transcription with zero API latency.",
                    "Client-side embedding models enable instant zero-cost semantic search on local documents.",
                    "Supports modern GPU architectures across macOS, Windows, Linux, and Android."
                ]
            },
            # Research Radar Event
            {
                "topic_id": topic_deepseek.id,
                "title": "arXiv Paper Shows Reinforcement Learning Distillation Matches o1 on SWE-bench",
                "slug": "arxiv-paper-rl-distillation-matches-o1-swe-bench",
                "summary": "New peer-reviewed research demonstrates that rule-based GRPO reinforcement learning enables compact 32B models to score 49.2% on SWE-bench Verified.",
                "what_happened": "AI researchers published empirical findings proving that long chain-of-thought distillation transfers reasoning capabilities to open-weight models.",
                "why_it_matters": "Proves that self-hosted open models can perform real-world automated software engineering tasks previously reserved for proprietary cloud LLMs.",
                "technical_explanation": "The study isolates the impact of test-time reasoning tokens, showing a logarithmic relationship between compute budget and coding accuracy.",
                "business_impact": "Enterprises can self-host high-capability code review and generation agents inside private VPC networks.",
                "developer_impact": "Engineers can fine-tune local models on proprietary internal code repositories using verifiable compiler pass/fail rewards.",
                "what_changed": "Replaced subjective human reward models (RLHF) with deterministic compiler and test-suite execution rewards.",
                "category": "Research",
                "published_at": two_days_ago - datetime.timedelta(hours=6),
                "primary_source_name": "arXiv",
                "primary_source_url": "https://arxiv.org/abs/2502.14920",
                "radar_section": "research_radar",
                "is_verified": True,
                "tags": ["arXiv", "DeepSeek", "Reasoning", "SWE-bench", "Open Source"],
                "key_takeaways": [
                    "Verifiable rewards (unit tests, math proofs) produce more robust reasoning than human preference scoring.",
                    "Distilled 32B models achieve 90%+ performance of 670B teacher models for coding tasks.",
                    "Test-time compute scaling is the new frontier for complex problem solving."
                ]
            },
            # What Changed Today Event
            {
                "topic_id": topic_agent_memory.id,
                "title": "Critical Patch Released for Popular Agent Framework Memory Leak",
                "slug": "critical-patch-agent-framework-memory-leak",
                "summary": "A high-severity bug causing uncollected recursive state snapshots in long-running agent threads has been resolved.",
                "what_happened": "Open-source maintainers pushed an emergency release fixing unbounded Redis session growth in multi-day agent execution workers.",
                "why_it_matters": "Prevents production agent worker crashes caused by out-of-memory errors during long task workflows.",
                "technical_explanation": "Introduces automated snapshot compaction and an LRU state pruning algorithm with configurable checkpoint intervals.",
                "business_impact": "Protects production infrastructure uptime for customer-facing agent deployments.",
                "developer_impact": "Upgrade your agent worker dependencies to version 0.2.4 immediately.",
                "what_changed": "Replaced unbounded in-memory history lists with rolling circular buffers.",
                "category": "Security",
                "published_at": now - datetime.timedelta(hours=1),
                "primary_source_name": "GitHub Security",
                "primary_source_url": "https://github.com/advisories/GHSA-agent-mem",
                "radar_section": "changed_today",
                "is_verified": True,
                "tags": ["Security", "Bug Fix", "Infrastructure", "Redis", "Reliability"],
                "key_takeaways": [
                    "All production deployments should apply the memory pruning patch immediately.",
                    "Workers now automatically compress execution trace logs older than 48 hours.",
                    "Introduces Prometheus telemetry metrics for active agent state sizes."
                ]
            }
        ]

        created_events = []
        for ed in events_data:
            ev = Event(**ed)
            session.add(ev)
            created_events.append(ev)
        await session.flush()

        # 5. Multi-Source Raw Items for Source Attribution
        for ev in created_events:
            # Add 3-4 realistic source mentions for each event
            s1 = SourceItem(
                source_id=created_sources["hacker_news"].id,
                source_type="hacker_news",
                external_id=f"hn-{ev.slug[:10]}",
                title=f"Discussion: {ev.title}",
                url=ev.primary_source_url or "https://news.ycombinator.com",
                author="dang_fan",
                summary=ev.summary,
                score=428.0,
                comments_count=184,
                event_id=ev.id,
                published_at=ev.published_at
            )
            s2 = SourceItem(
                source_id=created_sources["github"].id,
                source_type="github",
                external_id=f"gh-{ev.slug[:10]}",
                title=f"Implementation & Specs: {ev.title}",
                url="https://github.com/trending",
                author="core-maintainer",
                summary=ev.technical_explanation,
                score=1420.0,
                comments_count=42,
                event_id=ev.id,
                published_at=ev.published_at - datetime.timedelta(hours=1)
            )
            s3 = SourceItem(
                source_id=created_sources["reddit"].id,
                source_type="reddit",
                external_id=f"rd-{ev.slug[:10]}",
                title=f"Developer Experience Discussion: {ev.title}",
                url="https://reddit.com/r/MachineLearning",
                author="ml_practitioner",
                summary=ev.developer_impact,
                score=312.0,
                comments_count=89,
                event_id=ev.id,
                published_at=ev.published_at - datetime.timedelta(hours=3)
            )
            session.add_all([s1, s2, s3])
        await session.flush()

        # 6. Saved Items for demo user
        saved1 = SavedItem(
            user_id=demo_user.id,
            event_id=created_events[0].id,
            topic_id=topic_agent_memory.id,
            item_type="article",
            custom_notes="Essential reference for designing our agent state machine checkpointers.",
            created_at=now - datetime.timedelta(hours=4)
        )
        saved2 = SavedItem(
            user_id=demo_user.id,
            event_id=created_events[1].id,
            topic_id=topic_mcp.id,
            item_type="article",
            custom_notes="Check out the TypeScript SDK for internal postgres database connector.",
            created_at=yesterday
        )
        session.add_all([saved1, saved2])

        # 7. Intelligent Push Notifications for user
        notif1 = Notification(
            user_id=demo_user.id,
            title="🔥 AI Agent Memory is rising rapidly",
            body="Discussions have surged across Reddit, GitHub, and 4 arXiv preprints. Because you follow AI Agents & LangGraph, this is directly relevant to your workflows.",
            category="Trend",
            urgency="Important",
            topic_slug="ai-agent-memory",
            event_id=created_events[0].id,
            deep_link="/topic/ai-agent-memory",
            is_read=False,
            is_delivered=True,
            delivered_at=now - datetime.timedelta(minutes=45),
            created_at=now - datetime.timedelta(minutes=45)
        )
        notif2 = Notification(
            user_id=demo_user.id,
            title="🚨 Urgent Security Advisory: Agent State Pruning",
            body="A high-priority patch has been published resolving memory exhaustion in autonomous worker threads.",
            category="Security",
            urgency="Critical",
            topic_slug="ai-agent-memory",
            event_id=created_events[6].id,
            deep_link="/article/critical-patch-agent-framework-memory-leak",
            is_read=True,
            is_delivered=True,
            delivered_at=now - datetime.timedelta(hours=2),
            created_at=now - datetime.timedelta(hours=2)
        )
        notif3 = Notification(
            user_id=demo_user.id,
            title="⚡ MCP Ecosystem: 120+ Connectors Released",
            body="Anthropic's Model Context Protocol has reached critical momentum among developer tools you track.",
            category="Trend",
            urgency="Important",
            topic_slug="model-context-protocol",
            event_id=created_events[1].id,
            deep_link="/topic/model-context-protocol",
            is_read=True,
            is_delivered=True,
            delivered_at=yesterday,
            created_at=yesterday
        )
        session.add_all([notif1, notif2, notif3])

        # 8. Agent Run Logs for Observability Admin Portal
        agents_info = [
            ("Collector Agent", 142, 0, 1850, "Success", {"sources_polled": 8, "new_signals": 142}),
            ("Classifier Agent", 142, 18500, 3200, "Success", {"entities_extracted": 490, "categories_assigned": 142}),
            ("Deduplication Agent", 142, 9400, 1450, "Success", {"clusters_formed": 18, "duplicate_suppression_rate": "87.3%"}),
            ("Trend Detection Agent", 18, 4200, 890, "Success", {"emerging_topics_identified": 5, "velocity_spikes": 2}),
            ("Research Agent", 5, 24000, 6800, "Success", {"sources_synthesized": 34, "claims_grounded": 72}),
            ("Fact Verifier Agent", 5, 12500, 2400, "Success", {"verified_items": 5, "uncertainty_flags": 0}),
            ("Personalization Agent", 5, 6300, 1100, "Success", {"user_profiles_matched": 48, "avg_relevance_score": 0.88}),
            ("Explainer Agent", 5, 18900, 4500, "Success", {"explanations_generated": 5, "learning_paths_built": 5}),
            ("Notification Agent", 5, 2100, 420, "Success", {"notifications_approved": 2, "spam_suppressed": 3})
        ]
        for name, items, tokens, latency, status, details in agents_info:
            run = AgentRun(
                agent_name=name,
                status=status,
                items_processed=items,
                tokens_used=tokens,
                latency_ms=latency,
                details=details,
                created_at=now - datetime.timedelta(minutes=15)
            )
            session.add(run)

        # 9. Admin Observability Metrics
        metrics = [
            ("daily_active_users", 342.0, {}),
            ("signals_ingested_24h", 4892.0, {}),
            ("deduplication_rate_percent", 88.4, {}),
            ("avg_llm_latency_ms", 1240.0, {}),
            ("notification_click_rate_percent", 42.6, {}),
            ("total_token_spend_usd", 14.85, {"model": "gemini-flash/gpt-4o-mini"})
        ]
        for m_name, m_val, m_dim in metrics:
            metric = AdminMetric(
                metric_name=m_name,
                metric_value=m_val,
                dimensions=m_dim,
                timestamp=now
            )
            session.add(metric)

        await session.commit()
        print("✅ TechPulse AI database successfully seeded with realistic intelligence dataset!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_database())
