'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Sparkles, Layers, ShieldCheck, ArrowUpRight, Snowflake, CheckCircle2 } from 'lucide-react';
import { notificationApi } from '@/lib/api';
import { TopicCard } from '@/components/TopicCard';

export default function WeeklyReportPage() {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationApi.getWeeklyReport()
      .then(setReport)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-text-muted-light dark:text-text-muted-dark font-mono">
        Compiling weekly macro technology landscape telemetry...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-sage-soft-light text-sage-text-light dark:bg-sage-soft-dark dark:text-sage-text-dark border border-sage-light/30 dark:border-sage-dark/30">
            WEEKLY REPORT
          </span>
          <span className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark">
            {report?.week_range}
          </span>
        </div>

        <h1 className="hero-headline text-text-primary-light dark:text-text-primary-dark">
          {report?.title}
        </h1>

        <p className="body-text text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          {report?.executive_summary}
        </p>
      </div>

      {/* Strategic Recommendations */}
      {report?.strategic_recommendations && (
        <section className="p-5 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
          <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
            STRATEGIC ENGINEERING RECOMMENDATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {report.strategic_recommendations.map((rec: string, i: number) => (
              <div key={i} className="p-3 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark shrink-0 mt-0.5" />
                <span className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark leading-snug">{rec}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rising Trends */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
          TOPICS GAINING MASSIVE MOMENTUM
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report?.rising_trends?.map((t: any) => (
            <TopicCard key={t.id} topic={t} />
          ))}
        </div>
      </section>

      {/* Cooling Down Signals */}
      {report?.cooling_down && (
        <section className="p-5 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
              TECHNOLOGY PATTERNS COOLING DOWN
            </h2>
          </div>
          {report.cooling_down.map((item: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-1">
              <h4 className="card-title text-xs text-text-primary-light dark:text-text-primary-dark">{item.title}</h4>
              <p className="body-text text-xs text-text-muted-light dark:text-text-muted-dark">{item.reason}</p>
            </div>
          ))}
        </section>
      )}

    </div>
  );
}
