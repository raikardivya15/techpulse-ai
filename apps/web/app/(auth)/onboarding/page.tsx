'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [role, setRole] = useState('AI Engineer');
  const [customRole, setCustomRole] = useState('');
  const [interests, setInterests] = useState<string[]>([
    'AI', 'Generative AI', 'AI Agents', 'LLMs', 'RAG', 'Developer Tools'
  ]);
  const [skillLevel, setSkillLevel] = useState('Advanced');
  const [sources, setSources] = useState<string[]>([
    'hacker_news', 'github', 'reddit', 'arxiv', 'yc', 'product_hunt', 'blogs'
  ]);
  const [notificationFrequency, setNotificationFrequency] = useState('Important');
  const [notificationTiming, setNotificationTiming] = useState('Morning');
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');

  const toggleInterest = (item: string) => {
    setInterests(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleSource = (src: string) => {
    setSources(prev => 
      prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
    );
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await authApi.onboarding({
        role: role === 'Other' && customRole ? customRole : role,
        custom_role: customRole,
        interests,
        skill_level: skillLevel,
        sources,
        notification_frequency: notificationFrequency,
        notification_timing: notificationTiming,
        quiet_hours_start: quietHoursStart,
        quiet_hours_end: quietHoursEnd
      });
      updateUser({ role, onboarding_completed: true });
      router.push('/');
    } catch (err) {
      console.error('Failed to complete onboarding', err);
      router.push('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 sm:p-10 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
        
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
            <span>STEP {step} OF 6</span>
            <span className="font-bold text-zinc-900 dark:text-white">{Math.round((step / 6) * 100)}% COMPLETE</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div 
              className="h-full bg-zinc-900 dark:bg-white transition-all duration-300 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1 — WHAT DO YOU DO? */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white editorial-title">
                What is your primary role?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                TechPulse calibrates technical depth and relevance based on your day-to-day work.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                'AI Engineer', 'Software Engineer', 'Founder', 
                'Product Manager', 'Researcher', 'DevOps / Infra',
                'Designer', 'Investor', 'Student', 'Other'
              ].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                    role === r
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            {role === 'Other' && (
              <input
                type="text"
                placeholder="Specify your custom role..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            )}
          </div>
        )}

        {/* STEP 2 — INTERESTS TAXONOMY */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white editorial-title">
                Select your technology interests
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                Choose the domains you want your AI agent to actively monitor.
              </p>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {[
                {
                  group: 'Artificial Intelligence',
                  items: ['AI', 'Generative AI', 'AI Agents', 'LLMs', 'RAG', 'Machine Learning', 'AI Research', 'Local LLMs', 'WebGPU']
                },
                {
                  group: 'Development & Engineering',
                  items: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Cloud', 'Databases', 'Developer Tools', 'React 19', 'Rust']
                },
                {
                  group: 'Startups & Ventures',
                  items: ['Startups', 'Venture Capital', 'YC', 'SaaS', 'Product launches', 'Funding']
                },
                {
                  group: 'Emerging Technologies',
                  items: ['Cybersecurity', 'Robotics', 'Web3', 'AR/VR', 'Hardware', 'Quantum Computing']
                }
              ].map((category) => (
                <div key={category.group} className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase text-zinc-500">
                    {category.group}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {category.items.map((item) => {
                      const isSelected = interests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleInterest(item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isSelected
                              ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                          }`}
                        >
                          {isSelected ? `✓ ${item}` : `+ ${item}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — SKILL LEVEL */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white editorial-title">
                What is your technical skill level?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                We tune the depth of code snippets, AST analysis, and research breakdowns accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { level: 'Beginner', desc: 'Focus on high-level concepts, business utility, and gentle introductions.' },
                { level: 'Intermediate', desc: 'Balanced architecture explanations, frameworks, and actionable tutorials.' },
                { level: 'Advanced', desc: 'Deep technical dives, state machines, API internals, and performance.' },
                { level: 'Expert', desc: 'Compiler internals, arXiv mathematical proofs, low-level optimization, and kernel benchmarks.' }
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSkillLevel(s.level)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    skillLevel === s.level
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{s.level}</span>
                    {skillLevel === s.level && <Check className="w-4 h-4" />}
                  </div>
                  <p className={`text-[11px] leading-relaxed ${skillLevel === s.level ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500'}`}>
                    {s.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — SOURCES */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white editorial-title">
                Choose your intelligence sources
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                Toggle the sources you want scanned for signals and cross-verification.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'hacker_news', label: 'Hacker News' },
                { id: 'github', label: 'GitHub Ecosystem' },
                { id: 'reddit', label: 'Reddit Tech' },
                { id: 'arxiv', label: 'arXiv AI/CS' },
                { id: 'product_hunt', label: 'Product Hunt' },
                { id: 'yc', label: 'YC Ecosystem' },
                { id: 'blogs', label: 'Engineering Blogs' },
                { id: 'substack', label: 'Public Newsletters' },
                { id: 'hugging_face', label: 'Hugging Face' }
              ].map((s) => {
                const isSelected = sources.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSource(s.id)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5 — NOTIFICATION PREFERENCE */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white editorial-title">
                Notification Threshold
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                Our Notification Agent optimizes strictly for usefulness over frequency.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'Critical only', title: 'Critical Only', desc: 'Zero noise. Only major security vulnerabilities and historic paradigm shifts.' },
                { id: 'Important', title: 'Important (Recommended)', desc: 'Emerging topics with verified high momentum across 3+ independent sources.' },
                { id: 'Daily intelligence', title: 'Daily Intelligence Digest', desc: 'One curated morning briefing with the top 5 essential developments.' },
                { id: 'Everything', title: 'High Velocity', desc: 'Real-time updates as soon as trends cross initial velocity thresholds.' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNotificationFrequency(opt.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    notificationFrequency === opt.id
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{opt.title}</h4>
                    <p className={`text-[11px] mt-0.5 ${notificationFrequency === opt.id ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-500'}`}>{opt.desc}</p>
                  </div>
                  {notificationFrequency === opt.id && <Check className="w-4 h-4 shrink-0 ml-3" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6 — TIMING & QUIET HOURS */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white editorial-title">
                Digest Timing & Quiet Hours
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                Control when your briefs are dispatched and protect your focus hours.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-500 mb-2">
                  Preferred Briefing Time
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Morning', 'Afternoon', 'Evening'].map((timing) => (
                    <button
                      key={timing}
                      type="button"
                      onClick={() => setNotificationTiming(timing)}
                      className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                        notificationTiming === timing
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {timing}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Quiet Hours (Do Not Disturb)
                </span>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1 font-mono">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={quietHoursStart}
                      onChange={(e) => setQuietHoursStart(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1 font-mono">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={quietHoursEnd}
                      onChange={(e) => setQuietHoursEnd(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black text-xs font-semibold shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black text-xs font-bold shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Calibrating Radar...' : 'Launch TechPulse Radar'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
