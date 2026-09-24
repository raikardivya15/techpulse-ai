'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, Search, Bell, Moon, Sun, 
  Sparkles, Compass, Bookmark, ShieldAlert,
  ChevronRight, User as UserIcon, LogOut, Settings, X, Smartphone
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRealtime } from '@/lib/realtime-context';
import { InstallAppModal } from './InstallAppModal';

export function Navbar() {
  const { user, darkMode, toggleDarkMode, logout } = useAuth();
  const { connectionStatus, unreadCount, simulateSignal } = useRealtime();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    await simulateSignal();
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-[8px] bg-accent dark:bg-accent-dark text-white dark:text-[#0D0E0D] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <Activity className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="brand-logo text-sm font-semibold tracking-tight text-text-primaryLight dark:text-text-primaryDark">
                TECHPULSE
              </span>
            </Link>
          </div>

          {/* Prominent Desktop Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <form action="/discover" method="GET" className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-mutedLight dark:text-text-mutedDark" />
              <input
                type="text"
                name="query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technology, topics, companies..."
                className="w-full pl-9 pr-12 py-1.5 text-xs rounded-[8px] bg-canvas-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primaryLight dark:text-text-primaryDark placeholder-text-mutedLight dark:placeholder-text-mutedDark focus:outline-none focus:border-accent dark:focus:border-accent-dark focus:bg-white dark:focus:bg-card-dark transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-mutedLight dark:text-text-mutedDark px-1.5 py-0.5 rounded bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                ⌘ K
              </span>
            </form>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-[8px] text-text-secondaryLight dark:text-text-secondaryDark hover:bg-canvas-light dark:hover:bg-card-dark"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Get Mobile App Button */}
            <button
              onClick={() => setShowInstallModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-canvas-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-sage-light/40 dark:hover:border-sage-dark/40 text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-all"
              title="Download & Install TechPulse on your phone"
            >
              <Smartphone className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
              <span className="hidden xl:inline">Get App</span>
            </button>

            {/* Live Telemetry Radar Status Indicator & Simulation Trigger */}
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-canvas-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-sage-light/40 dark:hover:border-sage-dark/40 text-[11px] font-mono text-text-secondaryLight dark:text-text-secondaryDark transition-all"
              title="Click to simulate an instant incoming radar signal"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-sage-light dark:bg-sage-dark animate-pulse' : 'bg-zinc-400'
              }`} />
              <span>{isSimulating ? 'Simulating...' : 'Simulate Signal'}</span>
            </button>

            {/* Ask Pulse Quick Button */}
            <Link
              href="/pulse"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Pulse</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-[8px] text-text-secondaryLight dark:text-text-secondaryDark hover:bg-canvas-light dark:hover:bg-card-dark border border-transparent hover:border-border-light dark:hover:border-border-dark transition-all"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-sage-dark" /> : <Moon className="w-4 h-4 text-text-secondaryLight" />}
            </button>

            {/* Realtime Notifications Bell */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-[8px] text-text-secondaryLight dark:text-text-secondaryDark hover:bg-canvas-light dark:hover:bg-card-dark border border-transparent hover:border-border-light dark:border-border-dark transition-all"
              title="Intelligent Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 ? (
                <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-sage-light dark:bg-sage-dark text-white dark:text-[#0D0E0D] text-[9px] font-mono font-bold flex items-center justify-center animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                connectionStatus === 'connected' && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sage-light dark:bg-sage-dark" />
                )
              )}
            </Link>

            {/* User Profile / Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-[8px] hover:bg-canvas-light dark:hover:bg-card-dark border border-transparent hover:border-border-light dark:hover:border-border-dark transition-all"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-border-light dark:ring-border-dark"
                  />
                  <span className="text-xs font-medium text-text-primaryLight dark:text-text-primaryDark hidden md:inline">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-[10px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-3 py-2 border-b border-border-light dark:border-border-dark mb-1">
                      <p className="text-xs font-semibold text-text-primaryLight dark:text-text-primaryDark">{user.name}</p>
                      <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark border border-accent/20 dark:border-accent-dark/20">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs text-text-primaryLight dark:text-text-primaryDark hover:bg-canvas-light dark:hover:bg-surface-dark transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-text-secondaryLight dark:text-text-secondaryDark" />
                      <span>Settings & Preferences</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs text-text-primaryLight dark:text-text-primaryDark hover:bg-canvas-light dark:hover:bg-surface-dark transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-text-secondaryLight dark:text-text-secondaryDark" />
                      <span>Admin Observability</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs text-semantic-alert hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-[8px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-xs font-semibold shadow-xs transition-all"
              >
                Sign In
              </Link>
            )}

          </div>

        </div>

        {/* Mobile Expandable Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-3 py-2 border-t border-border-light dark:border-border-dark bg-canvas-light dark:bg-surface-dark flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
            <form action="/discover" method="GET" className="flex-1 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-mutedLight dark:text-text-mutedDark" />
              <input
                type="text"
                name="query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technology, topics, companies..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[8px] bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primaryLight dark:text-text-primaryDark focus:outline-none focus:border-accent dark:focus:border-accent-dark"
                autoFocus
              />
            </form>
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-1.5 text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      <InstallAppModal 
        isOpen={showInstallModal} 
        onClose={() => setShowInstallModal(false)} 
      />
    </>
  );
}

