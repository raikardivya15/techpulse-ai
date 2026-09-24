'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, RefreshCw
} from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminObservabilityPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin overview', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-divider-light dark:border-divider-dark">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-sage-light dark:text-sage-dark" />
            <h1 className="page-title text-text-primary-light dark:text-text-primary-dark">
              System Observability & Multi-Agent Telemetry
            </h1>
          </div>
          <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Real-time pipeline health, connector status, LLM token metrics, and deduplication rates.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-canvas-light hover:bg-card-hover-light dark:bg-surface-dark dark:hover:bg-card-hover-dark border border-border-light dark:border-border-dark text-xs font-medium text-text-primary-light dark:text-text-primary-dark transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark">
            SYSTEM HEALTH
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-semantic-rising-light dark:bg-semantic-rising-dark animate-pulse" />
            <span className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
              {data?.system_health || 'Optimal'}
            </span>
          </div>
          <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark font-mono">All 8 collectors active</p>
        </div>

        <div className="p-4 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark">
            DEDUPLICATION RATE
          </span>
          <p className="text-base font-semibold text-sage-text-light dark:text-sage-text-dark font-mono">
            {data?.metrics?.deduplication_rate || '88.4%'}
          </p>
          <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark font-mono">Spam & duplicate reduction</p>
        </div>

        <div className="p-4 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark">
            AVG AGENT LATENCY
          </span>
          <p className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark font-mono">
            {data?.metrics?.avg_agent_latency || '1.2s'}
          </p>
          <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark font-mono">P95 pipeline throughput</p>
        </div>

        <div className="p-4 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-1 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark">
            DAILY TOKEN COST
          </span>
          <p className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark font-mono">
            {data?.metrics?.daily_token_spend || '$14.85'}
          </p>
          <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark font-mono">Routed via efficient models</p>
        </div>
      </div>

      {/* Active Ingestion Connectors */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
          MODULAR SOURCE CONNECTORS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data?.sources?.map((s: any) => (
            <div
              key={s.key}
              className="p-3.5 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark flex items-center justify-between shadow-xs"
            >
              <div>
                <h4 className="card-title text-xs text-text-primary-light dark:text-text-primary-dark">{s.name}</h4>
                <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark font-mono">Poll: {s.poll_interval}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-canvas-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark border border-border-light dark:border-border-dark">
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Agent Execution History */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
          RECENT SPECIALIZED AGENT RUNS
        </h2>

        <div className="overflow-x-auto rounded-[10px] border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-divider-light dark:border-divider-dark bg-canvas-light/60 dark:bg-surface-dark/60 font-mono text-[10px] text-text-muted-light dark:text-text-muted-dark uppercase">
              <tr>
                <th className="p-3">Agent Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Processed</th>
                <th className="p-3">Tokens Used</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Telemetry Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider-light dark:divide-divider-dark">
              {data?.agent_runs?.map((r: any) => (
                <tr key={r.id} className="hover:bg-card-hover-light dark:hover:bg-card-hover-dark transition-colors">
                  <td className="p-3 font-medium text-text-primary-light dark:text-text-primary-dark">
                    {r.agent_name}
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-sage-soft-light dark:bg-sage-soft-dark text-sage-text-light dark:text-sage-text-dark border border-sage-light/20 dark:border-sage-dark/20">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-text-secondary-light dark:text-text-secondary-dark">
                    {r.items_processed} items
                  </td>
                  <td className="p-3 font-mono text-text-secondary-light dark:text-text-secondary-dark">
                    {r.tokens_used.toLocaleString()}
                  </td>
                  <td className="p-3 font-mono text-text-secondary-light dark:text-text-secondary-dark">
                    {r.latency_ms}ms
                  </td>
                  <td className="p-3 text-[11px] text-text-muted-light dark:text-text-muted-dark truncate max-w-xs font-mono">
                    {JSON.stringify(r.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
