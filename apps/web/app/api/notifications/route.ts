import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Generate real-time live notifications from latest live telemetry
    const liveSearchUrl = new URL('/api/search/live', request.url);
    liveSearchUrl.searchParams.set('source', 'all');

    const searchRes = await fetch(liveSearchUrl.toString(), { cache: 'no-store' });
    let liveEvents: any[] = [];

    if (searchRes.ok) {
      const data = await searchRes.json();
      liveEvents = data.events || [];
    }

    const notifications = (liveEvents.slice(0, 8)).map((ev, index) => ({
      id: `notif_${ev.id || index}`,
      title: ev.title,
      body: ev.summary || ev.what_happened,
      category: ev.category || 'AI',
      urgency: index < 2 ? 'high' : 'normal',
      topic_slug: ev.slug,
      event_id: ev.id,
      deep_link: `/discover?query=${encodeURIComponent(ev.title.split(' ')[0])}`,
      is_read: false,
      created_at: ev.published_at || new Date().toISOString(),
    }));

    return NextResponse.json(notifications);
  } catch (err: any) {
    console.error('Notifications route error', err);
    return NextResponse.json([]);
  }
}
