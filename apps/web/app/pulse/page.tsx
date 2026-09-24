'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, Send, Bot, User as UserIcon, 
  ExternalLink, Layers, ShieldCheck, RefreshCw
} from 'lucide-react';
import { aiApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ title: string; source: string; url?: string }>;
  timestamp: string;
}

function PulseChatContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'Divya'}. I am Pulse, your real-time technology intelligence assistant.\n\nI continuously monitor verified developer sources (Hacker News, GitHub, Reddit, arXiv, YC) and ground my responses strictly in evidence.\n\nHow can I help you navigate the technology ecosystem today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputMessage, setInputMessage] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "What's happening in AI today?",
    "Why is MCP trending?",
    "What should I learn this week?",
    "Compare top agent memory frameworks",
    "Summarize today's biggest startup launches"
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageToSend = inputMessage) => {
    if (!messageToSend.trim() || isGenerating) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsGenerating(true);

    try {
      const res = await aiApi.chat(messageToSend, messages);
      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: res.response,
        citations: res.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I encountered an issue connecting to the knowledge index. Please check your connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-3xl mx-auto p-4 sm:p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-divider-light dark:border-divider-dark shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-text-primaryLight dark:text-text-primaryDark flex items-center gap-1.5">
              <span>Pulse AI Assistant</span>
              <span className="text-[10px] tech-mono px-1.5 py-0.2 rounded bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark border border-accent/20 dark:border-accent-dark/20">
                Grounding Active
              </span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 rounded-[6px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-[6px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-accent-textLight dark:text-accent-textDark flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div className="max-w-[88%] sm:max-w-[80%] space-y-1.5">
              <div
                className={`p-3.5 rounded-[10px] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-accent dark:bg-accent-dark text-white dark:text-[#0D0E0D] font-medium rounded-tr-none shadow-xs'
                    : 'bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primaryLight dark:text-text-primaryDark rounded-tl-none shadow-xs'
                }`}
              >
                {m.content}
              </div>

              {/* Citations Box for Assistant */}
              {m.citations && m.citations.length > 0 && (
                <div className="p-2.5 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs space-y-1">
                  <div className="flex items-center gap-1 text-[10px] tech-mono text-text-mutedLight dark:text-text-mutedDark uppercase font-semibold">
                    <ShieldCheck className="w-3 h-3 text-semantic-rising dark:text-semantic-risingDark" />
                    <span>Evidence Citations:</span>
                  </div>
                  <div className="space-y-0.5">
                    {m.citations.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-text-secondaryLight dark:text-text-secondaryDark truncate pr-2">
                          • {c.title}
                        </span>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-textLight dark:text-accent-textDark font-medium hover:underline shrink-0 flex items-center gap-0.5 text-[10px] tech-mono"
                          >
                            <span>Source</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className="block text-[10px] tech-mono text-text-mutedLight dark:text-text-mutedDark px-1">
                {m.timestamp}
              </span>
            </div>

            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-[6px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center text-text-secondaryLight dark:text-text-secondaryDark shrink-0 mt-0.5">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-2 items-center text-xs text-text-mutedLight dark:text-text-mutedDark italic tech-mono">
            <div className="w-6 h-6 rounded-[6px] bg-canvas-light dark:bg-surface-dark flex items-center justify-center text-accent">
              <Sparkles className="w-3 h-3 animate-spin" />
            </div>
            <span>Pulse is retrieving verified signals...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="pt-2 pb-2.5 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
        {samplePrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-[6px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-[11px] text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors shrink-0 whitespace-nowrap shadow-xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Pulse what's happening in AI, frameworks, or research..."
          className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-[8px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primaryLight dark:text-text-primaryDark placeholder-text-mutedLight dark:placeholder-text-mutedDark focus:outline-none focus:border-accent dark:focus:border-accent-dark shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isGenerating}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-[6px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] disabled:opacity-40 transition-all shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}

export default function PulseChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-mutedLight dark:text-text-mutedDark">Loading Pulse AI...</div>}>
      <PulseChatContent />
    </Suspense>
  );
}

