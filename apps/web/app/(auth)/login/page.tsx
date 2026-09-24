'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('divya@techpulse.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-[12px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
        
        {/* Brand Icon */}
        <div className="w-9 h-9 rounded-[8px] bg-sage-soft-light dark:bg-sage-soft-dark border border-sage-light/30 dark:border-sage-dark/30 text-sage-light dark:text-sage-dark flex items-center justify-center mb-5 shadow-xs">
          <Activity className="w-4 h-4" />
        </div>

        <h1 className="page-title text-text-primary-light dark:text-text-primary-dark mb-1">
          Welcome back to TechPulse
        </h1>
        <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark mb-6">
          Your personal AI radar for what is genuinely happening in technology.
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-[8px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1.5 font-mono">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark font-mono">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all mt-2"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In to Radar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-divider-light dark:border-divider-dark flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
          <span>Don&apos;t have an account?</span>
          <Link href="/signup" className="text-sage-text-light dark:text-sage-text-dark font-semibold hover:underline">
            Create account →
          </Link>
        </div>

      </div>
    </div>
  );
}
