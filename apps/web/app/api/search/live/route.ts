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

function detectCategory(title: string, desc: string = ''): string {
  const text = `${title} ${desc}`.toLowerCase();
  
  if (text.includes('security') || text.includes('vulnerability') || text.includes('cve') || text.includes('auth') || text.includes('hack') || text.includes('exploit') || text.includes('privacy') || text.includes('rogue')) {
    return 'Security';
  }
  if (text.includes('cloud') || text.includes('aws') || text.includes('kubernetes') || text.includes('k8s') || text.includes('serverless') || text.includes('docker') || text.includes('postgres') || text.includes('database') || text.includes('sqlite') || text.includes('infra')) {
    return 'Cloud';
  }
  if (text.includes('startup') || text.includes('funding') || text.includes('venture') || text.includes('launch') || text.includes('yc') || text.includes('saas') || text.includes('acquisition') || text.includes('seed')) {
    return 'Startups';
  }
  if (text.includes('paper') || text.includes('arxiv') || text.includes('research') || text.includes('benchmark') || text.includes('study') || text.includes('algorithm') || text.includes('proof')) {
    return 'Research';
  }
  if (text.includes('cli') || text.includes('tool') || text.includes('terminal') || text.includes('editor') || text.includes('cursor') || text.includes('vscode') || text.includes('ide') || text.includes('plugin') || text.includes('extension')) {
    return 'Developer Tools';
  }
  if (text.includes('rust') || text.includes('react') || text.includes('next.js') || text.includes('nextjs') || text.includes('typescript') || text.includes('javascript') || text.includes('python') || text.includes('golang') || text.includes('wasm') || text.includes('compiler') || text.includes('linux') || text.includes('framework')) {
    return 'Development';
  }
  if (text.includes('ai') || text.includes('llm') || text.includes('claude') || text.includes('gpt') || text.includes('model') || text.includes('deepseek') || text.includes('agent') || text.includes('reasoning') || text.includes('ollama') || text.includes('mcp') || text.includes('vllm')) {
    return 'AI';
  }
  return 'Development';
}

