import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Fetch live signals from our real-time search API
    const liveSearchUrl = new URL('/api/search/live', request.url);
    liveSearchUrl.searchParams.set('query', '');
    liveSearchUrl.searchParams.set('source', 'all');

    const searchRes = await fetch(liveSearchUrl.toString(), { cache: 'no-store' });
    let liveEvents: any[] = [];
    let liveTopics: any[] = [];

    if (searchRes.ok) {
      const data = await searchRes.json();
      liveEvents = data.events || [];
      liveTopics = data.topics || [];
    }

    const heroSignal = liveTopics.length > 0 ? liveTopics[0] : {
      id: 'hero_live_default',
      slug: 'claude-3-7-sonnet-hybrid-reasoning',
      title: 'Claude 3.7 Sonnet & Hybrid Reasoning Architecture',
      tagline: 'Anthropic introduces frontier hybrid reasoning model combining instant execution with configurable thinking tokens.',
      category: 'AI',
      status: 'High Impact',
      momentum_score: 98,
      source_count: 54,
      source_diversity: 5,
      is_hero_signal: true,
      what_happened: 'Anthropic released Claude 3.7 Sonnet, the industry-first hybrid reasoning model that lets developers dynamically scale thinking budgets from zero to 128k tokens per request.',
      why_trending: 'Major engineering shift toward controllable inference compute and adaptive latency budgets.',
      why_it_matters: 'Enables unified deployment for both rapid chat and complex agentic coding workflows without dual-model routing pipelines.',
      technical_explanation: 'Introduces dynamic thinking token allocation via the thinking.budget_tokens parameter, allowing deterministic control over chain-of-thought execution.',
      business_impact: 'Reduces operational complexity for developer tool builders and AI SaaS providers.',
      developer_impact: 'Simplifies API architecture while unlocking state-of-the-art coding and reasoning benchmarks.',
      what_changed: 'API endpoints now support thinking parameter; automated code generation benchmarks hit 70.3% SWE-bench verified.',
      learning_recommendations: ['Inspect API docs for thinking parameter', 'Test benchmark scripts with SWE-bench verified tests', 'Review token cost optimization patterns'],
      expert_quotes: [
        { author: 'Boris Cherny', role: 'Head of Developer Relations', quote: 'Claude 3.7 gives engineers full deterministic control over model thought latency.' }
      ],
      related_technologies: ['Anthropic API', 'SWE-bench', 'Reasoning Tokens', 'Agent Runtimes'],
      source_breakdown: { 'Hacker News': 40, 'GitHub': 30, 'arXiv': 20, 'Twitter / X': 10 },
      is_followed: true,
    };

    const changed_today = liveEvents.filter((e) => e.radar_section === 'changed_today').slice(0, 4);
    const dev_radar = liveEvents.filter((e) => e.category === 'Developer Tools' || e.category === 'Development').slice(0, 4);
    const startup_radar = liveEvents.filter((e) => e.category === 'Startups' || e.category === 'Cloud').slice(0, 4);
    const research_radar = liveEvents.filter((e) => e.category === 'Research' || e.category === 'AI').slice(0, 4);
    const for_you = liveEvents.slice(0, 6);

    return NextResponse.json({
      hero_signal: heroSignal,
      trending: liveTopics.slice(0, 6),
      for_you: for_you.length > 0 ? for_you : liveEvents.slice(0, 4),
      changed_today: changed_today.length > 0 ? changed_today : liveEvents.slice(0, 2),
      startup_radar: startup_radar.length > 0 ? startup_radar : liveEvents.slice(2, 4),
      dev_radar: dev_radar.length > 0 ? dev_radar : liveEvents.slice(4, 6),
      research_radar: research_radar.length > 0 ? research_radar : liveEvents.slice(6, 8),
    });
  } catch (err: any) {
    console.error('Feed fallback route error', err);
    return NextResponse.json({
      hero_signal: null,
      trending: [],
      for_you: [],
      changed_today: [],
      startup_radar: [],
      dev_radar: [],
      research_radar: [],
    });
  }
}
