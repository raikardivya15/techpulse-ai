'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, Filter, Sparkles, Layers, ArrowUpRight, 
  Radio, Globe, Github, BookOpen, Clock, Activity, 
  RefreshCw, ShieldCheck, Flame, Sliders, Check, Plus
} from 'lucide-react';
import { feedApi } from '@/lib/api';
import { useTopics } from '@/lib/topics-context';
import { TopicCard } from '@/components/TopicCard';
import { EventCard } from '@/components/EventCard';
import { RealtimeDetailModal, EventDetailData } from '@/components/RealtimeDetailModal';
import { TopicSelectorModal } from '@/components/TopicSelectorModal';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('query') || '';

  const { selectedTopics, toggleTopic } = useTopics();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeSource, setActiveSource] = useState<'all' | 'hn' | 'github' | 'arxiv'>('all');
  const [isLiveMode, setIsLiveMode] = useState(true);
  
  const [results, setResults] = useState<{ topics: any[]; events: any[] }>({ topics: [], events: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  
  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<EventDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  const categories = [
    'All', 'AI', 'Development', 'Startups', 'Research', 'Security', 'Developer Tools', 'Cloud'
  ];

  const quickPrompts = [
    'Claude 3.7 Sonnet',
    'DeepSeek R1 Reasoning',
    'Model Context Protocol MCP',
    'Next.js 15 App Router',
    'Ollama Local LLM',
    'Rust WebAssembly',
    'Agentic AI Workflows',
  ];

  const handleSearch = async (cat = activeCategory, q = searchQuery, src = activeSource, live = isLiveMode) => {
    setIsLoading(true);
    try {
      if (live) {
        const liveRes = await feedApi.searchLive(q, cat, src);
        if (liveRes && liveRes.success) {
          setResults({
            topics: liveRes.topics || [],
            events: liveRes.events || [],
          });
          setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } else {
          const dbData = await feedApi.getDiscover(cat, q);
          setResults({ topics: dbData.topics || [], events: dbData.events || [] });
        }
      } else {
        const dbData = await feedApi.getDiscover(cat, q);
        setResults({ topics: dbData.topics || [], events: dbData.events || [] });
      }
    } catch (err) {
      console.error('Discover query failed, attempting live fallback', err);
      try {
        const liveRes = await feedApi.searchLive(q, cat, src);
        setResults({ topics: liveRes.topics || [], events: liveRes.events || [] });
      } catch (e) {
        console.error('Total search failure', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(activeCategory, searchQuery, activeSource, isLiveMode);
  }, [activeCategory, activeSource, isLiveMode]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(activeCategory, searchQuery, activeSource, isLiveMode);
  };

  const handleOpenDetail = (item: any) => {
    setSelectedEvent(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="page-title text-text-primaryLight dark:text-text-primaryDark">
              Live Ecosystem Intelligence & Search
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[10px] font-bold tracking-wider uppercase border border-red-200 dark:border-red-900/40">
              <Radio className="w-2.5 h-2.5 animate-pulse text-red-600 dark:text-red-400" />
              Real-Time Feed
            </span>
          </div>
          <p className="body-text text-xs sm:text-sm text-text-secondaryLight dark:text-text-secondaryDark">
            Live search across Hacker News discussions, GitHub repository velocity, arXiv preprints, and developer feeds.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {lastRefreshed && (
            <span className="text-[11px] text-text-mutedLight dark:text-text-mutedDark tech-mono hidden md:inline">
              Updated {lastRefreshed}
            </span>
          )}
          
          <button
            onClick={() => setIsTopicModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark border border-accent/30 dark:border-accent-dark/30 text-xs font-semibold shadow-xs hover:bg-accent-softLight/80 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Select Topics ({selectedTopics.length})</span>
          </button>

          <button
            onClick={() => handleSearch(activeCategory, searchQuery, activeSource, isLiveMode)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40 text-xs font-medium text-text-primaryLight dark:text-text-primaryDark shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-accent dark:text-accent-dark ${isLoading ? 'animate-spin' : ''}`} />
            <span>Fetch Live</span>
          </button>
        </div>
      </div>

      {/* Selected Topics Multi-Select Pill Bar */}
      <div className="p-3 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark flex items-center gap-1.5">
            <span>🎯 Monitored Topics ({selectedTopics.length})</span>
          </span>
          <button
            onClick={() => setIsTopicModalOpen(true)}
            className="text-[11px] text-accent-textLight dark:text-accent-textDark font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add / Edit Topics</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {selectedTopics.map((topicName) => (
            <button
              key={topicName}
              onClick={() => {
                setSearchQuery(topicName);
                handleSearch(activeCategory, topicName, activeSource, isLiveMode);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark text-[11px] font-medium border border-accent/25 dark:border-accent-dark/25 hover:bg-accent-softLight/90 transition-colors"
            >
              <Check className="w-3 h-3 stroke-[3]" />
              <span>{topicName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={onSearchSubmit} className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-mutedLight dark:text-text-mutedDark" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search real-time technology, papers, repos, algorithms, architectures..."
          className="w-full pl-10 pr-28 py-3 text-xs sm:text-sm rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primaryLight dark:text-text-primaryDark placeholder-text-mutedLight dark:placeholder-text-mutedDark focus:outline-none focus:border-accent dark:focus:border-accent-dark shadow-xs transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-[7px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-xs font-semibold shadow-xs transition-all"
        >
          Live Search
        </button>
      </form>

      {/* Quick Search Suggestions */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <span className="text-text-mutedLight dark:text-text-mutedDark shrink-0 font-medium">Try searching:</span>
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => {
              setSearchQuery(q);
              handleSearch(activeCategory, q, activeSource, isLiveMode);
            }}
            className="px-2.5 py-1 rounded-[6px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-secondaryLight dark:text-text-secondaryDark hover:border-accent/40 dark:hover:border-accent-dark/40 hover:text-text-primaryLight dark:hover:text-text-primaryDark shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Source Selection & Category Filters */}
      <div className="space-y-2.5 pt-1">
        {/* Source Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-text-mutedLight dark:text-text-mutedDark shrink-0 tech-mono">
            SOURCE:
          </span>
          {[
            { id: 'all', label: 'All Live Feeds', icon: Globe },
            { id: 'hn', label: 'Hacker News Live', icon: Radio },
            { id: 'github', label: 'GitHub Repos', icon: Github },
            { id: 'arxiv', label: 'arXiv Preprints', icon: BookOpen },
          ].map((s) => {
            const Icon = s.icon;
            const isSelected = activeSource === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSource(s.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-xs font-medium shrink-0 transition-all ${
                  isSelected
                    ? 'bg-accent-softLight text-accent-textLight dark:bg-accent-softDark dark:text-accent-textDark font-semibold border border-accent/30 dark:border-accent-dark/30 shadow-xs'
                    : 'bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-secondaryLight dark:text-text-secondaryDark hover:bg-card-hoverLight dark:hover:bg-card-hoverDark hover:text-text-primaryLight dark:hover:text-text-primaryDark'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-[6px] text-xs font-medium shrink-0 transition-colors ${
                activeCategory === cat
                  ? 'bg-accent-softLight text-accent-textLight dark:bg-accent-softDark dark:text-accent-textDark font-semibold border border-accent/20 dark:border-accent-dark/20'
                  : 'bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-card-hoverLight dark:hover:bg-card-hoverDark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-text-mutedLight dark:text-text-mutedDark space-y-3 tech-mono">
          <div className="w-7 h-7 rounded-full border-2 border-accent dark:border-accent-dark border-t-transparent animate-spin mx-auto" />
          <p className="font-semibold text-text-primaryLight dark:text-text-primaryDark">Scanning live global developer channels...</p>
          <p className="text-[11px] text-text-mutedLight dark:text-text-mutedDark">Querying Algolia HN stream, GitHub Search API, and arXiv preprints in real time.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Live Clusters Overview */}
          {results.topics.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="section-heading text-text-primaryLight dark:text-text-primaryDark flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent dark:text-accent-dark" />
                  Live Real-Time Clusters ({results.topics.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.topics.map((t) => (
                  <TopicCard key={t.id} topic={t} />
                ))}
              </div>
            </section>
          )}

          {/* Real-time Signals Feed */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="section-heading text-text-primaryLight dark:text-text-primaryDark flex items-center gap-2">
                <Flame className="w-4 h-4 text-accent dark:text-accent-dark" />
                Live Real-Time Signals ({results.events.length})
              </h3>
              <span className="text-[11px] text-text-mutedLight dark:text-text-mutedDark tech-mono">
                Click any signal for full real-time breakdown
              </span>
            </div>

            {results.events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {results.events.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => handleOpenDetail(ev)}
                    className="p-4 sm:p-5 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-accent/50 dark:hover:border-accent-dark/50 transition-all shadow-xs cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark border border-accent/20 dark:border-accent-dark/20">
                            {ev.category || 'TECH'}
                          </span>
                          <span className="text-[11px] text-text-mutedLight dark:text-text-mutedDark tech-mono">
                            • {ev.primary_source_name}
                          </span>
                        </div>
                        {ev.momentum_score && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tech-mono">
                            {ev.momentum_score}/100 Momentum
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="card-title text-text-primaryLight dark:text-text-primaryDark group-hover:text-accent-textLight dark:group-hover:text-accent-textDark transition-colors mb-2 line-clamp-2">
                        {ev.title}
                      </h4>

                      {/* Summary */}
                      <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark mb-3 line-clamp-2 leading-relaxed">
                        {ev.summary || ev.what_happened}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2.5 border-t border-divider-light dark:border-divider-dark flex items-center justify-between text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(ev);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent-textLight dark:text-accent-textDark hover:underline"
                      >
                        <span>View Real-Time Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {ev.primary_source_url && (
                        <a
                          href={ev.primary_source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[11px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors tech-mono"
                        >
                          <span>Live Source</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-xs text-text-secondaryLight dark:text-text-secondaryDark space-y-2">
                <p className="font-semibold text-sm text-text-primaryLight dark:text-text-primaryDark">No live signals found for this search</p>
                <p>Try searching for broader keywords like &quot;AI&quot;, &quot;Claude&quot;, &quot;React&quot;, &quot;Rust&quot;, or &quot;DeepSeek&quot;.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                    setActiveSource('all');
                    handleSearch('All', '', 'all', true);
                  }}
                  className="mt-3 px-3.5 py-1.5 rounded-[6px] bg-accent text-white dark:text-[#0D0E0D] text-xs font-semibold"
                >
                  Reset to Live Radar
                </button>
              </div>
            )}
          </section>

        </div>
      )}

      {/* Interactive Rich Detail Modal */}
      <RealtimeDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Dedicated Topic Selector Modal */}
      <TopicSelectorModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
      />

    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-mutedLight dark:text-text-mutedDark">Loading Live Intelligence...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
