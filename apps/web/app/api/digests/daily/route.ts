import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const liveSearchUrl = new URL('/api/search/live', request.url);
    const searchRes = await fetch(liveSearchUrl.toString(), { cache: 'no-store' });
    let liveEvents: any[] = [];

    if (searchRes.ok) {
      const data = await searchRes.json();
      liveEvents = data.events || [];
    }

    return NextResponse.json({
      title: 'Daily Intelligence Briefing',
      date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      executive_summary: 'Today’s technology radar is dominated by breakthroughs in hybrid reasoning models, high-performance systems runtimes in Rust, and active developer discussions around agent memory protocols.',
      top_takeaways: [
        'Frontier AI models are introducing deterministic thinking tokens for agentic planning.',
        'High developer momentum on GitHub across open-source inference toolchains.',
        'New research preprints on arXiv exploring long-horizon agent execution and tool verification.'
      ],
      signals: liveEvents.slice(0, 6),
      reading_time: '4 min read',
    });
  } catch (err: any) {
    return NextResponse.json({
      title: 'Daily Intelligence Briefing',
      date: new Date().toLocaleDateString(),
      executive_summary: 'Ecosystem intelligence overview.',
      top_takeaways: [],
      signals: [],
      reading_time: '2 min read',
    });
  }
}
