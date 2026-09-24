'use client';

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Download, X, Check, 
  Share2, Apple, Laptop, Copy, Monitor, Sparkles, Terminal
} from 'lucide-react';

export function InstallAppModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'mac' | 'windows' | 'expo'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  const localIpUrl = 'http://192.168.1.5:3000';
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : localIpUrl;

  useEffect(() => {
    // Detect OS if available
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) setPlatform('ios');
      else if (/android/.test(ua)) setPlatform('android');
      else if (/macintosh|mac os x/.test(ua)) setPlatform('mac');
      else if (/windows/.test(ua)) setPlatform('windows');
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      alert('To install TechPulse:\n- On Mac Safari: File -> Add to Dock\n- On Windows Edge: Settings -> Apps -> Install this site as an app\n- On Android: Menu -> Install app\n- On iPhone: Share -> Add to Home Screen');
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(localIpUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-[12px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-divider-light dark:border-divider-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-sage-soft-light dark:bg-sage-soft-dark border border-sage-light/30 dark:border-sage-dark/30 text-sage-light dark:text-sage-dark flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="card-title text-sm sm:text-base text-text-primary-light dark:text-text-primary-dark">
                Download & Install TechPulse AI
              </h3>
              <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark font-mono">
                Native multi-platform support across iOS, Android, macOS & Windows
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-canvas-light dark:hover:bg-surface-dark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Platform Selection Tabs */}
        <div className="grid grid-cols-5 gap-1.5 p-1 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs">
          <button
            onClick={() => setPlatform('ios')}
            className={`py-1.5 px-2 text-center rounded-[6px] transition-all font-medium flex items-center justify-center gap-1 ${
              platform === 'ios'
                ? 'bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark shadow-xs font-semibold'
                : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">iOS</span>
          </button>

          <button
            onClick={() => setPlatform('android')}
            className={`py-1.5 px-2 text-center rounded-[6px] transition-all font-medium flex items-center justify-center gap-1 ${
              platform === 'android'
                ? 'bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark shadow-xs font-semibold'
                : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android</span>
          </button>

          <button
            onClick={() => setPlatform('mac')}
            className={`py-1.5 px-2 text-center rounded-[6px] transition-all font-medium flex items-center justify-center gap-1 ${
              platform === 'mac'
                ? 'bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark shadow-xs font-semibold'
                : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">macOS</span>
          </button>

          <button
            onClick={() => setPlatform('windows')}
            className={`py-1.5 px-2 text-center rounded-[6px] transition-all font-medium flex items-center justify-center gap-1 ${
              platform === 'windows'
                ? 'bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark shadow-xs font-semibold'
                : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Windows</span>
          </button>

          <button
            onClick={() => setPlatform('expo')}
            className={`py-1.5 px-2 text-center rounded-[6px] transition-all font-medium flex items-center justify-center gap-1 ${
              platform === 'expo'
                ? 'bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark shadow-xs font-semibold'
                : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expo</span>
          </button>
        </div>

        {/* TAB 1: iOS */}
        {platform === 'ios' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-2">
              <span className="text-[11px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark font-semibold">
                1. Open Safari on iPhone / iPad:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={localIpUrl}
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-[6px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark"
                />
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium transition-all"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 text-xs">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
                <span>2. Install as Standalone iOS App:</span>
              </h4>
              <ol className="space-y-1.5 text-[11px] text-text-secondary-light dark:text-text-secondary-dark list-decimal list-inside leading-relaxed">
                <li>Tap the <strong>Share</strong> button (⎋ icon in bottom Safari bar).</li>
                <li>Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong> ⊞.</li>
                <li>Tap <strong>&quot;Add&quot;</strong> in top right. TechPulse will launch full-screen from your home screen.</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 2: Android */}
        {platform === 'android' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-2">
              <span className="text-[11px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark font-semibold">
                1. Open Chrome on Android:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={localIpUrl}
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-[6px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark"
                />
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium transition-all"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 text-xs">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
                <span>2. Install WebAPK on Android:</span>
              </h4>
              <ol className="space-y-1.5 text-[11px] text-text-secondary-light dark:text-text-secondary-dark list-decimal list-inside leading-relaxed">
                <li>Chrome will display a prompt: <strong>&quot;Install TechPulse&quot;</strong>.</li>
                <li>Or tap the 3-dot menu (⋮) in the top right &rarr; tap <strong>&quot;Install app&quot;</strong>.</li>
                <li>TechPulse installs natively with full background push notification support.</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 3: macOS */}
        {platform === 'mac' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="p-4 rounded-[8px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 text-xs">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
                <span>Install TechPulse as a macOS Desktop App:</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-text-secondary-light dark:text-text-secondary-dark list-disc list-inside leading-relaxed">
                <li><strong>Safari on macOS Sonoma+</strong>: Click <em>File &rarr; Add to Dock...</em> to create a standalone Mac app.</li>
                <li><strong>Chrome / Brave / Edge on Mac</strong>: Click the install icon (⊕) on the right side of the address bar &rarr; <em>Install TechPulse</em>.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-1.5 text-xs">
              <span className="text-[11px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark font-semibold">
                macOS Native Keyboard Shortcuts:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-secondary-light dark:text-text-secondary-dark">
                <div><kbd className="px-1.5 py-0.5 rounded bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">⌘ K</kbd> Global Search</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">⌘ P</kbd> Ask Pulse AI</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">⌘ J</kbd> Toggle Theme</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">⌘ S</kbd> Saved Library</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Windows */}
        {platform === 'windows' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="p-4 rounded-[8px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-2 text-xs">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
                <span>Install TechPulse as a Windows Desktop App:</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-text-secondary-light dark:text-text-secondary-dark list-disc list-inside leading-relaxed">
                <li><strong>Microsoft Edge on Windows</strong>: Click <em>Settings (...) &rarr; Apps &rarr; Install TechPulse</em>. Pin to Taskbar or Start Menu.</li>
                <li><strong>Google Chrome on Windows</strong>: Click the install icon (⊕) on the address bar &rarr; <em>Install TechPulse</em>.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-1.5 text-xs">
              <span className="text-[11px] font-mono uppercase text-text-muted-light dark:text-text-muted-dark font-semibold">
                Windows Keyboard Shortcuts:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-secondary-light dark:text-text-secondary-dark">
                <div><kbd className="px-1.5 py-0.5 rounded bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">Ctrl + K</kbd> Global Search</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">Ctrl + P</kbd> Ask Pulse AI</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">Ctrl + J</kbd> Toggle Theme</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">Ctrl + S</kbd> Saved Library</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Expo Native Project */}
        {platform === 'expo' && (
          <div className="space-y-3 animate-in fade-in duration-150 text-xs">
            <p className="body-text text-text-secondary-light dark:text-text-secondary-dark">
              TechPulse includes an Expo React Native mobile project inside <code className="font-mono text-sage-text-light dark:text-sage-text-dark">apps/mobile/</code>.
            </p>

            <div className="p-3.5 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-1 font-mono text-[11px]">
              <p className="text-text-muted-light dark:text-text-muted-dark"># Run Expo Mobile App (iOS / Android)</p>
              <p className="text-text-primary-light dark:text-text-primary-dark">cd apps/mobile</p>
              <p className="text-text-primary-light dark:text-text-primary-dark">npm install</p>
              <p className="text-text-primary-light dark:text-text-primary-dark">npx expo start</p>
            </div>

            <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark font-mono">
              Scan the QR code with <strong>Expo Go</strong> on your iPhone or Android phone to run natively with haptic feedback.
            </p>
          </div>
        )}

        {/* Install CTA for Desktop Browsers */}
        <button
          onClick={handleInstallPWA}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-semibold shadow-xs transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Launch Installation for Current Device</span>
        </button>

      </div>
    </div>
  );
}
