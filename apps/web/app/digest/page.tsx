'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { notificationApi } from '@/lib/api';

export default function DailyDigestPage() {
  const [digest, setDigest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationApi.getDailyDigest()
      .then(setDigest)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-text-muted-light dark:text-text-muted-dark font-mono">
        Formatting your daily executive briefing...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Editorial Header */}
      <div className="p-6 sm:p-7 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-sage-soft-light text-sage-text-light dark:bg-sage-soft-dark dark:text-sage-text-dark border border-sage-light/30 dark:border-sage-dark/30">
            DAILY BRIEF
          </span>
          <span className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark">
            {digest?.date}
          </span>
        </div>

        <h1 className="hero-headline text-text-primary-light dark:text-text-primary-dark">
          {digest?.title}
        </h1>

        <p className="body-text text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          {digest?.curator_note}
        </p>
      </div>

      {/* Recommended Learning Action */}
      {digest?.recommended_learning && (
        <div className="p-5 rounded-[10px] bg-sage-soft-light dark:bg-sage-soft-dark border border-sage-light/30 dark:border-sage-dark/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-sage-text-light dark:text-sage-text-dark font-semibold">
                TODAY&apos;S RECOMMENDED LEARNING ({digest.recommended_learning.duration})
              </span>
            </div>
            <h3 className="card-title text-text-primary-light dark:text-text-primary-dark">
              {digest.recommended_learning.title}
            </h3>
            <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {digest.recommended_learning.description}
            </p>
          </div>

          <Link
            href={digest.recommended_learning.link}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all"
          >
            <span>Start Learning</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 5 Essential Stories */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
          THE 5 ESSENTIAL DEVELOPMENTS
        </h2>

        <div className="space-y-3">
          {digest?.top_stories?.map((story: any, idx: number) => (
            <Link
              key={story.id}
              href={`/article/${story.slug || story.id}`}
              className="block p-4 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-sage-light/50 dark:hover:border-sage-dark/50 hover:bg-card-hover-light dark:hover:bg-card-hover-dark shadow-xs transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-[4px] bg-sage-soft-light dark:bg-sage-soft-dark border border-sage-light/30 dark:border-sage-dark/30 flex items-center justify-center font-mono text-[11px] font-semibold text-sage-text-light dark:text-sage-text-dark shrink-0 mt-0.5">
                  {idx + 1}
                </span>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-canvas-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark border border-border-light dark:border-border-dark">
                      {story.primary_source_name}
                    </span>
                    <span className="text-[11px] font-medium text-text-secondary-light dark:text-text-secondary-dark">
                      • {story.category}
                    </span>
                  </div>

                  <h3 className="card-title text-text-primary-light dark:text-text-primary-dark group-hover:text-sage-text-light dark:group-hover:text-sage-text-dark transition-colors">
                    {story.title}
                  </h3>

                  <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed line-clamp-2">
                    {story.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
