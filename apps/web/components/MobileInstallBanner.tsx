'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles, Share, PlusSquare } from 'lucide-react';
import { InstallAppModal } from './InstallAppModal';

export function MobileInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|iphone|ipad|ipod|windows phone/i.test(userAgent);
      setIsMobile(isMobileDevice);

      // Check if already running as standalone PWA
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
      setIsStandalone(isPWA);
    };

    checkMobile();

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsDismissed(true);
      }
    } else {
      // Open our rich platform modal
      setIsModalOpen(true);
    }
  };

  // Do not show if running standalone or dismissed or not on mobile screen
  if (isStandalone || isDismissed) {
    return (
      <InstallAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    );
  }

  return (
    <>
      <div className="md:hidden fixed bottom-14 left-3 right-3 z-40 p-2.5 rounded-[10px] bg-white/95 dark:bg-[#151715]/95 backdrop-blur-md border border-accent/30 dark:border-accent-dark/30 shadow-lg flex items-center justify-between gap-2.5 animate-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-[8px] bg-accent dark:bg-accent-dark text-white dark:text-[#0D0E0D] flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
            TP
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-text-primaryLight dark:text-text-primaryDark truncate">
              Install TechPulse App
            </p>
            <p className="text-[10px] text-text-secondaryLight dark:text-text-secondaryDark truncate">
              Real-time intelligence on your home screen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-[6px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Install</span>
          </button>
          
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-[6px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <InstallAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
