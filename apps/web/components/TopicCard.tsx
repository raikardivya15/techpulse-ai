'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Layers } from 'lucide-react';

interface TopicCardProps {
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
    why_it_matters?: string;
    what_happened?: string;
  };
}

export function TopicCard({ topic }: TopicCardProps) {
  const momentumPercent = Math.round(topic.momentum_score * 100);

  return (
    <div className="flex flex-col justify-between p-4 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors shadow-xs group">
      
      <div>
        {/* Top Topic & Momentum Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark">
            {topic.category.toUpperCase()}
          </span>
          
          <span className="text-xs tech-mono font-semibold text-semantic-rising dark:text-semantic-risingDark">
            ↑ {momentumPercent}%
          </span>
        </div>

        {/* Title */}
        <Link href={`/topic/${topic.slug}`}>
          <h3 className="card-title text-text-primaryLight dark:text-text-primaryDark group-hover:text-accent-textLight dark:group-hover:text-accent-textDark transition-colors mb-1.5 line-clamp-2">
            {topic.title}
          </h3>
        </Link>

        {/* Narrative Takeaway */}
        <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark line-clamp-2 mb-3 leading-relaxed">
          {topic.tagline || topic.why_it_matters || topic.what_happened}
        </p>
      </div>

      {/* Footer Details: Sources and Trend Status */}
      <div className="pt-2.5 border-t border-divider-light dark:border-divider-dark flex items-center justify-between text-xs tech-mono text-text-mutedLight dark:text-text-mutedDark">
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3" />
          {topic.source_count} sources
        </span>

        <Link
          href={`/topic/${topic.slug}`}
          className="inline-flex items-center gap-0.5 text-xs font-sans font-medium text-text-primaryLight dark:text-text-primaryDark hover:text-accent-textLight dark:hover:text-accent-textDark transition-colors"
        >
          <span>View report</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
}

