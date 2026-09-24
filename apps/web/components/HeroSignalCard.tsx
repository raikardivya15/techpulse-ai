'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Layers, Sparkles } from 'lucide-react';

interface HeroSignalProps {
  topic: {
    id: string;
    slug: string;
    title: string;
    tagline?: string;
    category: string;
    status: string;
    momentum_score: number;
    source_count: number;
    source_diversity: string;
    what_happened?: string;
    why_it_matters?: string;
    why_trending?: string;
    source_breakdown?: Record<string, number>;
  };
}

export function HeroSignalCard({ topic }: HeroSignalProps) {
  if (!topic) return null;

  return (
    <div className="rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-5 sm:p-6 shadow-xs hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors">
      
      {/* Header Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[4px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark">
            SIGNAL OF THE DAY
          </span>
          <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">
            • {topic.category}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs tech-mono text-text-mutedLight dark:text-text-mutedDark">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {topic.source_count} sources
          </span>
          <span className="flex items-center gap-1 text-semantic-rising dark:text-semantic-risingDark">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        </div>
      </div>

      {/* Main Headline */}
      <h2 className="hero-headline text-text-primaryLight dark:text-text-primaryDark mb-2.5">
        {topic.title}
      </h2>

      <p className="body-text text-text-secondaryLight dark:text-text-secondaryDark mb-4 leading-relaxed max-w-3xl">
        {topic.tagline || topic.what_happened}
      </p>

      {/* Why you're seeing this & Why it matters box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark mb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark font-semibold block mb-1">
            Why you&apos;re seeing this
          </span>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            Matches your followed topics in AI agents, developer tools, and workflow automation.
          </p>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-wider text-accent-textLight dark:text-accent-textDark font-semibold block mb-1">
            Why this matters
          </span>
          <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
            {topic.why_it_matters || 'Moving from isolated experiments to integrated developer tooling across the engineering lifecycle.'}
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">Momentum:</span>
            <div className="w-24 h-1.5 rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
              <div 
                className="h-full bg-accent dark:bg-accent-dark rounded-full"
                style={{ width: `${Math.round(topic.momentum_score * 100)}%` }}
              />
            </div>
            <span className="text-xs tech-mono font-medium text-text-primaryLight dark:text-text-primaryDark">
              +{Math.round(topic.momentum_score * 100)}%
            </span>
          </div>
        </div>

        <Link
          href={`/topic/${topic.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent-textLight dark:text-accent-textDark hover:underline"
        >
          <span>Why this matters</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

