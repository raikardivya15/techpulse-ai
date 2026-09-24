'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, 
  ShieldCheck, Sparkles, CheckCircle2
} from 'lucide-react';
import { feedApi, libraryApi } from '@/lib/api';

export default function ArticleDetailPage() {
  const params = useParams();
  const identifier = params.id as string;

  const [data, setData] = useState<{ article: any; sources: any[] } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticle = async () => {
    setIsLoading(true);
    try {
      const res = await feedApi.getArticle(identifier);
      setData(res);
      setIsSaved(res.article?.is_saved || false);
    } catch (err) {
      console.error('Failed to load article detail', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (identifier) fetchArticle();
  }, [identifier]);

  const toggleSave = async () => {
    if (!data?.article) return;
    try {
      if (isSaved) {
        await libraryApi.unsaveItem(data.article.id);
        setIsSaved(false);
      } else {
        await libraryApi.saveItem(data.article.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-3">
        <div className="w-6 h-6 rounded-full border-2 border-sage-light dark:border-sage-dark border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark font-mono">
          Synthesizing multi-source verification and technical analysis...
        </p>
      </div>
    );
  }

  if (!data?.article) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4 py-20">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Signal Not Found</h2>
        <Link href="/" className="text-xs text-sage-text-light dark:text-sage-text-dark hover:underline">
          Return to Home Radar →
        </Link>
      </div>
    );
  }

  const { article, sources } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home Radar</span>
      </Link>

      {/* Main Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark font-semibold">
              {article.primary_source_name}
            </span>
            <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
              • {article.category}
            </span>
            {article.is_verified && (
              <span className="flex items-center gap-1 text-[11px] text-semantic-rising-light dark:text-semantic-rising-dark font-medium font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Signal
              </span>
            )}
          </div>

          <button
            onClick={toggleSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
              isSaved
                ? 'bg-sage-soft-light dark:bg-sage-soft-dark text-sage-text-light dark:text-sage-text-dark border border-sage-light/40 dark:border-sage-dark/40 font-semibold'
                : 'bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-sage-light/50 dark:hover:border-sage-dark/50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved in Library' : 'Save Signal'}</span>
          </button>
        </div>

        <h1 className="hero-headline text-text-primary-light dark:text-text-primary-dark">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted-light dark:text-text-muted-dark pb-3 border-b border-divider-light dark:border-divider-dark">
          <span>Published: {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Recent'}</span>
          <span>•</span>
          <span>Radar Section: {article.radar_section.replace('_', ' ').toUpperCase()}</span>
        </div>
      </div>

      {/* AI Intelligence Summary Banner */}
      <div className="p-4 sm:p-5 rounded-[10px] bg-sage-soft-light dark:bg-sage-soft-dark border border-sage-light/30 dark:border-sage-dark/30 space-y-2 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sage-text-light dark:text-sage-text-dark uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
          <span>AI-GENERATED EXECUTIVE SYNTHESIS</span>
        </div>
        <p className="body-text text-sm text-text-primary-light dark:text-text-primary-dark leading-relaxed">
          {article.summary}
        </p>
      </div>

      {/* Key Takeaways */}
      {article.key_takeaways && article.key_takeaways.length > 0 && (
        <div className="p-5 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
          <h3 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
            KEY TAKEAWAYS FOR ENGINEERS
          </h3>
          <ul className="space-y-2">
            {article.key_takeaways.map((point: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 body-text text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Deep Dives: Technical & Business Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 shadow-xs">
          <h3 className="card-title text-xs text-text-primary-light dark:text-text-primary-dark uppercase font-semibold">
            TECHNICAL EXPLANATION
          </h3>
          <p className="body-text text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            {article.technical_explanation || article.what_happened}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 shadow-xs">
          <h3 className="card-title text-xs text-text-primary-light dark:text-text-primary-dark uppercase font-semibold">
            BUSINESS & ECOSYSTEM IMPACT
          </h3>
          <p className="body-text text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            {article.business_impact || article.why_it_matters}
          </p>
        </div>
      </div>

      {/* What Changed Compared to Before? */}
      {article.what_changed && (
        <div className="p-4 sm:p-5 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 shadow-xs">
          <h3 className="card-title text-xs text-text-primary-light dark:text-text-primary-dark uppercase font-semibold">
            WHAT CHANGED COMPARED WITH BEFORE?
          </h3>
          <p className="body-text text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            {article.what_changed}
          </p>
        </div>
      )}

      {/* Multi-Source Links */}
      <section className="space-y-3 pt-4 border-t border-divider-light dark:border-divider-dark">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
            PRIMARY SOURCES & COMMUNITY DISCUSSIONS ({sources.length})
          </h3>
        </div>

        <div className="space-y-2.5">
          {sources.map((s: any) => (
            <div
              key={s.id}
              className="p-3.5 rounded-[8px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark flex items-center justify-between gap-4 shadow-xs hover:border-sage-light/40 dark:hover:border-sage-dark/40 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-canvas-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark border border-border-light dark:border-border-dark">
                    {s.source_type}
                  </span>
                  <span className="card-title text-xs text-text-primary-light dark:text-text-primary-dark">
                    {s.title}
                  </span>
                </div>
                <p className="body-text text-[11px] text-text-muted-light dark:text-text-muted-dark line-clamp-1">
                  {s.summary}
                </p>
              </div>

              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-canvas-light hover:bg-card-hover-light dark:bg-surface-dark dark:hover:bg-card-hover-dark border border-border-light dark:border-border-dark text-xs font-medium text-text-primary-light dark:text-text-primary-dark transition-colors"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
