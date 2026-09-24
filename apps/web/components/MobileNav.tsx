'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Sparkles, Bookmark, Bell } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Discover', href: '/discover', icon: Compass },
    { label: 'Pulse AI', href: '/pulse', icon: Sparkles },
    { label: 'Saved', href: '/library', icon: Bookmark },
    { label: 'Alerts', href: '/notifications', icon: Bell },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-border-light dark:border-border-dark py-1 px-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-[8px] transition-colors ${
                isActive
                  ? 'text-accent-textLight dark:text-accent-textDark font-semibold'
                  : 'text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.label === 'Alerts' && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent dark:bg-accent-dark" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

