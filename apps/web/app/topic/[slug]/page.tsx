'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Layers, ShieldCheck, Bookmark, BookmarkCheck,
  CheckCircle2, Clock, BookOpen, Quote, Sparkles, ExternalLink, ArrowLeft,
  TrendingUp, Code2, Rocket, Building2, Eye
} from 'lucide-react';
import { feedApi, libraryApi } from '@/lib/api';
import { EventCard } from '@/components/EventCard';

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<{ topic: any; events: any[]; sources: any[] } | null>(null);
  const [explanationMode, setExplanationMode] = useState<'tldr' | 'beginner' | 'technical' | 'impact' | 'learn'>('tldr');
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopic = async () => {
    setIsLoading(true);
    try {
      const res = await feedApi.getTopic(slug);
      setData(res);
      setIsFollowed(res.topic?.is_followed || false);
    } catch (err) {
      console.error('Failed to load topic detail', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchTopic();
  }, [slug]);

  const toggleFollow = async () => {
    try {
      if (isFollowed) {
        await libraryApi.unfollowTopic(slug);
        setIsFollowed(false);
      } else {
        await libraryApi.followTopic(slug);
        setIsFollowed(true);
      }
    } catch (err) {
      console.error('Failed to toggle follow', err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-3">
        <div className="w-6 h-6 rounded-full border-2 border-accent dark:border-accent-dark border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-text-mutedLight dark:text-text-mutedDark tech-mono">
          Compiling intelligence report...
        </p>
      </div>
    );
  }

  if (!data?.topic) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4 py-20">
        <h2 className="text-lg font-semibold text-text-primaryLight dark:text-text-primaryDark">Topic Not Found</h2>
        <Link href="/discover" className="text-xs text-accent-textLight dark:text-accent-textDark hover:underline">
          Return to Discover &rarr;
        </Link>
      </div>
    );
  }

  const { topic, events, sources } = data;
  const momentumPercent = Math.round(topic.momentum_score * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Radar</span>
      </Link>

      {/* Intelligence Report Header */}
      <div className="p-5 sm:p-6 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] tech-mono font-semibold uppercase px-2 py-0.5 rounded-[4px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark">
              {topic.status}
            </span>
            <span className="text-xs tech-mono text-semantic-rising dark:text-semantic-risingDark font-semibold">
              +{momentumPercent}% discussion velocity
            </span>
            <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">
              • {topic.category}
            </span>
          </div>

          <button
            onClick={toggleFollow}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-xs font-medium transition-all ${
              isFollowed
                ? 'bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark border border-accent/30 dark:border-accent-dark/30'
                : 'bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] shadow-xs'
            }`}
          >
            {isFollowed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Following</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Follow</span>
              </>
            )}
          </button>
        </div>

        <h1 className="hero-headline text-text-primaryLight dark:text-text-primaryDark">
          {topic.title}
        </h1>

        <p className="body-text text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
          {topic.tagline || topic.what_happened}
        </p>

        {/* Multi-Source Metadata Bar */}
        <div className="pt-3 border-t border-divider-light dark:border-divider-dark flex flex-wrap items-center justify-between gap-3 text-xs tech-mono text-text-mutedLight dark:text-text-mutedDark">
          <div className="flex items-center gap-3">
            <span>Momentum:</span>
            <div className="w-24 h-1.5 rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
              <div 
                className="h-full bg-accent dark:bg-accent-dark rounded-full"
                style={{ width: `${momentumPercent}%` }}
              />
            </div>
            <span className="font-semibold text-text-primaryLight dark:text-text-primaryDark">+{momentumPercent}%</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {sources.length} sources
            </span>
            <span className="flex items-center gap-1 text-semantic-rising dark:text-semantic-risingDark">
              <ShieldCheck className="w-3.5 h-3.5" />
              Evidence verified
            </span>
          </div>
        </div>

      </div>

      {/* Intelligence Sections: What is Happening & Why Trending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-1.5 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primaryLight dark:text-text-primaryDark">
            What is happening?
          </h3>
          <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            {topic.what_happened || topic.tagline}
          </p>
        </div>

        <div className="p-4 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-1.5 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-textLight dark:text-accent-textDark">
            Why it is trending
          </h3>
          <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            {topic.why_trending || topic.why_it_matters}
          </p>
        </div>
      </div>

      {/* Multi-Perspective Analysis Switcher */}
      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
            Analysis & Perspective
          </h3>
          
          <div className="flex items-center gap-1 p-0.5 rounded-[6px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs">
            {[
              { id: 'tldr', label: 'Executive' },
              { id: 'technical', label: 'Architecture' },
              { id: 'impact', label: 'Impact' },
              { id: 'learn', label: 'Roadmap' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setExplanationMode(tab.id as any)}
                className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors ${
                  explanationMode === tab.id
                    ? 'bg-accent dark:bg-accent-dark text-white dark:text-[#0D0E0D] font-semibold'
                    : 'text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
          {explanationMode === 'tldr' && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-textLight dark:text-accent-textDark mb-1.5">Executive Synthesis</h4>
              <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                {topic.what_happened}
              </p>
            </div>
          )}

          {explanationMode === 'technical' && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-textLight dark:text-accent-textDark mb-1.5">Technical Breakdown</h4>
              <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed font-mono">
                {topic.technical_explanation}
              </p>
              {topic.related_technologies && (
                <div className="pt-2 border-t border-divider-light dark:border-divider-dark text-[11px] tech-mono text-text-mutedLight dark:text-text-mutedDark">
                  Stack: {topic.related_technologies.join(' • ')}
                </div>
              )}
            </div>
          )}

          {explanationMode === 'impact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h5 className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark mb-1">Business Impact</h5>
                <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                  {topic.business_impact}
                </p>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark mb-1">Developer Impact</h5>
                <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                  {topic.developer_impact}
                </p>
              </div>
            </div>
          )}

          {explanationMode === 'learn' && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-textLight dark:text-accent-textDark mb-1">What to Watch Next</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {topic.learning_recommendations?.map((item: any, idx: number) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] tech-mono text-accent-textLight dark:text-accent-textDark">
                        {item.duration}
                      </span>
                      <h5 className="card-title text-xs text-text-primaryLight dark:text-text-primaryDark mt-1 mb-1">
                        {item.title}
                      </h5>
                      <p className="body-text text-[11px] text-text-secondaryLight dark:text-text-secondaryDark line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-[10px] text-accent-textLight dark:text-accent-textDark font-medium mt-2 flex items-center gap-0.5">
                      Resource <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      {topic.timeline_events && topic.timeline_events.length > 0 && (
        <section className="space-y-3">
          <h3 className="section-heading text-text-primaryLight dark:text-text-primaryDark flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-text-mutedLight dark:text-text-mutedDark" />
            Timeline & Key Developments
          </h3>

          <div className="p-4 sm:p-5 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
            {topic.timeline_events.map((tEv: any, idx: number) => (
              <div key={idx} className="flex gap-3 items-start relative pb-3 last:pb-0">
                {idx < topic.timeline_events.length - 1 && (
                  <div className="absolute left-1.5 top-5 bottom-0 w-px bg-border-light dark:bg-border-dark" />
                )}
                <div className="w-3 h-3 rounded-full bg-accent dark:bg-accent-dark shrink-0 mt-1" />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] tech-mono text-text-mutedLight dark:text-text-mutedDark">
                      {tEv.date}
                    </span>
                    <span className="text-[10px] tech-mono px-1.5 py-0.2 rounded bg-canvas-light dark:bg-surface-dark text-text-secondaryLight dark:text-text-secondaryDark border border-border-light dark:border-border-dark">
                      {tEv.source}
                    </span>
                  </div>
                  <h5 className="card-title text-xs text-text-primaryLight dark:text-text-primaryDark">
                    {tEv.title}
                  </h5>
                  <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-0.5">
                    {tEv.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Traceable Sources & Citations */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="section-heading text-text-primaryLight dark:text-text-primaryDark flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-text-mutedLight dark:text-text-mutedDark" />
            Sources & Traceable Evidence ({sources.length})
          </h3>
          <span className="text-[11px] text-semantic-rising dark:text-semantic-risingDark flex items-center gap-1 tech-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Traceable Claims
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {sources.map((s: any) => (
            <div
              key={s.id}
              className="p-3.5 rounded-[8px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark flex flex-col justify-between shadow-xs hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] tech-mono uppercase px-1.5 py-0.2 rounded bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondaryLight dark:text-text-secondaryDark">
                    {s.source_type}
                  </span>
                  <span className="text-[10px] tech-mono text-accent-textLight dark:text-accent-textDark font-medium">
                    ▲ {Math.round(s.score)} pts
                  </span>
                </div>
                <h5 className="card-title text-xs text-text-primaryLight dark:text-text-primaryDark mb-1">
                  {s.title}
                </h5>
                <p className="body-text text-[11px] text-text-secondaryLight dark:text-text-secondaryDark line-clamp-2">
                  {s.summary}
                </p>
              </div>

              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-accent-textLight dark:text-accent-textDark font-medium hover:underline mt-2 tech-mono"
                >
                  <span>Verify primary source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Associated Radar Event Stories */}
      {events && events.length > 0 && (
        <section className="space-y-3">
          <h3 className="section-heading text-text-primaryLight dark:text-text-primaryDark">
            Coverage & Related Signals ({events.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events.map((ev: any) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

