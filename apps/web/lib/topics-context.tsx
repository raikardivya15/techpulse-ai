'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TopicItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  signalCount?: number;
}

export const AVAILABLE_TOPICS: TopicItem[] = [
  // Artificial Intelligence
  { id: 'ai-agents', name: 'AI Agents & Tool Use', category: 'Artificial Intelligence', description: 'Autonomous agent architectures, Model Context Protocol (MCP), and multi-agent workflows.' },
  { id: 'claude-llms', name: 'Claude & Frontier LLMs', category: 'Artificial Intelligence', description: 'Claude 3.7 Sonnet, OpenAI, DeepSeek R1, hybrid reasoning, and frontier models.' },
  { id: 'local-ai', name: 'Local AI & On-Device Models', category: 'Artificial Intelligence', description: 'Ollama, vLLM, llama.cpp, quantized GGUF models, and WebGPU inference.' },
  { id: 'rag-memory', name: 'RAG & Vector Memory', category: 'Artificial Intelligence', description: 'Embeddings, vector databases, long-context retrieval, and agent memory.' },
  { id: 'ai-code-gen', name: 'AI Code Generation & SWE-bench', category: 'Artificial Intelligence', description: 'Claude Code, Cursor, Copilot, SWE-bench verified evaluations, and dev agents.' },

  // Development & Systems
  { id: 'developer-tools', name: 'Developer Tools & CLI', category: 'Development & Systems', description: 'Modern developer CLI tooling, LSP, debuggers, compilers, and workflow optimizers.' },
  { id: 'fullstack-nextjs', name: 'Full Stack & Next.js', category: 'Development & Systems', description: 'React 19, Server Components, Next.js App Router, Vite, and frontend frameworks.' },
  { id: 'rust-wasm', name: 'Rust & WebAssembly', category: 'Development & Systems', description: 'High-performance systems programming, memory safety, and Wasm runtimes.' },
  { id: 'databases-infra', name: 'Databases & Distributed Systems', category: 'Development & Systems', description: 'Postgres, SQLite, distributed consensus, Kafka, and cloud databases.' },
  { id: 'mobile-dev', name: 'Mobile & PWA Architecture', category: 'Development & Systems', description: 'React Native, iOS/Android native APIs, WebAPKs, and standalone PWA runtimes.' },

  // Research & Security
  { id: 'arxiv-research', name: 'arXiv AI & CS Preprints', category: 'Research & Security', description: 'Empirical AI research, mathematical benchmarks, training theorems, and loss functions.' },
  { id: 'cybersecurity', name: 'Cybersecurity & Vulnerability Radar', category: 'Research & Security', description: 'Zero-day exploits, CVE alerts, prompt injection defenses, and supply chain security.' },
  { id: 'quantum-computing', name: 'Quantum & Hardware Computing', category: 'Research & Security', description: 'Quantum algorithms, TPU/GPU silicon architectures, and specialized accelerators.' },

  // Startups & Venture
  { id: 'startups-yc', name: 'YC & Early Stage Startups', category: 'Startups & Venture', description: 'Y Combinator batch launches, early stage AI ventures, and seed funding rounds.' },
  { id: 'open-source', name: 'Open Source Software (OSS)', category: 'Startups & Venture', description: 'Trending GitHub repositories, Apache 2.0/MIT releases, and community ecosystems.' },
];

interface TopicsContextType {
  selectedTopics: string[];
  toggleTopic: (topicName: string) => void;
  selectTopic: (topicName: string) => void;
  deselectTopic: (topicName: string) => void;
  isTopicSelected: (topicName: string) => boolean;
  setSelectedTopics: (topics: string[]) => void;
  resetToDefaults: () => void;
}

const DEFAULT_SELECTED_TOPICS = [
  'AI Agents & Tool Use',
  'Claude & Frontier LLMs',
  'Developer Tools & CLI',
  'Full Stack & Next.js',
  'Rust & WebAssembly',
  'arXiv AI & CS Preprints',
];

const TopicsContext = createContext<TopicsContextType | undefined>(undefined);

export function TopicsProvider({ children }: { children: React.ReactNode }) {
  const [selectedTopics, setSelectedTopicsState] = useState<string[]>(DEFAULT_SELECTED_TOPICS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('techpulse_selected_topics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedTopicsState(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load selected topics from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveTopics = (topics: string[]) => {
    setSelectedTopicsState(topics);
    try {
      localStorage.setItem('techpulse_selected_topics', JSON.stringify(topics));
    } catch (e) {
      console.error('Failed to persist selected topics', e);
    }
  };

  const toggleTopic = (topicName: string) => {
    const exists = selectedTopics.includes(topicName);
    const updated = exists
      ? selectedTopics.filter((t) => t !== topicName)
      : [...selectedTopics, topicName];
    saveTopics(updated);
  };

  const selectTopic = (topicName: string) => {
    if (!selectedTopics.includes(topicName)) {
      saveTopics([...selectedTopics, topicName]);
    }
  };

  const deselectTopic = (topicName: string) => {
    saveTopics(selectedTopics.filter((t) => t !== topicName));
  };

  const isTopicSelected = (topicName: string) => {
    return selectedTopics.includes(topicName);
  };

  const setSelectedTopics = (topics: string[]) => {
    saveTopics(topics);
  };

  const resetToDefaults = () => {
    saveTopics(DEFAULT_SELECTED_TOPICS);
  };

  return (
    <TopicsContext.Provider
      value={{
        selectedTopics,
        toggleTopic,
        selectTopic,
        deselectTopic,
        isTopicSelected,
        setSelectedTopics,
        resetToDefaults,
      }}
    >
      {children}
    </TopicsContext.Provider>
  );
}

export function useTopics() {
  const context = useContext(TopicsContext);
  if (!context) {
    throw new Error('useTopics must be used within a TopicsProvider');
  }
  return context;
}
