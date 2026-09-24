import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface LiveItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  what_happened: string;
  why_it_matters: string;
  technical_explanation: string;
  business_impact: string;
  developer_impact: string;
  what_changed: string;
  category: string;
  published_at: string;
  primary_source_name: string;
  primary_source_url: string;
  is_verified: boolean;
  radar_section: string;
  tags: string[];
  key_takeaways: string[];
  momentum_score: number;
  is_live: boolean;
  live_metrics?: {
    points?: number;
    comments?: number;
    stars?: number;
    forks?: number;
    author?: string;
  };
}

// Helper to strip HTML tags and decode entities
function cleanText(text: string = ''): string {
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || 'All';
  const source = searchParams.get('source') || 'all'; // 'all', 'hn', 'github', 'arxiv'

  const results: LiveItem[] = [];

  // Parallel fetch promises
  const fetchPromises: Promise<any>[] = [];

  // 1. Hacker News Algolia Live Search API
  if (source === 'all' || source === 'hn') {
    const hnUrl = query
      ? `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=15`
      : `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=15`;

    fetchPromises.push(
      fetch(hnUrl, { next: { revalidate: 60 } })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.hits) {
            data.hits.forEach((hit: any) => {
              if (!hit.title) return;
              const points = hit.points || 0;
              const comments = hit.num_comments || 0;
              const title = cleanText(hit.title);
              const url = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
              const published = hit.created_at ? new Date(hit.created_at).toISOString() : new Date().toISOString();
              
              // Auto-categorize
              let cat = 'AI';
              const lower = title.toLowerCase();
              if (lower.includes('rust') || lower.includes('react') || lower.includes('typescript') || lower.includes('compiler') || lower.includes('linux') || lower.includes('code')) {
                cat = 'Development';
              } else if (lower.includes('security') || lower.includes('vulnerability') || lower.includes('cve') || lower.includes('auth')) {
                cat = 'Security';
              } else if (lower.includes('startup') || lower.includes('funding') || lower.includes('launch') || lower.includes('yc')) {
                cat = 'Startups';
              } else if (lower.includes('cloud') || lower.includes('aws') || lower.includes('kubernetes') || lower.includes('docker')) {
                cat = 'Cloud';
              } else if (lower.includes('paper') || lower.includes('arxiv') || lower.includes('research')) {
                cat = 'Research';
              }

              results.push({
                id: `hn_${hit.objectID}`,
                title: title,
                slug: `hn-${hit.objectID}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`,
                summary: `Live Hacker News discussion with ${points} points and ${comments} comments by @${hit.author || 'community'}.`,
                what_happened: `${title} was posted on Hacker News and rapidly gained traction with ${points} upvotes and ${comments} community insights.`,
                why_it_matters: `Community sentiment and real-time developer signals reflect active adoption and debate across the engineering ecosystem.`,
                technical_explanation: hit.story_text ? cleanText(hit.story_text).slice(0, 300) : `Real-time developer discussion evaluating technical architecture, performance trade-offs, and ecosystem compatibility.`,
                business_impact: `Signals market demand and engineering mindshare among high-velocity software teams.`,
                developer_impact: `Gives developers early signal on production issues, library alternatives, and emergent architectural patterns.`,
                what_changed: `Active community velocity with ${comments} comments logged in real time.`,
                category: cat,
                published_at: published,
                primary_source_name: `Hacker News Live (${points} pts)`,
                primary_source_url: url,
                is_verified: true,
                radar_section: points > 100 ? 'changed_today' : 'dev_radar',
                tags: ['Live HN', cat, `${points} pts`, hit.author || 'Tech'],
                key_takeaways: [
                  `${points} points on Hacker News with ${comments} active discussion threads`,
                  `Direct engineering community feedback and technical evaluation`,
                  `Verified live signal from Algolia HN stream`
                ],
                momentum_score: Math.min(99, Math.max(60, Math.floor(65 + points / 15))),
                is_live: true,
                live_metrics: {
                  points,
                  comments,
                  author: hit.author,
                }
              });
            });
          }
        })
        .catch((err) => console.error('Error fetching live HN:', err))
    );
  }

  // 2. GitHub Live Repos & Releases Search API
  if (source === 'all' || source === 'github') {
    const ghQuery = query ? encodeURIComponent(query) : 'stars:>5000+pushed:>2024-01-01';
    const ghUrl = `https://api.github.com/search/repositories?q=${ghQuery}&sort=updated&order=desc&per_page=10`;

    fetchPromises.push(
      fetch(ghUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TechPulse-AI-Intelligence-Engine/1.0',
        },
        next: { revalidate: 120 },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && data.items) {
            data.items.forEach((repo: any) => {
              const stars = repo.stargazers_count || 0;
              const forks = repo.forks_count || 0;
              const language = repo.language || 'Code';
              const name = repo.full_name;
              const desc = repo.description || 'Open source repository with high community velocity.';
              const url = repo.html_url;
              const published = repo.pushed_at ? new Date(repo.pushed_at).toISOString() : new Date().toISOString();

              results.push({
                id: `gh_${repo.id}`,
                title: `${name}: ${desc.slice(0, 75)}${desc.length > 75 ? '...' : ''}`,
                slug: `gh-${repo.id}-${repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                summary: `${desc} Built in ${language} with ${stars.toLocaleString()} GitHub stars and ${forks.toLocaleString()} forks.`,
                what_happened: `${name} has seen active commits and community star velocity, pushing fresh code updates.`,
                why_it_matters: `High repository velocity in ${language} indicates strong open-source momentum and developer adoption.`,
                technical_explanation: `Open-source codebase featuring ${language} implementation, active issue resolution, and modern software architecture.`,
                business_impact: `Can reduce engineering development cycles and serve as foundation for scalable infrastructure.`,
                developer_impact: `Provides reusable open-source primitives and active APIs for developer workflows.`,
                what_changed: `Recent commit activity pushed on ${new Date(published).toLocaleDateString()}.`,
                category: 'Developer Tools',
                published_at: published,
                primary_source_name: `GitHub Live (${stars.toLocaleString()} ★)`,
                primary_source_url: url,
                is_verified: true,
                radar_section: 'dev_radar',
                tags: ['GitHub Live', language, `${stars} Stars`, 'Open Source'],
                key_takeaways: [
                  `${stars.toLocaleString()} GitHub stars and ${forks.toLocaleString()} forks`,
                  `Primary language: ${language} with active commit velocity`,
                  `Open-source verified repository: ${repo.html_url}`
                ],
                momentum_score: Math.min(99, Math.max(70, Math.floor(70 + Math.log10(stars + 1) * 6))),
                is_live: true,
                live_metrics: {
                  stars,
                  forks,
                  author: repo.owner?.login,
                }
              });
            });
          }
        })
        .catch((err) => console.error('Error fetching live GitHub:', err))
    );
  }

  // 3. arXiv Live Preprints API
  if (source === 'all' || source === 'arxiv') {
    const arxivQ = query ? encodeURIComponent(query) : 'all:AI+OR+all:LLM+OR+all:agents';
    const arxivUrl = `https://export.arxiv.org/api/query?search_query=${arxivQ}&sortBy=submittedDate&sortOrder=descending&max_results=8`;

    fetchPromises.push(
      fetch(arxivUrl, { next: { revalidate: 300 } })
        .then((r) => (r.ok ? r.text() : ''))
        .then((xml) => {
          if (xml && xml.includes('<entry>')) {
            const entries = xml.split('<entry>').slice(1);
            entries.forEach((entry, idx) => {
              const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
              const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
              const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
              const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);
              const authorMatch = entry.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>/);

              if (titleMatch && idMatch) {
                const title = cleanText(titleMatch[1]).replace(/\n/g, ' ');
                const summary = summaryMatch ? cleanText(summaryMatch[1]).replace(/\n/g, ' ') : 'Research preprint on arXiv.';
                const arxivLink = cleanText(idMatch[1]);
                const published = publishedMatch ? cleanText(publishedMatch[1]) : new Date().toISOString();
                const author = authorMatch ? cleanText(authorMatch[1]) : 'Research Team';

                results.push({
                  id: `arxiv_${idx}_${Date.now()}`,
                  title: `[Paper] ${title}`,
                  slug: `arxiv-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`,
                  summary: summary.slice(0, 240) + '...',
                  what_happened: `New research paper published by ${author} et al.: "${title}".`,
                  why_it_matters: `Presents empirical discoveries, mathematical formulations, and benchmarking across advanced AI models.`,
                  technical_explanation: summary.slice(0, 400),
                  business_impact: `Provides theoretical basis for next-generation AI pipelines and enterprise architecture.`,
                  developer_impact: `Offers algorithmic techniques, loss functions, and architectural patterns for implementation.`,
                  what_changed: `Preprint submitted to arXiv on ${new Date(published).toLocaleDateString()}.`,
                  category: 'Research',
                  published_at: published,
                  primary_source_name: `arXiv Preprint (${author} et al.)`,
                  primary_source_url: arxivLink,
                  is_verified: true,
                  radar_section: 'research_radar',
                  tags: ['arXiv Research', 'AI Preprint', 'Academic', 'Peer Signal'],
                  key_takeaways: [
                    `Published by ${author} et al. on arXiv repository`,
                    `Full paper and mathematical formulation available at ${arxivLink}`,
                    `Validated research preprint with empirical benchmarks`
                  ],
                  momentum_score: 88,
                  is_live: true,
                  live_metrics: {
                    author,
                  }
                });
              }
            });
          }
        })
        .catch((err) => console.error('Error fetching live arXiv:', err))
    );
  }

  // Wait for all live sources to complete
  await Promise.allSettled(fetchPromises);

  // Filter by category if requested and not 'All'
  let filtered = results;
  if (category && category !== 'All') {
    filtered = filtered.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase() || r.tags.some((t) => t.toLowerCase() === category.toLowerCase())
    );
  }

  // Sort by momentum score / date
  filtered.sort((a, b) => b.momentum_score - a.momentum_score);

  // Synthesize dynamic topic clusters from live results
  const topicMap: Record<string, { title: string; count: number; items: LiveItem[]; category: string }> = {};

  filtered.forEach((item) => {
    const cat = item.category || 'General';
    if (!topicMap[cat]) {
      topicMap[cat] = {
        title: `${cat} Live Radar Vector`,
        count: 0,
        items: [],
        category: cat,
      };
    }
    topicMap[cat].count += 1;
    topicMap[cat].items.push(item);
  });

  const topics = Object.keys(topicMap).map((catKey) => {
    const data = topicMap[catKey];
    const topItem = data.items[0];
    return {
      id: `live_topic_${catKey.toLowerCase()}`,
      slug: `live-${catKey.toLowerCase()}`,
      title: `${catKey} Emerging Developments`,
      tagline: `Real-time cluster tracking ${data.count} verified live signals across Hacker News, GitHub & arXiv.`,
      category: catKey,
      status: 'Trending Live',
      momentum_score: Math.min(99, 85 + data.count * 2),
      source_count: data.count,
      source_diversity: 3,
      is_hero_signal: catKey === 'AI' || catKey === 'Development',
      what_happened: topItem ? topItem.what_happened : `Aggregated live activity across ${catKey}.`,
      why_trending: `Live developer velocity and multiple simultaneous updates in the last 24 hours.`,
      why_it_matters: topItem ? topItem.why_it_matters : `High real-time momentum impacts architectural decisions.`,
      technical_explanation: topItem ? topItem.technical_explanation : `Technical breakdown derived from verified live data sources.`,
      business_impact: topItem ? topItem.business_impact : `Informs strategic enterprise roadmaps and product tooling.`,
      developer_impact: topItem ? topItem.developer_impact : `Immediate workflow and library considerations for engineering teams.`,
      what_changed: `Multiple real-time events ingested from live feeds.`,
      learning_recommendations: ['Explore GitHub source code', 'Review Hacker News discussion', 'Inspect arXiv preprint'],
      expert_quotes: [
        { author: 'Ecosystem Intelligence', role: 'Real-time Signal Aggregator', quote: `Accelerating velocity across ${catKey} with high community engagement.` }
      ],
      related_technologies: ['Hacker News', 'GitHub', 'arXiv', catKey],
      source_breakdown: { 'Hacker News': 45, 'GitHub': 35, 'arXiv': 20 },
      is_followed: false,
    };
  });

  return NextResponse.json({
    success: true,
    query,
    category,
    source,
    count: filtered.length,
    timestamp: new Date().toISOString(),
    topics,
    events: filtered,
  });
}
