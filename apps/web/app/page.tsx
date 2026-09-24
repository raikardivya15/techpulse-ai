'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, RefreshCw, ArrowRight,
  Rocket, Code2, BookOpen, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRealtime } from '@/lib/realtime-context';
import { feedApi } from '@/lib/api';
import { HeroSignalCard } from '@/components/HeroSignalCard';
import { TopicCard } from '@/components/TopicCard';
import { EventCard } from '@/components/EventCard';
import { LiveIntelligencePanel } from '@/components/LiveIntelligencePanel';

export default function HomePage() {
  const { user } = useAuth();
  const { latestSignal, liveSignals, simulateSignal } = useRealtime();
  const [feed, setFeed] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newSignalsNotice, setNewSignalsNotice] = useState<any[]>([]);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const data = await feedApi.getHomeFeed();
      setFeed(data);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // When a real-time signal arrives via WebSocket, display notice and update feed
  useEffect(() => {
    if (latestSignal) {
      setNewSignalsNotice((prev) => [latestSignal, ...prev.filter(s => s.id !== latestSignal.id)]);
    }
  }, [latestSignal]);

  const userName = user?.name ? user.name.split(' ')[0] : 'Divya';

  return (
    <div className="flex w-full">
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 space-y-8 max-w-5xl">
        
        {/* Welcome Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-divider-light dark:border-divider-dark">
          <div>
            <h1 className="page-title text-text-primaryLight dark:text-text-primaryDark">
              Good evening, {userName}
            </h1>
            <p className="body-text text-text-secondaryLight dark:text-text-secondaryDark mt-0.5">
              Here&apos;s what changed across technology today.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchFeed}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white dark:bg-card-dark hover:bg-card-hoverLight dark:hover:bg-card-hoverDark border border-border-light dark:border-border-dark text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-accent dark:text-accent-dark' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/pulse"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Pulse</span>
            </Link>
          </div>
        </div>

        {/* Realtime Incoming Signals Live Stream Banner */}
        {newSignalsNotice.length > 0 && (
          <div className="p-3.5 rounded-[10px] bg-sage-soft-light dark:bg-sage-soft-dark border border-sage-light/40 dark:border-sage-dark/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-sage-light dark:bg-sage-dark animate-ping shrink-0" />
              <div>
                <p className="card-title text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark">
                  ⚡ {newSignalsNotice.length} new real-time technology signal{newSignalsNotice.length > 1 ? 's' : ''} ingested
                </p>
                <p className="body-text text-[11px] text-text-secondaryLight dark:text-text-secondaryDark">
                  Latest: &quot;{newSignalsNotice[0].title}&quot; ({newSignalsNotice[0].primary_source_name})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/article/${newSignalsNotice[0].slug}`}
                className="px-3 py-1 rounded-[6px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-[11px] font-medium shadow-xs transition-all"
              >
                View Live Signal →
              </Link>
              <button
                onClick={() => setNewSignalsNotice([])}
                className="text-[11px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark px-1.5 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* 01 — SIGNAL OF THE DAY */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="tech-mono font-semibold text-accent-textLight dark:text-accent-textDark">01</span>
              <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                Signal of the Day
              </h2>
            </div>
            <span className="text-[11px] tech-mono text-text-mutedLight dark:text-text-mutedDark">
              Synthesized from 42 signals
            </span>
          </div>

          {feed?.hero_signal && <HeroSignalCard topic={feed.hero_signal} />}
        </section>

        {/* 02 — TRENDING NOW */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="tech-mono font-semibold text-accent-textLight dark:text-accent-textDark">02</span>
              <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                Trending Now
              </h2>
            </div>
            <Link href="/discover" className="text-xs font-medium text-accent-textLight dark:text-accent-textDark hover:underline flex items-center gap-1">
              <span>View all trends</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {feed?.trending?.map((topic: any) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        {/* 03 — FOR YOU (PERSONALIZED FEED) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="tech-mono font-semibold text-accent-textLight dark:text-accent-textDark">03</span>
              <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                For You
              </h2>
            </div>
            <span className="text-[11px] tech-mono text-text-mutedLight dark:text-text-mutedDark">
              Tuned for {user?.role || 'AI Engineer'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {feed?.for_you?.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* 04 — WHAT CHANGED TODAY (CRITICAL SHIFTS) */}
        {feed?.changed_today && feed.changed_today.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="tech-mono font-semibold text-semantic-alert">04</span>
                <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-semantic-alert" />
                  What Changed Today
                </h2>
              </div>
              <span className="text-[11px] tech-mono text-semantic-alert">
                Critical Advisories
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {feed.changed_today.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* 05 — DOMAIN STREAMS (STARTUPS, DEVELOPER, RESEARCH) */}
        <section className="space-y-6 pt-2">
          
          {/* Startups */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-accent dark:text-accent-dark" />
                <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                  Startup Radar
                </h2>
              </div>
              <span className="text-[11px] text-text-mutedLight dark:text-text-mutedDark tech-mono">
                YC & Early Launches
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feed?.startup_radar?.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Developer Tools */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent dark:text-accent-dark" />
                <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                  Developer Radar
                </h2>
              </div>
              <span className="text-[11px] text-text-mutedLight dark:text-text-mutedDark tech-mono">
                Frameworks, Tooling & Engines
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feed?.dev_radar?.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Research */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent dark:text-accent-dark" />
                <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                  Research Radar
                </h2>
              </div>
              <span className="text-[11px] text-text-mutedLight dark:text-text-mutedDark tech-mono">
                arXiv & Preprints
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feed?.research_radar?.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

        </section>

      </div>

      {/* Right Desktop Intelligence Rail */}
      <LiveIntelligencePanel />

    </div>
  );
}

