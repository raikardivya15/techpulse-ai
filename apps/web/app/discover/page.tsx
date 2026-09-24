'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { feedApi } from '@/lib/api';
import { TopicCard } from '@/components/TopicCard';
import { EventCard } from '@/components/EventCard';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('query') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ topics: any[]; events: any[] }>({ topics: [], events: [] });
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'All', 'AI', 'Development', 'Startups', 'Research', 'Security', 'Developer Tools', 'Cloud'
  ];

  const handleSearch = async (cat = activeCategory, q = searchQuery) => {
    setIsLoading(true);
    try {
      const data = await feedApi.getDiscover(cat, q);
      setResults({
        topics: data.topics || [],
        events: data.events || []
      });
    } catch (err) {
      console.error('Discover query failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(activeCategory, searchQuery);
  }, [activeCategory]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(activeCategory, searchQuery);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="page-title text-text-primaryLight dark:text-text-primaryDark">
          Ecosystem Discovery & Search
        </h1>
        <p className="body-text text-xs sm:text-sm text-text-secondaryLight dark:text-text-secondaryDark mt-0.5">
          Explore emerging technology vectors, cross-source clusters, and research preprints.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={onSearchSubmit} className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-mutedLight dark:text-text-mutedDark" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search technology, topics, companies, arXiv papers..."
          className="w-full pl-10 pr-24 py-2.5 text-xs rounded-[8px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primaryLight dark:text-text-primaryDark placeholder-text-mutedLight dark:placeholder-text-mutedDark focus:outline-none focus:border-accent dark:focus:border-accent-dark shadow-xs transition-colors"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-[6px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all"
        >
          Search
        </button>
      </form>

      {/* Category Filter Tabs */}
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

      {/* Results Sections */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-text-mutedLight dark:text-text-mutedDark space-y-2 tech-mono">
          <div className="w-6 h-6 rounded-full border-2 border-accent dark:border-accent-dark border-t-transparent animate-spin mx-auto" />
          <p>Scanning intelligence database & verified signals...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Emerging Topics Matches */}
          {results.topics.length > 0 && (
            <section className="space-y-3">
              <h3 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                Topic Clusters ({results.topics.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.topics.map((t) => (
                  <TopicCard key={t.id} topic={t} />
                ))}
              </div>
            </section>
          )}

          {/* Individual Verified Events */}
          <section className="space-y-3">
            <h3 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
              Verified Signals ({results.events.length})
            </h3>
            {results.events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.events.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            ) : (
              <div className="p-10 text-center rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-xs text-text-secondaryLight dark:text-text-secondaryDark space-y-1">
                <p className="font-semibold text-text-primaryLight dark:text-text-primaryDark">No matching signals found</p>
                <p>Try searching for broader terms like &quot;AI&quot;, &quot;MCP&quot;, &quot;React&quot;, or &quot;Reasoning&quot;.</p>
              </div>
            )}
          </section>

        </div>
      )}

    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-mutedLight dark:text-text-mutedDark">Loading Discover...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}

