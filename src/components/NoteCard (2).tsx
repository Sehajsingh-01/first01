/**
 * NoteCard Component
 * 
 * Displays a single note as a card in the grid.
 * Features:
 * - Color-coded left border accent
 * - Content preview with line clamping
 * - Relative date display
 * - Hover animation with subtle lift effect
 */

import type { Note, NoteColor } from '../types/note';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  index: number;
}

// Map each color name to Tailwind border classes
const borderColorMap: Record<NoteColor, string> = {
  rose: 'border-l-rose-400',
  amber: 'border-l-amber-400',
  emerald: 'border-l-emerald-400',
  sky: 'border-l-sky-400',
  violet: 'border-l-violet-400',
  orange: 'border-l-orange-400',
};

// Subtle background tints on hover
const bgColorMap: Record<NoteColor, string> = {
  rose: 'hover:bg-rose-50/50',
  amber: 'hover:bg-amber-50/50',
  emerald: 'hover:bg-emerald-50/50',
  sky: 'hover:bg-sky-50/50',
  violet: 'hover:bg-violet-50/50',
  orange: 'hover:bg-orange-50/50',
};

/**
 * Format a date into a human-readable relative time string.
 * e.g., "2 hours ago", "Yesterday", "3 days ago"
 */
function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NoteCard({ note, onClick, index }: NoteCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group w-full text-left bg-white rounded-2xl border border-stone-200/80 
        border-l-4 ${borderColorMap[note.color]} ${bgColorMap[note.color]}
        p-5 sm:p-6
        hover:shadow-lg hover:shadow-stone-200/50 hover:-translate-y-1
        active:scale-[0.98] active:translate-y-0
        transition-all duration-300 ease-out
        animate-fade-in-up
      `}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-stone-800 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors duration-200">
          {note.title}
        </h3>
        {/* AI badge if note has been summarized */}
        {note.summary && (
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-semibold rounded-full border border-violet-100">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
            </svg>
            AI
          </span>
        )}
      </div>

      {/* Content Preview */}
      <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mb-4">
        {note.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <time className="text-xs text-stone-400 font-medium">
          {formatRelativeDate(note.updatedAt)}
        </time>
        <div className="flex items-center gap-1 text-stone-300 group-hover:text-indigo-400 transition-colors duration-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
