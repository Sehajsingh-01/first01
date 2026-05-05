/**
 * EmptyState Component
 * 
 * A friendly, inviting empty state shown when there are no notes.
 * Uses warm language and a clear call-to-action.
 */

interface EmptyStateProps {
  isSearch: boolean;
  onNewNote: () => void;
}

export default function EmptyState({ isSearch, onNewNote }: EmptyStateProps) {
  if (isSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-700 mb-1">No matches found</h3>
        <p className="text-sm text-stone-400 text-center max-w-xs">
          Try a different search term or create a new note.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border border-indigo-100/50">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-300/60" />
        <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-emerald-300/60" />
      </div>
      
      <h3 className="text-xl font-bold text-stone-800 mb-2">No notes yet</h3>
      <p className="text-sm text-stone-400 text-center max-w-xs mb-6 leading-relaxed">
        Your ideas deserve a home. Create your first note and let AI help you make sense of it all.
      </p>
      <button
        onClick={onNewNote}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 active:scale-[0.97] transition-all duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Create your first note
      </button>
    </div>
  );
}
