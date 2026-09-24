'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Search, Sparkles, Sun, Moon, Bookmark, Compass, X } from 'lucide-react';

export function GlobalShortcuts() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useAuth();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // 1. Search: ⌘K or Ctrl+K
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }

      // 2. Pulse AI: ⌘P or Ctrl+P
      if (isCmdOrCtrl && e.key.toLowerCase() === 'p' && !e.shiftKey) {
        e.preventDefault();
        router.push('/pulse');
      }

      // 3. Toggle Theme: ⌘J or Ctrl+J
      if (isCmdOrCtrl && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggleDarkMode();
      }

      // 4. Saved Library: ⌘S or Ctrl+S
      if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        router.push('/library');
      }

      // 5. Escape: Close search modal
      if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, toggleDarkMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  if (!showSearchModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setShowSearchModal(false)}
    >
      <div 
        className="w-full max-w-xl rounded-[12px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-divider-light dark:border-divider-dark px-4 py-3">
          <Search className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technology vectors, topics, models, papers..."
            className="w-full text-sm bg-transparent border-none text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none"
            autoFocus
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
            ESC to close
          </span>
        </form>

        <div className="p-3 space-y-2 text-xs">
          <div className="text-[10px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark font-semibold px-2">
            Quick Navigation Shortcuts ({isMac ? 'macOS ⌘' : 'Windows Ctrl'})
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                router.push('/pulse');
                setShowSearchModal(false);
              }}
              className="p-2 rounded-[6px] flex items-center justify-between hover:bg-canvas-light dark:hover:bg-surface-dark text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
                <span className="text-text-primary-light dark:text-text-primary-dark">Ask Pulse AI</span>
              </div>
              <span className="font-mono text-[10px] text-text-muted-light dark:text-text-muted-dark">{isMac ? '⌘ P' : 'Ctrl+P'}</span>
            </button>

            <button
              onClick={() => {
                router.push('/discover');
                setShowSearchModal(false);
              }}
              className="p-2 rounded-[6px] flex items-center justify-between hover:bg-canvas-light dark:hover:bg-surface-dark text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
                <span className="text-text-primary-light dark:text-text-primary-dark">Ecosystem Radar</span>
              </div>
              <span className="font-mono text-[10px] text-text-muted-light dark:text-text-muted-dark">{isMac ? '⌘ D' : 'Ctrl+D'}</span>
            </button>

            <button
              onClick={() => {
                router.push('/library');
                setShowSearchModal(false);
              }}
              className="p-2 rounded-[6px] flex items-center justify-between hover:bg-canvas-light dark:hover:bg-surface-dark text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
                <span className="text-text-primary-light dark:text-text-primary-dark">Saved Library</span>
              </div>
              <span className="font-mono text-[10px] text-text-muted-light dark:text-text-muted-dark">{isMac ? '⌘ S' : 'Ctrl+S'}</span>
            </button>

            <button
              onClick={() => {
                toggleDarkMode();
                setShowSearchModal(false);
              }}
              className="p-2 rounded-[6px] flex items-center justify-between hover:bg-canvas-light dark:hover:bg-surface-dark text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                {darkMode ? <Sun className="w-3.5 h-3.5 text-sage-dark" /> : <Moon className="w-3.5 h-3.5 text-text-secondary-light" />}
                <span className="text-text-primary-light dark:text-text-primary-dark">Toggle Theme</span>
              </div>
              <span className="font-mono text-[10px] text-text-muted-light dark:text-text-muted-dark">{isMac ? '⌘ J' : 'Ctrl+J'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
