'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, ExternalLink, ShieldCheck, ThumbsDown } from 'lucide-react';
import { libraryApi } from '@/lib/api';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    what_happened?: string;
    why_it_matters?: string;
    technical_explanation?: string;
    business_impact?: string;
    developer_impact?: string;
    category: string;
    published_at: string;
    primary_source_name: string;
    primary_source_url?: string;
    is_verified?: boolean;
    radar_section: string;
    tags?: string[];
    key_takeaways?: string[];
    is_saved?: boolean;
  };
  onFeedbackDismiss?: (id: string) => void;
}

export function EventCard({ event, onFeedbackDismiss }: EventCardProps) {
  const [isSaved, setIsSaved] = useState(event.is_saved || false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isSaved) {
        await libraryApi.unsaveItem(event.id);
        setIsSaved(false);
      } else {
        await libraryApi.saveItem(event.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save state', err);
    }
  };

  const handleFeedback = async (reason: string) => {
    try {
      await libraryApi.giveFeedback(event.id, reason);
      setIsDismissed(true);
      if (onFeedbackDismiss) onFeedbackDismiss(event.id);
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
    setShowFeedbackModal(false);
  };

  if (isDismissed) {
    return (
      <div className="p-3.5 rounded-[10px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs text-text-mutedLight dark:text-text-mutedDark italic">
        Feedback recorded. Content removed from your radar.
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-5 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors shadow-xs group">
      
      {/* Top Metadata Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark">
            {event.category.toUpperCase()}
          </span>
          <span className="text-xs tech-mono text-text-mutedLight dark:text-text-mutedDark">
            • {event.primary_source_name}
          </span>
          {event.is_verified && (
            <span className="hidden sm:flex items-center gap-0.5 text-[10px] text-semantic-rising dark:text-semantic-risingDark font-medium tech-mono">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleSave}
            title={isSaved ? 'Saved in library' : 'Save article'}
            className="p-1 rounded-[6px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-canvas-light dark:hover:bg-surface-dark transition-colors"
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-accent-textLight dark:text-accent-textDark" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setShowFeedbackModal(!showFeedbackModal)}
            title="Not interested"
            className="p-1 rounded-[6px] text-text-mutedLight dark:text-text-mutedDark hover:text-semantic-alert hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feedback Modal Popup */}
      {showFeedbackModal && (
        <div className="absolute right-3 top-10 z-30 w-48 p-1.5 rounded-[8px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-md text-xs space-y-0.5">
          <p className="px-2 py-1 text-[10px] font-mono uppercase text-text-mutedLight dark:text-text-mutedDark">
            Improve your radar:
          </p>
          {[
            'Not relevant to me',
            'Too repetitive',
            'Don\'t want this topic',
            'Too basic',
            'Too advanced',
          ].map((reason) => (
            <button
              key={reason}
              onClick={() => handleFeedback(reason)}
              className="w-full text-left px-2 py-1 rounded-[4px] text-text-primaryLight dark:text-text-primaryDark hover:bg-canvas-light dark:hover:bg-surface-dark transition-colors text-[11px]"
            >
              {reason}
            </button>
          ))}
        </div>
      )}

      {/* Title */}
      <Link href={`/article/${event.slug || event.id}`}>
        <h4 className="card-title text-text-primaryLight dark:text-text-primaryDark group-hover:text-accent-textLight dark:group-hover:text-accent-textDark transition-colors mb-1.5">
          {event.title}
        </h4>
      </Link>

      {/* Summary Narrative */}
      <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark mb-3 line-clamp-2 leading-relaxed">
        {event.summary}
      </p>

      {/* Why you're seeing this metadata footnote */}
      <div className="text-[11px] text-text-mutedLight dark:text-text-mutedDark mb-3 pt-2 border-t border-divider-light dark:border-divider-dark flex items-center justify-between">
        <span>Why you&apos;re seeing this: Followed category &bull; High momentum signal</span>
        <span className="tech-mono">Recent</span>
      </div>

      {/* Footer link to source and deep dive */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href={`/article/${event.slug || event.id}`}
          className="text-xs font-medium text-accent-textLight dark:text-accent-textDark hover:underline"
        >
          Read analysis &rarr;
        </Link>

        {event.primary_source_url && (
          <a
            href={event.primary_source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors tech-mono"
          >
            <span>Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

    </div>
  );
}

