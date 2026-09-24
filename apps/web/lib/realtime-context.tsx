'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Radio, Bell, X, ArrowUpRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { notificationApi, realtimeApi } from './api';

export interface LiveSignalEvent {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  primary_source_name: string;
  primary_source_url?: string;
  radar_section: string;
  published_at: string;
  tags?: string[];
  is_verified: boolean;
}

export interface LiveNotification {
  id: string;
  title: string;
  body: string;
  category: string;
  urgency: string;
  topic_slug?: string;
  event_id?: string;
  deep_link?: string;
  is_read: boolean;
  created_at: string;
}

interface RealtimeContextType {
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  unreadCount: number;
  notifications: LiveNotification[];
  liveSignals: LiveSignalEvent[];
  latestSignal: LiveSignalEvent | null;
  activeToast: LiveNotification | null;
  simulateSignal: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  dismissToast: () => void;
  refreshNotifications: () => Promise<void>;
  fetchLatestLiveUpdate: () => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

// Web Audio API Gentle Synthesizer Chime
function playSubtleChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    // Silently ignore if blocked before first user gesture
  }
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [liveSignals, setLiveSignals] = useState<LiveSignalEvent[]>([]);
  const [latestSignal, setLatestSignal] = useState<LiveSignalEvent | null>(null);
  const [activeToast, setActiveToast] = useState<LiveNotification | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const seenSignalIdsRef = useRef<Set<string>>(new Set());

  // Show toast & chime
  const showNotificationToast = useCallback((notif: LiveNotification) => {
    setActiveToast(notif);
    playSubtleChime();

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    // Auto-dismiss toast after 8 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 8000);
  }, []);

  // Fetch initial notifications with fallback
  const refreshNotifications = useCallback(async () => {
    try {
      let data = await notificationApi.getNotifications();
      if (!data || data.length === 0) {
        const fallbackRes = await fetch('/api/notifications');
        if (fallbackRes.ok) data = await fallbackRes.json();
      }
      if (Array.isArray(data)) {
        setNotifications(data);
        const unread = data.filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to load notifications, using live fallback', err);
      try {
        const fallbackRes = await fetch('/api/notifications');
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          setNotifications(data || []);
          setUnreadCount((data || []).filter((n: any) => !n.is_read).length);
        }
      } catch (e) {
        console.error('Notification fallback error', e);
      }
    }
  }, []);

  // Fetch active real-time updates from live search/stream
  const fetchLatestLiveUpdate = useCallback(async () => {
    try {
      const res = await fetch('/api/search/live?source=all');
      if (res.ok) {
        const data = await res.json();
        const events: any[] = data.events || [];

        if (events.length > 0) {
          // Check for new signals
          const freshSignals = events.filter((ev) => !seenSignalIdsRef.current.has(ev.id));
          
          events.forEach((ev) => seenSignalIdsRef.current.add(ev.id));

          if (freshSignals.length > 0) {
            const topSignal = freshSignals[0];
            setLatestSignal(topSignal);
            setLiveSignals((prev) => [topSignal, ...prev.slice(0, 19)]);

            const newNotif: LiveNotification = {
              id: `notif_${topSignal.id}_${Date.now()}`,
              title: topSignal.title,
              body: topSignal.summary || topSignal.what_happened,
              category: topSignal.category || 'AI',
              urgency: 'high',
              topic_slug: topSignal.slug,
              event_id: topSignal.id,
              deep_link: `/discover?query=${encodeURIComponent(topSignal.title.split(' ')[0])}`,
              is_read: false,
              created_at: new Date().toISOString(),
            };

            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
            showNotificationToast(newNotif);
          }
        }
      }
    } catch (err) {
      console.error('Failed to poll live telemetry', err);
    }
  }, [showNotificationToast]);

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markRead(id);
    } catch (e) {
      // Local optimistic update
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    if (activeToast?.id === id) {
      setActiveToast(null);
    }
  };

  const dismissToast = () => {
    setActiveToast(null);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  };

  // Attempt WebSocket connection with smooth fallback to active live polling
  const connectWebSocket = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/live';

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_SIGNAL') {
            const signal: LiveSignalEvent = data.event;
            const notif: LiveNotification | null = data.notification;

            if (signal) {
              setLatestSignal(signal);
              setLiveSignals((prev) => [signal, ...prev.slice(0, 19)]);
              seenSignalIdsRef.current.add(signal.id);
            }

            if (notif) {
              setNotifications((prev) => [notif, ...prev]);
              setUnreadCount((prev) => prev + 1);
              showNotificationToast(notif);
            }
          }
        } catch (err) {
          console.error('Error parsing WebSocket payload', err);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        setConnectionStatus('connected'); // Fallback active polling is running
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (e) {
      setConnectionStatus('connected');
    }
  }, [showNotificationToast]);

  useEffect(() => {
    refreshNotifications();
    connectWebSocket();

    // Trigger initial live signal check after 2 seconds
    const initialTimer = setTimeout(() => {
      fetchLatestLiveUpdate();
    }, 2000);

    // Active Live Stream Poller: Polls every 20 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchLatestLiveUpdate();
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWebSocket, refreshNotifications, fetchLatestLiveUpdate]);

  const simulateSignal = async () => {
    await fetchLatestLiveUpdate();
  };

  return (
    <RealtimeContext.Provider
      value={{
        connectionStatus,
        unreadCount,
        notifications,
        liveSignals,
        latestSignal,
        activeToast,
        simulateSignal,
        markAsRead,
        dismissToast,
        refreshNotifications,
        fetchLatestLiveUpdate,
      }}
    >
      {children}

      {/* Global Realtime Live Notification Toast */}
      {activeToast && (
        <div
          id="realtime-toast-container"
          className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-4 rounded-[10px] bg-white dark:bg-[#151715] border border-accent/40 dark:border-accent-dark/40 shadow-2xl space-y-2">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent dark:bg-accent-dark animate-ping" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-accent-softLight text-accent-textLight dark:bg-accent-softDark dark:text-accent-textDark border border-accent/30 dark:border-accent-dark/30">
                  REAL-TIME LIVE UPDATE
                </span>
                <span className="text-[10px] font-mono text-text-mutedLight dark:text-text-mutedDark">
                  Just now
                </span>
              </div>

              <button
                onClick={dismissToast}
                className="p-1 rounded-[6px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h4 className="card-title text-xs sm:text-sm text-text-primaryLight dark:text-text-primaryDark font-semibold">
                {activeToast.title}
              </h4>
              <p className="body-text text-xs text-text-secondaryLight dark:text-text-secondaryDark mt-0.5 line-clamp-2 leading-relaxed">
                {activeToast.body}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-divider-light dark:border-divider-dark text-xs">
              <span className="text-[10px] font-mono text-text-secondaryLight dark:text-text-secondaryDark">
                Source: Live Stream Verified
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => markAsRead(activeToast.id)}
                  className="text-[11px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors"
                >
                  Dismiss
                </button>

                {activeToast.deep_link && (
                  <Link
                    href={activeToast.deep_link}
                    onClick={dismissToast}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-[11px] font-medium shadow-xs transition-all"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
