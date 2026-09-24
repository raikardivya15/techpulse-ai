'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Layers, Check, Plus } from 'lucide-react';
import { useTopics } from '@/lib/topics-context';

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
    source_diversity?: string | number;
    why_it_matters?: string;
    what_happened?: string;
  };
}

export function TopicCard({ topic }: TopicCardProps) {
  const { isTopicSelected, toggleTopic } = useTopics();
  const isSelected = isTopicSelected(topic.title);

  // Normalize momentum percentage
  const rawScore = topic.momentum_score > 1 ? topic.momentum_score : Math.round(topic.momentum_score * 100);
  const momentumPercent = Math.min(99, Math.max(50, rawScore));

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTopic(topic.title);
  };

  return (
    <div className={`flex flex-col justify-between p-4 rounded-[10px] border transition-all shadow-xs group ${
      isSelected
        ? 'bg-accent-softLight/30 dark:bg-accent-softDark/15 border-accent/35 dark:border-accent-dark/35'
        : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40'
    }`}>
      
      <div>
        {/* Top Topic & Momentum Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark">
              {topic.category.toUpperCase()}
            </span>
            <span className="text-xs tech-mono font-semibold text-semantic-rising dark:text-semantic-risingDark">
              ↑ {momentumPercent}%
            </span>
          </div>

          {/* 1-Click Select/Follow Button */}
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[10px] font-bold tracking-wide transition-all ${
              isSelected
                ? 'bg-accent dark:bg-accent-dark text-white dark:text-[#0D0E0D] shadow-xs'
                : 'bg-gray-100 dark:bg-zinc-800 text-text-secondaryLight dark:text-text-secondaryDark hover:bg-accent-softLight dark:hover:bg-accent-softDark hover:text-accent-textLight dark:hover:text-accent-textDark'
            }`}
            title={isSelected ? 'Selected in your radar. Tap to unselect' : 'Tap to select this topic for your radar'}
          >
            {isSelected ? (
              <>
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <Plus className="w-2.5 h-2.5 stroke-[3]" />
                <span>Select</span>
              </>
            )}
          </button>
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
