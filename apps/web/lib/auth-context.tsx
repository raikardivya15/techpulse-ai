'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  onboarding_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('techpulse_token');
    const storedUser = localStorage.getItem('techpulse_user');
    const storedTheme = localStorage.getItem('techpulse_theme');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user session');
      }
    } else {
      // Default to demo authenticated user for frictionless first-impression experience
      const defaultDemoUser: User = {
        id: 'demo-user-1',
        name: 'Divya Raikar',
        email: 'divya@techpulse.ai',
        role: 'AI Engineer',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        onboarding_completed: true,
      };
      setUser(defaultDemoUser);
      setToken('demo-jwt-token');
      localStorage.setItem('techpulse_user', JSON.stringify(defaultDemoUser));
      localStorage.setItem('techpulse_token', 'demo-jwt-token');
    }

    if (storedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    setIsLoading(false);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('techpulse_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('techpulse_theme', 'light');
      }
      return next;
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('techpulse_token', res.token);
      localStorage.setItem('techpulse_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.signup({ name, email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('techpulse_token', res.token);
      localStorage.setItem('techpulse_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('techpulse_token');
    localStorage.removeItem('techpulse_user');
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      const next = { ...user, ...updated };
      setUser(next);
      localStorage.setItem('techpulse_user', JSON.stringify(next));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        darkMode,
        toggleDarkMode,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
