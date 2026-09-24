'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export function LiveIntelligencePanel() {
  const sources = [
    { name: 'Hacker News', count: '1,420 items', status: 'Live' },
    { name: 'GitHub Trending', count: '890 commits', status: 'Live' },
    { name: 'Reddit Dev Hubs', count: '1,150 threads', status: 'Live' },
    { name: 'arXiv Preprints', count: '480 papers', status: 'Live' },
    { name: 'YC & Product Hunt', count: '310 launches', status: 'Live' },
    { name: 'Engineering Blogs', count: '642 posts', status: 'Live' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-72 border-l border-border-light dark:border-border-dark min-h-[calc(100vh-3.5rem)] p-4 bg-canvas-light dark:bg-canvas-dark shrink-0 space-y-4">
      
      {/* Ask Pulse Assistant Box */}
      <div className="p-3.5 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-[6px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <h4 className="font-semibold text-xs text-text-primaryLight dark:text-text-primaryDark">
            Ask Pulse
          </h4>
        </div>
        <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark mb-3 leading-relaxed">
          Ground queries across verified tech radar signals with zero hallucination.
        </p>

        <div className="space-y-1 mb-3">
          {[
            'What\'s happening in AI today?',
            'Why is MCP trending?',
            'What should I learn this week?'
          ].map((prompt) => (
            <Link
              key={prompt}
              href={`/pulse?prompt=${encodeURIComponent(prompt)}`}
              className="block px-2 py-1 rounded-[6px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-[11px] text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors truncate"
            >
              &quot;{prompt}&quot;
            </Link>
          ))}
        </div>

        <Link
          href="/pulse"
          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-[8px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-xs font-medium transition-all shadow-xs"
        >
          <span>Open AI Pulse</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Active Source Ingestion Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark">
            WATCHED SOURCES
          </span>
          <span className="flex items-center gap-1 text-[10px] tech-mono text-semantic-rising dark:text-semantic-risingDark">
            <span className="w-1.5 h-1.5 rounded-full bg-semantic-rising dark:bg-semantic-risingDark animate-pulse" />
            Active
          </span>
        </div>

        <div className="space-y-1.5">
          {sources.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between p-2 rounded-[8px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-xs shadow-xs"
            >
              <div>
                <p className="font-medium text-text-primaryLight dark:text-text-primaryDark">{s.name}</p>
                <p className="text-[10px] text-text-mutedLight dark:text-text-mutedDark tech-mono">{s.count}</p>
              </div>
              <span className="text-[10px] tech-mono px-1.5 py-0.2 rounded bg-canvas-light dark:bg-surface-dark text-text-secondaryLight dark:text-text-secondaryDark border border-border-light dark:border-border-dark">
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Trend Logic Badge */}
      <div className="p-3 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-xs space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-accent-textLight dark:text-accent-textDark font-semibold text-[11px]">
          <Zap className="w-3.5 h-3.5 text-accent dark:text-accent-dark" />
          <span>Transparent Scoring</span>
        </div>
        <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
          Scored by: 35% source diversity + 30% velocity + 20% engagement + 15% recency.
        </p>
      </div>

    </aside>
  );
}

