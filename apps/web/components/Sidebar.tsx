'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Compass, Users, Bookmark, 
  Sparkles, Rocket, Code2, BookOpen,
  Settings, Sun, Moon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useAuth();

  const mainLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Discover', href: '/discover', icon: Compass },
    { label: 'Following', href: '/library', icon: Users },
    { label: 'Saved', href: '/library?tab=saved', icon: Bookmark },
  ];

  const intelligenceLinks = [
    { label: 'AI Pulse', href: '/pulse', icon: Sparkles },
    { label: 'Startups', href: '/discover?category=Startups', icon: Rocket },
    { label: 'Developer', href: '/discover?category=Developer+Tools', icon: Code2 },
    { label: 'Research', href: '/discover?category=AI+Research', icon: BookOpen },
  ];

  const systemLinks = [
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-border-light dark:border-border-dark sticky top-14 h-[calc(100vh-3.5rem)] py-4 px-3 bg-canvas-light dark:bg-canvas-dark shrink-0 justify-between">
      
      <div>
        {/* Main Navigation */}
      <div className="space-y-0.5">
        {mainLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[8px] text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-sage-soft-light dark:bg-sage-soft-dark text-sage-text-light dark:text-sage-text-dark font-semibold'
                  : 'text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-card-hoverLight dark:hover:bg-card-hoverDark'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sage-text-light dark:text-sage-text-dark' : 'text-text-mutedLight dark:text-text-mutedDark'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-divider-light dark:border-divider-dark" />

      {/* Domain Streams */}
      <div className="space-y-0.5">
        {intelligenceLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[8px] text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-sage-soft-light dark:bg-sage-soft-dark text-sage-text-light dark:text-sage-text-dark font-semibold'
                  : 'text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-card-hoverLight dark:hover:bg-card-hoverDark'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sage-text-light dark:text-sage-text-dark' : 'text-text-mutedLight dark:text-text-mutedDark'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        </div>
      </div>

      {/* System Links & Theme Change Option */}
      <div className="pt-2 border-t border-divider-light dark:border-divider-dark space-y-1">
        
        {/* Theme Change Option (placed above Settings) */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[8px] text-xs font-medium text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-card-hoverLight dark:hover:bg-card-hoverDark transition-colors group"
          title={`Switch to ${darkMode ? 'Light' : 'Dark'} mode`}
        >
          <div className="flex items-center gap-2.5">
            {darkMode ? (
              <Sun className="w-4 h-4 text-sage-dark shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-text-mutedLight dark:text-text-mutedDark shrink-0" />
            )}
            <span>Theme: {darkMode ? 'Dark' : 'Light'}</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-mutedLight dark:text-text-mutedDark">
            {darkMode ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Settings Option */}
        {systemLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[8px] text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-sage-soft-light dark:bg-sage-soft-dark text-sage-text-light dark:text-sage-text-dark font-semibold'
                  : 'text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-card-hoverLight dark:hover:bg-card-hoverDark'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sage-text-light dark:text-sage-text-dark' : 'text-text-mutedLight dark:text-text-mutedDark'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

    </aside>
  );
}
