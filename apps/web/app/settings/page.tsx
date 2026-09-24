'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, Bell, Shield, 
  LogOut, Save, Clock, Sun, Moon
} from 'lucide-react';
import { settingsApi, authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout, darkMode, toggleDarkMode } = useAuth();
  
  const [name, setName] = useState(user?.name || 'Divya Raikar');
  const [role, setRole] = useState(user?.role || 'AI Engineer');
  const [skillLevel, setSkillLevel] = useState('Advanced');
  const [notificationFrequency, setNotificationFrequency] = useState('Important');
  const [notificationTiming, setNotificationTiming] = useState('Morning');
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    settingsApi.getSettings()
      .then((data) => {
        if (data.user) {
          setName(data.user.name || '');
          setRole(data.user.role || '');
          setSkillLevel(data.user.skill_level || 'Advanced');
        }
        if (data.preferences) {
          setNotificationFrequency(data.preferences.notification_frequency || 'Important');
          setNotificationTiming(data.preferences.notification_timing || 'Morning');
          setQuietHoursStart(data.preferences.quiet_hours_start || '22:00');
          setQuietHoursEnd(data.preferences.quiet_hours_end || '08:00');
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('');
    try {
      await settingsApi.updateProfile({ name, role, skill_level: skillLevel });
      await settingsApi.updatePreferences({
        notification_frequency: notificationFrequency,
        notification_timing: notificationTiming,
        quiet_hours_start: quietHoursStart,
        quiet_hours_end: quietHoursEnd
      });
      updateUser({ name, role });
      setSaveStatus('Preferences saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Failed to update settings', err);
      setSaveStatus('Error saving preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await authApi.logoutAll();
      logout();
      router.push('/login');
    } catch (err) {
      logout();
      router.push('/login');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="page-title text-text-primary-light dark:text-text-primary-dark">
          Settings & Preferences
        </h1>
        <p className="body-text text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
          Tune your profile, notification quiet hours, and AI intelligence sensitivity.
        </p>
      </div>

      {saveStatus && (
        <div className="p-3 rounded-[8px] bg-sage-soft-light dark:bg-sage-soft-dark border border-sage-light/30 dark:border-sage-dark/30 text-xs text-sage-text-light dark:text-sage-text-dark font-medium">
          {saveStatus}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Appearance & Theme Preference Section (above other settings) */}
        <section className="p-5 sm:p-6 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-divider-light dark:border-divider-dark">
            <Sun className="w-4 h-4 text-sage-light dark:text-sage-dark" />
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
              APPEARANCE & THEME
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="card-title text-xs text-text-primary-light dark:text-text-primary-dark">
                Interface Color Mode
              </h4>
              <p className="body-text text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                Switch between Warm Neutral Light Mode and Deep Canvas Dark Mode.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => darkMode && toggleDarkMode()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-all ${
                  !darkMode
                    ? 'bg-sage-soft-light text-sage-text-light border-sage-light/40 font-semibold shadow-xs'
                    : 'bg-canvas-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondaryDark hover:text-text-primary-light dark:hover:text-text-primaryDark'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => !darkMode && toggleDarkMode()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-all ${
                  darkMode
                    ? 'bg-sage-soft-dark text-sage-text-dark border-sage-dark/40 font-semibold shadow-xs'
                    : 'bg-canvas-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondaryDark hover:text-text-primary-light dark:hover:text-text-primaryDark'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </section>

        {/* Profile Card */}
        <section className="p-5 sm:p-6 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-divider-light dark:border-divider-dark">
            <UserIcon className="w-4 h-4 text-sage-light dark:text-sage-dark" />
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
              PROFILE & ROLE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
              />
            </div>

            <div>
              <label className="block text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                Role Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
              />
            </div>
          </div>
        </section>

        {/* Notifications & Quiet Hours */}
        <section className="p-5 sm:p-6 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-divider-light dark:border-divider-dark">
            <Bell className="w-4 h-4 text-sage-light dark:text-sage-dark" />
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
              NOTIFICATIONS & QUIET HOURS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                Notification Sensitivity
              </label>
              <select
                value={notificationFrequency}
                onChange={(e) => setNotificationFrequency(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
              >
                <option value="Critical only">Critical only (Security & Major Shifts)</option>
                <option value="Important">Important (High Momentum Trends)</option>
                <option value="Daily intelligence">Daily Intelligence Digest</option>
                <option value="Everything">High Velocity (All Signals)</option>
              </select>
            </div>

            <div>
              <label className="block text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                Daily Brief Timing
              </label>
              <select
                value={notificationTiming}
                onChange={(e) => setNotificationTiming(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:border-sage-light dark:focus:border-sage-dark"
              >
                <option value="Morning">Morning (08:00)</option>
                <option value="Afternoon">Afternoon (13:00)</option>
                <option value="Evening">Evening (19:00)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-[8px] bg-canvas-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-3">
            <span className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sage-light dark:text-sage-dark" />
              Do Not Disturb / Quiet Hours
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-text-muted-light dark:text-text-muted-dark mb-1 font-mono">
                  Start Time
                </label>
                <input
                  type="time"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[6px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark"
                />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted-light dark:text-text-muted-dark mb-1 font-mono">
                  End Time
                </label>
                <input
                  type="time"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[6px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-[8px] bg-sage-light hover:bg-sage-hover-light dark:bg-sage-dark dark:hover:bg-sage-hover-dark text-white dark:text-[#0D0E0D] text-xs font-medium shadow-xs transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Preferences'}</span>
          </button>
        </div>

      </form>

      {/* Security & Device Session Management */}
      <section className="p-5 sm:p-6 rounded-[10px] bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-divider-light dark:border-divider-dark">
          <Shield className="w-4 h-4 text-sage-light dark:text-sage-dark" />
          <h2 className="text-[11px] font-mono uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark font-semibold">
            SECURITY & SESSIONS
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="card-title text-xs text-text-primary-light dark:text-text-primary-dark">
              Sign out of all active devices
            </h4>
            <p className="body-text text-xs text-text-muted-light dark:text-text-muted-dark font-mono">
              Invalidate all web and mobile session refresh tokens across all hardware.
            </p>
          </div>

          <button
            onClick={handleLogoutAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-canvas-light hover:bg-card-hover-light dark:bg-surface-dark dark:hover:bg-card-hover-dark text-text-primary-light dark:text-text-primary-dark text-xs font-medium border border-border-light dark:border-border-dark transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out All Devices</span>
          </button>
        </div>
      </section>

    </div>
  );
}
