'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, RefreshCw, ArrowRight,
  Rocket, Code2, BookOpen, AlertCircle, 
  Sliders, Plus, Check, Filter, Layers, Flame, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRealtime } from '@/lib/realtime-context';
import { feedApi } from '@/lib/api';
import { useTopics } from '@/lib/topics-context';
import { HeroSignalCard } from '@/components/HeroSignalCard';
import { TopicCard } from '@/components/TopicCard';
import { EventCard } from '@/components/EventCard';
import { LiveIntelligencePanel } from '@/components/LiveIntelligencePanel';
import { TopicSelectorModal } from '@/components/TopicSelectorModal';
import { RealtimeDetailModal, EventDetailData } from '@/components/RealtimeDetailModal';

export default function HomePage() {
  const { user } = useAuth();
  const { latestSignal, liveSignals, simulateSignal } = useRealtime();
  const { selectedTopics, toggleTopic } = useTopics();
  
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('All');
  const [feed, setFeed] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newSignalsNotice, setNewSignalsNotice] = useState<any[]>([]);

  // Modal states
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchFeed = async (topics = selectedTopics, filter = activeTopicFilter) => {
    setIsLoading(true);
    try {
      const data = await feedApi.getHomeFeed(topics, filter === 'All' ? '' : filter);
      setFeed(data);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(selectedTopics, activeTopicFilter);
  }, [selectedTopics, activeTopicFilter]);

  // When a real-time signal arrives via WebSocket, display notice and update feed
  useEffect(() => {
    if (latestSignal) {
      setNewSignalsNotice((prev) => [latestSignal, ...prev.filter(s => s.id !== latestSignal.id)]);
    }
  }, [latestSignal]);

  const userName = user?.name ? user.name.split(' ')[0] : 'Divya';

  const handleOpenDetail = (ev: any) => {
    setSelectedEvent(ev);
    setIsDetailModalOpen(true);
  };

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
              Real-time intelligence personalized for your <span className="font-semibold text-accent-textLight dark:text-accent-textDark">{selectedTopics.length} selected topics</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTopicModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark border border-accent/30 dark:border-accent-dark/30 text-xs font-semibold shadow-xs hover:bg-accent-softLight/80 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Select Topics ({selectedTopics.length})</span>
            </button>

            <button
              onClick={() => fetchFeed(selectedTopics, activeTopicFilter)}
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

        {/* Selected Topics Interactive Filter Bar */}
        <div className="p-3 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-text-mutedLight dark:text-text-mutedDark">
              <Filter className="w-3.5 h-3.5 text-accent dark:text-accent-dark" />
              <span>Filter Radar By Topic:</span>
            </div>

            <button
              onClick={() => setIsTopicModalOpen(true)}
              className="text-[11px] text-accent-textLight dark:text-accent-textDark font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add / Edit Topics</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap">
            {/* All Topics Pill */}
            <button
              onClick={() => setActiveTopicFilter('All')}
              className={`flex items-center gap-1 px-3 py-1 rounded-[6px] text-xs font-medium transition-all ${
                activeTopicFilter === 'All'
                  ? 'bg-accent text-white dark:text-[#0D0E0D] font-bold shadow-xs'
                  : 'bg-gray-100 dark:bg-zinc-800 text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark'
              }`}
            >
              <span>All Selected ({selectedTopics.length})</span>
            </button>

            {/* Individual Selected Topic Pills */}
            {selectedTopics.map((topicName) => {
              const isActive = activeTopicFilter === topicName;
              return (
                <button
                  key={topicName}
                  onClick={() => setActiveTopicFilter(isActive ? 'All' : topicName)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-accent text-white dark:text-[#0D0E0D] font-bold shadow-xs'
                      : 'bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark border border-accent/20 dark:border-accent-dark/20 hover:bg-accent-softLight/80'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{topicName}</span>
                </button>
              );
            })}
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
              <button
                onClick={() => handleOpenDetail(newSignalsNotice[0])}
                className="px-3 py-1 rounded-[6px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-[11px] font-medium shadow-xs transition-all"
              >
                View Live Signal →
              </button>
              <button
                onClick={() => setNewSignalsNotice([])}
                className="text-[11px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark px-1.5 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* 01 — SIGNAL OF THE DAY (Based on Selected Topics) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="tech-mono font-semibold text-accent-textLight dark:text-accent-textDark">01</span>
              <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                Signal of the Day
              </h2>
            </div>
            <span className="text-[11px] tech-mono text-text-mutedLight dark:text-text-mutedDark">
              Synthesized from active developer signals
            </span>
          </div>

          {feed?.hero_signal && <HeroSignalCard topic={feed.hero_signal} />}
        </section>

        {/* 02 — TRENDING CLUSTERS IN YOUR SELECTED TOPICS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="tech-mono font-semibold text-accent-textLight dark:text-accent-textDark">02</span>
              <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                Trending Topic Vectors
              </h2>
            </div>
            <Link href="/discover" className="text-xs font-medium text-accent-textLight dark:text-accent-textDark hover:underline flex items-center gap-1">
              <span>View all in Discover</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {feed?.trending?.map((topic: any) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        {/* 03 — PERSONALIZED RADAR DETAILS (FOR YOU) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="tech-mono font-semibold text-accent-textLight dark:text-accent-textDark">03</span>
              <h2 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
                Personalized Stream ({activeTopicFilter === 'All' ? 'All Selected Topics' : activeTopicFilter})
              </h2>
            </div>
            <span className="text-[11px] tech-mono text-text-mutedLight dark:text-text-mutedDark">
              Live Verified Details
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

      {/* Topic Selector Modal */}
      <TopicSelectorModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
      />

      {/* Realtime Detail Modal */}
      <RealtimeDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

    </div>
  );
}
