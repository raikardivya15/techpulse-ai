'use client';

import React, { useState } from 'react';
import { 
  X, ExternalLink, Sparkles, Bookmark, BookmarkCheck, 
  Share2, Check, Clock, Radio, Activity, Code2, 
  ShieldCheck, AlertCircle, ArrowUpRight, Cpu 
} from 'lucide-react';
import Link from 'next/link';

export interface EventDetailData {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  what_happened?: string;
  why_it_matters?: string;
  technical_explanation?: string;
  business_impact?: string;
  developer_impact?: string;
  what_changed?: string;
  category?: string;
  published_at?: string;
  primary_source_name?: string;
  primary_source_url?: string;
  is_verified?: boolean;
  radar_section?: string;
  tags?: string[];
  key_takeaways?: string[];
  momentum_score?: number;
  is_live?: boolean;
  live_metrics?: {
    points?: number;
    comments?: number;
    stars?: number;
    forks?: number;
    author?: string;
  };
}

interface RealtimeDetailModalProps {
  event: EventDetailData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RealtimeDetailModal({ event, isOpen, onClose }: RealtimeDetailModalProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopyLink = () => {
    const textToCopy = `${event.title}\n\nSummary: ${event.summary || event.what_happened}\n\nSource: ${event.primary_source_url || window.location.href}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const formattedDate = event.published_at
    ? new Date(event.published_at).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Live Ingested';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[12px] bg-white dark:bg-[#121312] border border-border-light dark:border-border-dark shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-light dark:border-border-dark bg-[#FBFBFA] dark:bg-[#161816]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark text-[11px] font-semibold tracking-wide border border-accent/20 dark:border-accent-dark/20">
              <Radio className="w-3 h-3 text-accent dark:text-accent-dark animate-pulse" />
              REAL-TIME SIGNAL
            </span>
            <span className="px-2 py-0.5 rounded-[5px] bg-gray-100 dark:bg-zinc-800 text-text-secondaryLight dark:text-text-secondaryDark text-[11px] font-medium">
              {event.category || 'Technology'}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-gray-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-text-primaryLight dark:text-text-primaryDark">
          
          {/* Main Title & Metadata */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold leading-snug">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-text-mutedLight dark:text-text-mutedDark tech-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1 text-accent dark:text-accent-dark font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {event.primary_source_name || 'Verified Live Feed'}
              </span>
              {event.momentum_score && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <Activity className="w-3.5 h-3.5" />
                  Momentum: {event.momentum_score}/100
                </span>
              )}
            </div>
          </div>

          {/* Live Metric Banner (if available) */}
          {event.live_metrics && (
            <div className="grid grid-cols-3 gap-2 p-3 rounded-[8px] bg-gray-50 dark:bg-zinc-900 border border-border-light dark:border-border-dark text-center text-xs">
              {event.live_metrics.points !== undefined && (
                <div>
                  <p className="font-bold text-sm text-text-primaryLight dark:text-text-primaryDark">{event.live_metrics.points}</p>
                  <p className="text-[10px] text-text-mutedLight dark:text-text-mutedDark">HN Upvotes</p>
                </div>
              )}
              {event.live_metrics.comments !== undefined && (
                <div>
                  <p className="font-bold text-sm text-text-primaryLight dark:text-text-primaryDark">{event.live_metrics.comments}</p>
                  <p className="text-[10px] text-text-mutedLight dark:text-text-mutedDark">Discussions</p>
                </div>
              )}
              {event.live_metrics.stars !== undefined && (
                <div>
                  <p className="font-bold text-sm text-text-primaryLight dark:text-text-primaryDark">{event.live_metrics.stars.toLocaleString()}</p>
                  <p className="text-[10px] text-text-mutedLight dark:text-text-mutedDark">GitHub Stars</p>
                </div>
              )}
              {event.live_metrics.author && (
                <div>
                  <p className="font-bold text-sm text-text-primaryLight dark:text-text-primaryDark truncate">@{event.live_metrics.author}</p>
                  <p className="text-[10px] text-text-mutedLight dark:text-text-mutedDark">Author / Org</p>
                </div>
              )}
            </div>
          )}

          {/* Summary / What Happened */}
          <div className="space-y-1.5 p-3.5 rounded-[8px] bg-accent-softLight/40 dark:bg-accent-softDark/20 border border-accent/15 dark:border-accent-dark/15">
            <h4 className="text-xs font-bold text-accent-textLight dark:text-accent-textDark flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              What Happened & Executive Overview
            </h4>
            <p className="text-xs leading-relaxed text-text-secondaryLight dark:text-text-secondaryDark">
              {event.what_happened || event.summary || 'Real-time telemetry event captured across active developer and research channels.'}
            </p>
          </div>

          {/* Why It Matters */}
          {event.why_it_matters && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-text-primaryLight dark:text-text-primaryDark">
                Why It Matters
              </h4>
              <p className="text-xs leading-relaxed text-text-secondaryLight dark:text-text-secondaryDark">
                {event.why_it_matters}
              </p>
            </div>
          )}

          {/* Technical Breakdown */}
          {event.technical_explanation && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-text-primaryLight dark:text-text-primaryDark flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-accent dark:text-accent-dark" />
                Technical Architecture & Implementation Details
              </h4>
              <div className="p-3 rounded-[8px] bg-gray-50 dark:bg-[#0E0F0E] border border-border-light dark:border-border-dark text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                {event.technical_explanation}
              </div>
            </div>
          )}

          {/* Developer & Business Impact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.developer_impact && (
              <div className="p-3 rounded-[8px] bg-white dark:bg-zinc-900 border border-border-light dark:border-border-dark space-y-1">
                <h5 className="text-[11px] font-bold text-text-primaryLight dark:text-text-primaryDark">Developer Impact</h5>
                <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                  {event.developer_impact}
                </p>
              </div>
            )}
            {event.business_impact && (
              <div className="p-3 rounded-[8px] bg-white dark:bg-zinc-900 border border-border-light dark:border-border-dark space-y-1">
                <h5 className="text-[11px] font-bold text-text-primaryLight dark:text-text-primaryDark">Business & Market Impact</h5>
                <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed">
                  {event.business_impact}
                </p>
              </div>
            )}
          </div>

          {/* Key Takeaways */}
          {event.key_takeaways && event.key_takeaways.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-primaryLight dark:text-text-primaryDark">Key Takeaways</h4>
              <ul className="space-y-1.5">
                {event.key_takeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                    <span className="w-4 h-4 rounded-full bg-accent-softLight dark:bg-accent-softDark text-accent dark:text-accent-dark flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {event.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-[4px] bg-gray-100 dark:bg-zinc-800 text-[10px] font-medium text-text-mutedLight dark:text-text-mutedDark">
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-border-light dark:border-border-dark bg-[#FBFBFA] dark:bg-[#161816] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {event.primary_source_url && (
              <a
                href={event.primary_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white dark:bg-zinc-800 border border-border-light dark:border-border-dark text-xs font-medium text-text-primaryLight dark:text-text-primaryDark hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <span>View Original Live Source</span>
                <ExternalLink className="w-3 h-3 text-text-mutedLight dark:text-text-mutedDark" />
              </a>
            )}

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white dark:bg-zinc-800 border border-border-light dark:border-border-dark text-xs font-medium text-text-primaryLight dark:text-text-primaryDark hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3 text-text-mutedLight dark:text-text-mutedDark" />}
              <span>{copied ? 'Copied Brief' : 'Share Brief'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/pulse?q=${encodeURIComponent(`Analyze the real-time implications and technical breakdown of: "${event.title}"`)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Pulse AI</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
