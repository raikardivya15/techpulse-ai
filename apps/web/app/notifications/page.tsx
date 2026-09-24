'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, ArrowRight, Zap, Radio, RefreshCw } from 'lucide-react';
import { useRealtime } from '@/lib/realtime-context';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, simulateSignal, connectionStatus, refreshNotifications } = useRealtime();
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    await simulateSignal();
    setTimeout(() => setIsSimulating(false), 800);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshNotifications();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-divider-light dark:border-divider-dark">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title text-text-primary-light dark:text-text-primary-dark">
              Intelligent Radar Notifications
            </h1>
            <span className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-sage-soft-light dark:bg-sage-soft-dark text-sage-text-light dark:text-sage-text-dark border border-sage-light/30 dark:border-sage-dark/30">
              <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-sage-light dark:bg-sage-dark animate-pulse' : 'bg-zinc-400'}`} />
              <span>{connectionStatus === 'connected' ? 'WebSocket Live' : 'Connecting...'}</span>
            </span>
          </div>
          <p className="body-text text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Optimized strictly for usefulness over frequency. Zero noise alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Simulate Live Signal'}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-[8px] border border-border-light dark:border-border-dark hover:bg-card-hover-light dark:hover:bg-card-hover-dark text-text-secondary-light dark:text-text-secondary-dark"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Realtime Stream Statistics Bar */}
      <div className="p-3 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
          <Radio className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark animate-pulse" />
          <span>Multi-agent filtering: 8 sources monitored in real-time</span>
        </div>
        <span className="text-text-muted-light dark:text-text-muted-dark">
          Unread: <strong className="text-text-primary-light dark:text-text-primary-dark">{unreadCount}</strong>
        </span>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            return (
              <div
                key={n.id}
                className={`p-4 rounded-[10px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  n.is_read
                    ? 'bg-canvas-light/50 dark:bg-surface-dark/50 border-border-light dark:border-border-dark opacity-70'
                    : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark shadow-xs'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">
                      {n.category}
                    </span>
                    {!n.is_read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-light dark:bg-sage-dark animate-ping" />
                    )}
                    <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark">
                      {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>

                  <h3 className="card-title text-sm sm:text-base text-text-primary-light dark:text-text-primary-dark">
                    {n.title}
                  </h3>

                  <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {n.body}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="px-3 py-1.5 rounded-[8px] border border-border-light dark:border-border-dark text-[11px] font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
                    >
                      Mark read
                    </button>
                  )}

                  {n.deep_link && (
                    <Link
                      href={n.deep_link}
                      onClick={() => markAsRead(n.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-xs">
          <Bell className="w-6 h-6 text-text-muted-light dark:text-text-muted-dark mx-auto" />
          <h3 className="card-title text-text-primary-light dark:text-text-primary-dark">
            Your radar is quiet
          </h3>
          <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark max-w-sm mx-auto">
            We are continuously watching the ecosystem. You will only receive notifications when something genuinely worth your attention occurs.
          </p>
          <button
            onClick={handleSimulate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all mt-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Incoming Signal</span>
          </button>
        </div>
      )}

    </div>
  );
}
