'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Radio, Bell, X, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';
import { notificationApi, realtimeApi } from './api';

export interface LiveSignalEvent {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  primary_source_name: string;
  radar_section: string;
  published_at: string;
  tags: string[];
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
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

// Web Audio API Gentle Chime Synthesizer
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
    // Gentle dual-frequency tone
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    // Audio contexts might be blocked until user gesture, ignore silently
  }
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [liveSignals, setLiveSignals] = useState<LiveSignalEvent[]>([]);
  const [latestSignal, setLatestSignal] = useState<LiveSignalEvent | null>(null);
  const [activeToast, setActiveToast] = useState<LiveNotification | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial notifications
  const refreshNotifications = useCallback(async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data || []);
      const unread = (data || []).filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load initial notifications', err);
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (activeToast?.id === id) {
        setActiveToast(null);
      }
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const dismissToast = () => {
    setActiveToast(null);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  };

  const showNotificationToast = (notif: LiveNotification) => {
    setActiveToast(notif);
    playSubtleChime();

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    // Auto-dismiss toast after 7 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 7000);
  };

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setConnectionStatus('connecting');

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/live';

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        console.log('⚡ Connected to TechPulse AI Realtime WebSocket Hub');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'NEW_SIGNAL') {
            const signal: LiveSignalEvent = data.event;
            const notif: LiveNotification | null = data.notification;

            // Ingest new signal into live feed
            if (signal) {
              setLatestSignal(signal);
              setLiveSignals(prev => [signal, ...prev.slice(0, 19)]);
            }

            // Ingest new notification and display toast
            if (notif) {
              setNotifications(prev => [notif, ...prev]);
              setUnreadCount(prev => prev + 1);
              showNotificationToast(notif);
            }
          }
        } catch (err) {
          console.error('Error parsing realtime WebSocket payload:', err);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        wsRef.current = null;
        // Schedule auto-reconnect in 4 seconds
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 4000);
      };

      ws.onerror = (err) => {
        console.warn('Realtime WebSocket encountered error, reconnecting...', err);
        ws.close();
      };
    } catch (e) {
      setConnectionStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket, refreshNotifications]);

  const simulateSignal = async () => {
    try {
      await realtimeApi.simulateSignal();
    } catch (err) {
      console.error('Failed to trigger simulation:', err);
    }
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
      }}
    >
      {children}

      {/* Global Realtime Live Notification Toast */}
      {activeToast && (
        <div
          id="realtime-toast-container"
          className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-4 rounded-[10px] bg-card-light dark:bg-card-dark border border-sage-light/40 dark:border-sage-dark/40 shadow-xl space-y-2">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sage-light dark:bg-sage-dark animate-ping" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-sage-soft-light text-sage-text-light dark:bg-sage-soft-dark dark:text-sage-text-dark border border-sage-light/30 dark:border-sage-dark/30">
                  REALTIME RADAR SIGNAL
                </span>
                <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark">
                  Just now
                </span>
              </div>

              <button
                onClick={dismissToast}
                className="p-1 rounded-[6px] text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-canvas-light dark:hover:bg-surface-dark transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h4 className="card-title text-xs sm:text-sm text-text-primary-light dark:text-text-primary-dark font-semibold">
                {activeToast.title}
              </h4>
              <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5 line-clamp-2 leading-relaxed">
                {activeToast.body}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-divider-light dark:border-divider-dark text-xs">
              <span className="text-[10px] font-mono text-text-secondary-light dark:text-text-secondary-dark">
                Source: Verified Collector
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => markAsRead(activeToast.id)}
                  className="text-[11px] text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
                >
                  Dismiss
                </button>

                {activeToast.deep_link && (
                  <Link
                    href={activeToast.deep_link}
                    onClick={dismissToast}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-[11px] font-medium shadow-xs transition-all"
                  >
                    <span>Read Signal</span>
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
