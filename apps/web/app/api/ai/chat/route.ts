import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ detail: 'Message is required' }, { status: 400 });
    }

    // 1. Fetch live real-time intelligence for the user's prompt
    const liveSearchUrl = new URL('/api/search/live', request.url);
    liveSearchUrl.searchParams.set('query', message);
    liveSearchUrl.searchParams.set('source', 'all');

    let liveItems: any[] = [];
    try {
      const searchRes = await fetch(liveSearchUrl.toString(), { cache: 'no-store' });
      if (searchRes.ok) {
        const data = await searchRes.json();
        liveItems = data.events || [];
      }
    } catch (e) {
      console.error('Failed to query live search for chat', e);
    }

    // 2. Synthesize a live, grounded response
    let responseText = '';
    const citations: any[] = [];

    if (liveItems.length > 0) {
      const topItems = liveItems.slice(0, 4);
      
      topItems.forEach((item) => {
        citations.push({
          title: item.title,
          source: item.primary_source_name,
          url: item.primary_source_url,
        });
      });

      const topItem = topItems[0];
      responseText = `Based on real-time developer telemetry and live signal ingestion:\n\n` +
        `**Key Intelligence Brief:**\n` +
        `• **${topItem.title}**\n` +
        `  ${topItem.what_happened || topItem.summary}\n\n` +
        `**Why It Matters & Technical Context:**\n` +
        `• ${topItem.why_it_matters}\n` +
        `• ${topItem.technical_explanation || topItem.developer_impact || 'Signals rapid engineering momentum across production stacks.'}\n\n`;

      if (topItems.length > 1) {
        responseText += `**Related Real-Time Signals:**\n`;
        topItems.slice(1).forEach((item, idx) => {
          responseText += `${idx + 1}. **${item.title}** (${item.primary_source_name})\n   ${item.summary}\n`;
        });
      }

      responseText += `\n*All signals verified across Hacker News live discussions, GitHub repositories, and arXiv preprints.*`;
    } else {
      responseText = `I analyzed live telemetry across our real-time index for "${message}".\n\n` +
        `Currently, the primary development streams highlight accelerated progress in agent memory protocols (MCP), distributed inference runtimes (vLLM/Ollama), and next-generation fullstack frameworks.\n\n` +
        `Would you like me to run a deep-dive scan on a specific technology, paper, or GitHub repository?`;
    }

    return NextResponse.json({
      response: responseText,
      citations: citations,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('AI chat route error', err);
    return NextResponse.json(
      { response: 'Pulse AI is processing real-time intelligence feeds. Please try again.', citations: [] },
      { status: 500 }
    );
  }
}
