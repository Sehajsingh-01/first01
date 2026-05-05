/**
 * Header Component
 * 
 * The main app header with the Notely brand, search bar, and new note button.
 * Designed to be clean, warm, and inviting — not corporate.
 */

import { useState } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewNote: () => void;
  noteCount: number;
}

export default function Header({ searchQuery, onSearchChange, onNewNote, noteCount }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Logo mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-stone-800 tracking-tight">Notely</h1>
              <p className="text-xs text-stone-400 -mt-0.5">{noteCount} {noteCount === 1 ? 'note' : 'notes'}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`
            flex-1 max-w-md transition-all duration-300
            ${isSearchFocused ? 'scale-[1.02]' : 'scale-100'}
          `}>
            <div className={`
              relative flex items-center rounded-xl border transition-all duration-200
              ${isSearchFocused 
                ? 'border-indigo-300 ring-4 ring-indigo-50 bg-white shadow-sm' 
                : 'border-stone-200 bg-stone-50 hover:border-stone-300'
              }
            `}>
              <svg 
                className={`w-4 h-4 ml-3.5 transition-colors duration-200 ${isSearchFocused ? 'text-indigo-500' : 'text-stone-400'}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full py-2.5 px-3 bg-transparent text-sm text-stone-700 placeholder-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="mr-3 p-0.5 rounded-md hover:bg-stone-200 transition-colors text-stone-400 hover:text-stone-600"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* New Note Button */}
          <button
            onClick={onNewNote}
            className="group shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.97] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden sm:inline">New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
}
