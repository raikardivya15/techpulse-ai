'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Layers, ArrowUpRight } from 'lucide-react';
import { libraryApi } from '@/lib/api';
import { EventCard } from '@/components/EventCard';
import { TopicCard } from '@/components/TopicCard';

export default function LibraryPage() {
  const [tab, setTab] = useState<'articles' | 'topics'>('articles');
  const [libraryData, setLibraryData] = useState<{ saved_articles: any[]; followed_topics: any[] }>({
    saved_articles: [],
    followed_topics: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibrary = async () => {
    setIsLoading(true);
    try {
      const res = await libraryApi.getLibrary();
      setLibraryData(res);
    } catch (err) {
      console.error('Failed to load user library', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="page-title text-text-primary-light dark:text-text-primary-dark">
          Knowledge Library
        </h1>
        <p className="body-text text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
          Saved signals, traceable research, and followed technology topics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-divider-light dark:border-divider-dark pb-3">
        <button
          onClick={() => setTab('articles')}
          className={`px-3.5 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
            tab === 'articles'
              ? 'bg-sage-soft-light text-sage-text-light dark:bg-sage-soft-dark dark:text-sage-text-dark border border-sage-light/30 dark:border-sage-dark/30 font-semibold'
              : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
          }`}
        >
          Saved Signals ({libraryData.saved_articles.length})
        </button>

        <button
          onClick={() => setTab('topics')}
          className={`px-3.5 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
            tab === 'topics'
              ? 'bg-sage-soft-light text-sage-text-light dark:bg-sage-soft-dark dark:text-sage-text-dark border border-sage-light/30 dark:border-sage-dark/30 font-semibold'
              : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
          }`}
        >
          Followed Topics ({libraryData.followed_topics.length})
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-text-muted-light dark:text-text-muted-dark font-mono">
          Loading library bookmarks...
        </div>
      ) : tab === 'articles' ? (
        libraryData.saved_articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {libraryData.saved_articles.map((item) => (
              <div key={item.saved_id} className="relative">
                <EventCard event={item.event} />
                {item.custom_notes && (
                  <div className="mt-2 p-2.5 rounded-[8px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-[11px] text-text-secondary-light dark:text-text-secondary-dark italic font-mono">
                    Note: &quot;{item.custom_notes}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
            <Bookmark className="w-6 h-6 text-sage-light dark:text-sage-dark mx-auto" />
            <h3 className="card-title text-text-primary-light dark:text-text-primary-dark">
              Your library is currently empty
            </h3>
            <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark max-w-sm mx-auto">
              Click the bookmark icon on any radar card to save articles, code breakdowns, and papers for offline reference.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-3.5 py-1.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all"
            >
              Explore Feed
            </Link>
          </div>
        )
      ) : (
        libraryData.followed_topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {libraryData.followed_topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
            <Layers className="w-6 h-6 text-sage-light dark:text-sage-dark mx-auto" />
            <h3 className="card-title text-text-primary-light dark:text-text-primary-dark">
              Not following any topics yet
            </h3>
            <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark max-w-sm mx-auto">
              Follow topics like AI Agent Memory or MCP to receive elevated radar notifications and prioritized feed ranking.
            </p>
            <Link
              href="/discover"
              className="inline-block mt-2 px-3.5 py-1.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all"
            >
              Discover Topics
            </Link>
          </div>
        )
      )}

    </div>
  );
}
