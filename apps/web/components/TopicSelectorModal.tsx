'use client';

import React, { useState } from 'react';
import { 
  X, Check, Search, Sparkles, Layers, Sliders, 
  RotateCcw, ShieldCheck, CheckCheck, BookmarkCheck 
} from 'lucide-react';
import { useTopics, AVAILABLE_TOPICS, TopicItem } from '@/lib/topics-context';

interface TopicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopicSelectorModal({ isOpen, onClose }: TopicSelectorModalProps) {
  const { selectedTopics, toggleTopic, setSelectedTopics, resetToDefaults } = useTopics();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  if (!isOpen) return null;

  const categories = [
    'All',
    'Artificial Intelligence',
    'Development & Systems',
    'Research & Security',
    'Startups & Venture'
  ];

  const filteredTopics = AVAILABLE_TOPICS.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesQuery = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const selectAllFiltered = () => {
    const filteredNames = filteredTopics.map((t) => t.name);
    const combined = Array.from(new Set([...selectedTopics, ...filteredNames]));
    setSelectedTopics(combined);
  };

  const clearAllFiltered = () => {
    const filteredNames = new Set(filteredTopics.map((t) => t.name));
    const remaining = selectedTopics.filter((name) => !filteredNames.has(name));
    setSelectedTopics(remaining);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[12px] bg-white dark:bg-[#121312] border border-border-light dark:border-border-dark shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark bg-[#FBFBFA] dark:bg-[#161816]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[7px] bg-accent-softLight dark:bg-accent-softDark text-accent dark:text-accent-dark flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-text-primaryLight dark:text-text-primaryDark flex items-center gap-2">
                <span>Select & Customize Topics</span>
                <span className="px-2 py-0.5 rounded-[5px] bg-accent-softLight dark:bg-accent-softDark text-accent-textLight dark:text-accent-textDark text-[11px] font-semibold border border-accent/20 dark:border-accent-dark/20">
                  {selectedTopics.length} Active
                </span>
              </h2>
              <p className="text-[11px] text-text-mutedLight dark:text-text-mutedDark">
                Choose the technology vectors you want monitored in your real-time radar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-border-light dark:border-border-dark space-y-3 bg-white dark:bg-[#121312]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-mutedLight dark:text-text-mutedDark" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. MCP, Next.js, Rust, Claude, arXiv)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-[8px] bg-gray-50 dark:bg-zinc-900 border border-border-light dark:border-border-dark text-text-primaryLight dark:text-text-primaryDark placeholder-text-mutedLight dark:placeholder-text-mutedDark focus:outline-none focus:border-accent dark:focus:border-accent-dark"
            />
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium shrink-0 transition-colors ${
                    activeCategory === cat
                      ? 'bg-accent-softLight text-accent-textLight dark:bg-accent-softDark dark:text-accent-textDark font-semibold border border-accent/25 dark:border-accent-dark/25'
                      : 'bg-gray-100 dark:bg-zinc-800 text-text-secondaryLight dark:text-text-secondaryDark hover:text-text-primaryLight dark:hover:text-text-primaryDark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <button
                onClick={selectAllFiltered}
                className="text-[11px] text-accent dark:text-accent-dark font-medium hover:underline"
              >
                Select All
              </button>
              <span className="text-text-mutedLight dark:text-text-mutedDark">•</span>
              <button
                onClick={clearAllFiltered}
                className="text-[11px] text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Topics List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic.name);
                return (
                  <div
                    key={topic.id}
                    onClick={() => toggleTopic(topic.name)}
                    className={`p-3.5 rounded-[10px] border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-accent-softLight/60 dark:bg-accent-softDark/30 border-accent/40 dark:border-accent-dark/40 shadow-xs'
                        : 'bg-white dark:bg-zinc-900 border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase text-text-mutedLight dark:text-text-mutedDark tracking-wide">
                          {topic.category}
                        </span>

                        <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-accent dark:bg-accent-dark text-white dark:text-[#0D0E0D]'
                            : 'border border-border-light dark:border-border-dark bg-white dark:bg-zinc-800'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-text-primaryLight dark:text-text-primaryDark mb-1">
                        {topic.name}
                      </h4>

                      <p className="text-[11px] text-text-secondaryLight dark:text-text-secondaryDark line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-divider-light/60 dark:border-divider-dark/60 flex items-center justify-between text-[10px] tech-mono">
                      <span className={isSelected ? 'text-accent-textLight dark:text-accent-textDark font-semibold' : 'text-text-mutedLight dark:text-text-mutedDark'}>
                        {isSelected ? '✓ In Your Radar' : '+ Tap to Select'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-text-mutedLight dark:text-text-mutedDark space-y-1">
              <p className="font-semibold text-text-primaryLight dark:text-text-primaryDark">No topics match &quot;{searchQuery}&quot;</p>
              <p>Try searching for a different term or clear the filter.</p>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3.5 border-t border-border-light dark:border-border-dark bg-[#FBFBFA] dark:bg-[#161816] flex items-center justify-between">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1 text-xs text-text-mutedLight dark:text-text-mutedDark hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Recommended</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] bg-accent hover:bg-accent-hoverLight dark:bg-accent-dark dark:hover:bg-accent-hoverDark text-white dark:text-[#0D0E0D] text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply {selectedTopics.length} Topics</span>
          </button>
        </div>

      </div>
    </div>
  );
}
