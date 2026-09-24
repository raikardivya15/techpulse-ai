import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { RealtimeProvider } from '@/lib/realtime-context';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { GlobalShortcuts } from '@/components/GlobalShortcuts';

export const metadata: Metadata = {
  title: 'TECHPULSE AI — Your AI Radar for What’s Happening in Technology',
  description: 'TechPulse continuously watches the technology ecosystem across Reddit, Hacker News, GitHub, arXiv, YC, and technical publications to tell you what actually matters.',
  keywords: ['AI radar', 'tech intelligence', 'AI agents', 'developer tools', 'hacker news', 'arXiv', 'startups'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
        {/* PWA Mobile & Desktop Web App Metas & Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D0E0D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TechPulse" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F9F9F7] dark:bg-[#0D0E0D] text-[#171717] dark:text-[#F4F4F1] font-sans transition-colors antialiased selection:bg-[#6FAF8A]/25 selection:text-[#356B4B] dark:selection:bg-[#8FC5A3]/25 dark:selection:text-[#B9DFC5]">
        <AuthProvider>
          <RealtimeProvider>
            <GlobalShortcuts />
            <Navbar />
            <div className="flex-1 flex max-w-7xl w-full mx-auto">
              <Sidebar />
              <main className="flex-1 min-w-0 pb-24 lg:pb-12 px-0 sm:px-2">
                {children}
              </main>
            </div>
            <MobileNav />
          </RealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