const PREDEFINED_TOPICS = [
  { id: 'topic_ai_agents', slug: 'ai-agents-tool-use', title: 'AI Agents & Tool Use', category: 'AI', tagline: 'Autonomous agent architectures, Model Context Protocol (MCP), and multi-agent coordination.', momentum_score: 98, source_count: 48 },
  { id: 'topic_claude_llms', slug: 'claude-frontier-llms', title: 'Claude & Frontier LLMs', category: 'AI', tagline: 'Claude 3.7 Sonnet, DeepSeek R1, hybrid reasoning, and frontier LLM benchmarks.', momentum_score: 99, source_count: 62 },
  { id: 'topic_local_ai', slug: 'local-ai-on-device', title: 'Local AI & On-Device Models', category: 'AI', tagline: 'Ollama, vLLM, quantized GGUF runtimes, and local private inference.', momentum_score: 94, source_count: 36 },
  { id: 'topic_nextjs_react', slug: 'full-stack-nextjs', title: 'Full Stack & Next.js', category: 'Development', tagline: 'React 19, Server Components, App Router streaming, and modern web architectures.', momentum_score: 92, source_count: 41 },
  { id: 'topic_rust_wasm', slug: 'rust-webassembly', title: 'Rust & WebAssembly', category: 'Development', tagline: 'High-performance memory safe systems programming and browser Wasm engines.', momentum_score: 95, source_count: 39 },
  { id: 'topic_dev_tools', slug: 'developer-tools-cli', title: 'Developer Tools & CLI', category: 'Developer Tools', tagline: 'Modern developer CLI tooling, LSP, AI debuggers, and coding assistants.', momentum_score: 96, source_count: 53 },
  { id: 'topic_security', slug: 'cybersecurity-vulnerability', title: 'Cybersecurity & Zero-Day Radar', category: 'Security', tagline: 'CVE vulnerability alerts, prompt injection defenses, and software supply chain security.', momentum_score: 91, source_count: 29 },
  { id: 'topic_cloud_infra', slug: 'cloud-databases-infra', title: 'Cloud & Distributed Databases', category: 'Cloud', tagline: 'Postgres vector extensions, Kubernetes runtimes, and serverless compute.', momentum_score: 90, source_count: 34 },
  { id: 'topic_arxiv_papers', slug: 'arxiv-ai-research', title: 'arXiv AI & CS Preprints', category: 'Research', tagline: 'Peer research preprints, mathematical architectures, and empirical benchmarks.', momentum_score: 93, source_count: 45 },
  { id: 'topic_startups_yc', slug: 'startups-yc-launches', title: 'YC & Early Stage Startups', category: 'Startups', tagline: 'Y Combinator batch launches, seed rounds, and high-velocity developer tools.', momentum_score: 89, source_count: 27 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || 'All';
  const source = searchParams.get('source') || 'all';

  const results: LiveItem[] = [];
  const fetchPromises: Promise<any>[] = [];

  // Construct search query
  let searchQuery = query;
  if (!searchQuery && category && category !== 'All') {
    searchQuery = category;
  }

  // 1. Hacker News Algolia Live Search API
  if (source === 'all' || source === 'hn') {
    const hnUrl = searchQuery
      ? `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(searchQuery)}&tags=story&hitsPerPage=20`
      : `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=20`;

    fetchPromises.push(
      fetch(hnUrl, { next: { revalidate: 30 } })
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
              const cat = detectCategory(title, hit.story_text || '');

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
    const ghQuery = searchQuery ? encodeURIComponent(searchQuery) : 'stars:>2000+pushed:>2024-01-01';
    const ghUrl = `https://api.github.com/search/repositories?q=${ghQuery}&sort=updated&order=desc&per_page=15`;

    fetchPromises.push(
      fetch(ghUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TechPulse-AI-Intelligence-Engine/1.0',
        },
        next: { revalidate: 60 },
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
              const cat = detectCategory(name, `${desc} ${language}`);

              results.push({
                id: `gh_${repo.id}`,
                title: `${name}: ${desc.slice(0, 80)}${desc.length > 80 ? '...' : ''}`,
                slug: `gh-${repo.id}-${repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                summary: `${desc} Built in ${language} with ${stars.toLocaleString()} GitHub stars and ${forks.toLocaleString()} forks.`,
                what_happened: `${name} has seen active commits and community star velocity, pushing fresh code updates.`,
                why_it_matters: `High repository velocity in ${language} indicates strong open-source momentum and developer adoption.`,
                technical_explanation: `Open-source codebase featuring ${language} implementation, active issue resolution, and modern software architecture.`,
                business_impact: `Can reduce engineering development cycles and serve as foundation for scalable infrastructure.`,
                developer_impact: `Provides reusable open-source primitives and active APIs for developer workflows.`,
                what_changed: `Recent commit activity pushed on ${new Date(published).toLocaleDateString()}.`,
                category: cat,
                published_at: published,
                primary_source_name: `GitHub Live (${stars.toLocaleString()} ★)`,
                primary_source_url: url,
                is_verified: true,
                radar_section: 'dev_radar',
                tags: ['GitHub Live', language, `${stars} Stars`, 'Open Source', cat],
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
    const arxivQ = searchQuery ? encodeURIComponent(searchQuery) : 'all:AI+OR+all:LLM+OR+all:agents';
    const arxivUrl = `https://export.arxiv.org/api/query?search_query=${arxivQ}&sortBy=submittedDate&sortOrder=descending&max_results=10`;

    fetchPromises.push(
      fetch(arxivUrl, { next: { revalidate: 120 } })
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
    const catLower = category.toLowerCase();
    const matched = results.filter(
      (r) => r.category.toLowerCase() === catLower || r.tags.some((t) => t.toLowerCase().includes(catLower))
    );
    // If specific category has matches, use them; otherwise keep all results to never show empty
    if (matched.length > 0) {
      filtered = matched;
    }
  }

  // Filter by search query if present
  if (query) {
    const qLower = query.toLowerCase();
    const queryMatched = filtered.filter(
      (r) => r.title.toLowerCase().includes(qLower) || 
             r.summary.toLowerCase().includes(qLower) || 
             r.tags.some((t) => t.toLowerCase().includes(qLower)) ||
             r.category.toLowerCase().includes(qLower)
    );
    if (queryMatched.length > 0) {
      filtered = queryMatched;
    }
  }

  // Sort by momentum score / date
  filtered.sort((a, b) => b.momentum_score - a.momentum_score);

  // Match predefined topic vectors against query and category
  let matchedTopics = PREDEFINED_TOPICS;
  if (category && category !== 'All') {
    matchedTopics = matchedTopics.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }
  if (query) {
    const qLower = query.toLowerCase();
    const topicFiltered = PREDEFINED_TOPICS.filter((t) => 
      t.title.toLowerCase().includes(qLower) || 
      t.tagline.toLowerCase().includes(qLower) || 
      t.category.toLowerCase().includes(qLower)
    );
    if (topicFiltered.length > 0) {
      matchedTopics = topicFiltered;
    }
  }

  return NextResponse.json({
    success: true,
    query,
    category,
    source,
    count: filtered.length,
    timestamp: new Date().toISOString(),
    topics: matchedTopics,
    events: filtered,
  });
}
