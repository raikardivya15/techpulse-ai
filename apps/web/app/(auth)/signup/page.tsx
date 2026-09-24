'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must accept the terms of service.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signup(name, email, password);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-[12px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
        
        <div className="w-9 h-9 rounded-[8px] bg-sage-soft-light dark:bg-sage-soft-dark border border-sage-light/30 dark:border-sage-dark/30 text-sage-light dark:text-sage-dark flex items-center justify-center mb-5 shadow-xs">
          <Activity className="w-4 h-4" />
        </div>

        <h1 className="page-title text-text-primary-light dark:text-text-primary-dark mb-1">
          Create your AI radar
        </h1>
        <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark mb-6">
          Set up automated monitoring across 8+ technology sources tuned to your role.
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-[8px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1.5 font-mono">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Divya Raikar"
              required
              className="w-full px-3.5 py-2 text-xs rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1.5 font-mono">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="divya@company.com"
              required
              className="w-full px-3.5 py-2 text-xs rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1.5 font-mono">
              Password (min 8 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded-[4px] border-border-light dark:border-border-dark text-sage-light dark:text-sage-dark focus:ring-0"
            />
            <label htmlFor="terms" className="body-text text-[11px] text-text-muted-light dark:text-text-muted-dark">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all mt-2"
          >
            <span>{isLoading ? 'Creating Account...' : 'Continue to Personalization'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-divider-light dark:border-divider-dark flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
          <span>Already have an account?</span>
          <Link href="/login" className="text-sage-text-light dark:text-sage-text-dark font-semibold hover:underline">
            Sign in →
          </Link>
        </div>

      </div>
    </div>
  );
}
