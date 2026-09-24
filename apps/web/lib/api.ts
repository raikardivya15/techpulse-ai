/**
 * TechPulse AI Client API Service.
 * Connects to the FastAPI backend with token authorization.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('techpulse_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Network request failed' }));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API Error on [${endpoint}]:`, err.message);
    throw err;
  }
}

// Auth APIs
export const authApi = {
  login: (data: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data: any) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  onboarding: (data: any) => apiRequest('/auth/onboarding', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  logoutAll: () => apiRequest('/auth/logout-all', { method: 'POST' }),
};

// Feed & Topic APIs
export const feedApi = {
  getHomeFeed: () => apiRequest('/feed'),
  getDiscover: (category = 'All', query = '') => 
    apiRequest(`/discover?category=${encodeURIComponent(category)}${query ? `&query=${encodeURIComponent(query)}` : ''}`),
  getTopic: (slug: string) => apiRequest(`/topics/${slug}`),
  getArticle: (id: string) => apiRequest(`/articles/${id}`),
};

// AI & Pulse APIs
export const aiApi = {
  chat: (message: string, history: any[] = [], topic_slug?: string) => 
    apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history, topic_slug }) }),
  explainQuick: (topic_slug: string, mode = 'tldr') =>
    apiRequest(`/ai/explain?topic_slug=${encodeURIComponent(topic_slug)}&mode=${encodeURIComponent(mode)}`),
};

// Library & Interactions
export const libraryApi = {
  getLibrary: () => apiRequest('/library'),
  saveItem: (event_id: string, custom_notes?: string) =>
    apiRequest('/library/save', { method: 'POST', body: JSON.stringify({ event_id, custom_notes }) }),
  unsaveItem: (event_id: string) =>
    apiRequest(`/library/save/${event_id}`, { method: 'DELETE' }),
  followTopic: (topic_slug: string) =>
    apiRequest('/library/follow/topic', { method: 'POST', body: JSON.stringify({ topic_slug }) }),
  unfollowTopic: (topic_slug: string) =>
    apiRequest(`/library/follow/topic/${topic_slug}`, { method: 'DELETE' }),
  giveFeedback: (event_id: string, reason: string) =>
    apiRequest('/library/feedback', { method: 'POST', body: JSON.stringify({ event_id, reason }) }),
};

// Notifications & Digests
export const notificationApi = {
  getNotifications: () => apiRequest('/notifications'),
  markRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: 'POST' }),
  getDailyDigest: () => apiRequest('/digests/daily'),
  getWeeklyReport: () => apiRequest('/digests/weekly'),
};

// Realtime & Live Telemetry
export const realtimeApi = {
  simulateSignal: () => apiRequest('/realtime/simulate', { method: 'POST' }),
  getStatus: () => apiRequest('/realtime/status'),
};

// Admin & Settings
export const adminApi = {
  getOverview: () => apiRequest('/admin/overview'),
};

export const settingsApi = {
  getSettings: () => apiRequest('/settings'),
  updateProfile: (data: any) => apiRequest('/settings/profile', { method: 'POST', body: JSON.stringify(data) }),
  updatePreferences: (data: any) => apiRequest('/settings/preferences', { method: 'POST', body: JSON.stringify(data) }),
  deleteAccount: () => apiRequest('/settings/account', { method: 'DELETE' }),
};


