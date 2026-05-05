/**
 * NoteModal Component
 * 
 * A versatile modal that handles three modes:
 * 1. VIEW — Display note details with AI summary feature
 * 2. EDIT — Edit an existing note
 * 3. CREATE — Create a new note
 * 
 * Features:
 * - Backdrop blur overlay
 * - Slide-up entrance animation
 * - AI summary with typing animation
 * - Delete confirmation flow
 * - Form validation
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Note, ModalMode } from '../types/note';

interface NoteModalProps {
  mode: ModalMode;
  note: Note | null;
  onClose: () => void;
  onCreate: (title: string, content: string) => Promise<void>;
  onUpdate: (id: string, title: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSummarize: (id: string, text: string) => Promise<string>;
}

export default function NoteModal({
  mode,
  note,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onSummarize,
}: NoteModalProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // AI Summary state
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState('');
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentMode, setCurrentMode] = useState<ModalMode>(mode);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize form when modal opens or mode changes
  useEffect(() => {
    if (mode === 'create') {
      setTitle('');
      setContent('');
      setCurrentMode('create');
      // Focus title input after animation
      setTimeout(() => titleInputRef.current?.focus(), 300);
    } else if (mode === 'view' && note) {
      setTitle(note.title);
      setContent(note.content);
      setSummary(note.summary);
      setDisplayedSummary(note.summary ?? '');
      setCurrentMode('view');
    } else if (mode === 'edit' && note) {
      setTitle(note.title);
      setContent(note.content);
      setCurrentMode('edit');
      setTimeout(() => titleInputRef.current?.focus(), 300);
    }
    // Reset states
    setIsSummarizing(false);
    setIsSaving(false);
    setShowDeleteConfirm(false);
  }, [mode, note]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Typing animation for AI summary
  useEffect(() => {
    if (!summary || currentMode !== 'view') return;
    
    setDisplayedSummary('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < summary.length) {
        setDisplayedSummary(summary.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Typing speed
    
    return () => clearInterval(interval);
  }, [summary, currentMode]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  // Save note (create or update)
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSaving(true);
    try {
      if (currentMode === 'create') {
        await onCreate(title.trim(), content.trim());
      } else if (note) {
        await onUpdate(note.id, title.trim(), content.trim());
      }
      onClose();
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete note
  const handleDelete = async () => {
    if (!note) return;
    setIsSaving(true);
    try {
      await onDelete(note.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // AI Summarize
  const handleSummarize = async () => {
    if (!note || isSummarizing) return;
    setIsSummarizing(true);
    setSummary(null);
    setDisplayedSummary('');
    try {
      const result = await onSummarize(note.id, note.content);
      setSummary(result);
    } catch (err) {
      console.error('Summarization failed:', err);
      setSummary('Failed to generate summary. Please try again.');
      setDisplayedSummary('Failed to generate summary. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // If no mode, don't render
  if (!currentMode) return null;

  const isEditing = currentMode === 'edit' || currentMode === 'create';
  const isViewing = currentMode === 'view';
  const canSave = title.trim().length > 0 && content.trim().length > 0;
  const charCount = content.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl shadow-stone-900/20 animate-slide-up max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <h2 className="text-lg font-bold text-stone-800">
            {currentMode === 'create' && 'New Note'}
            {currentMode === 'edit' && 'Edit Note'}
            {currentMode === 'view' && note?.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all duration-150"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 animate-fade-in">
              <p className="text-sm text-rose-700 font-medium mb-3">
                Are you sure you want to delete this note? This can't be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
                >
                  {isSaving ? 'Deleting...' : 'Yes, delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3.5 py-1.5 bg-white text-stone-600 text-sm font-medium rounded-lg border border-stone-200 hover:bg-stone-50 transition-all duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Title Input */}
          {isEditing ? (
            <div>
              <label htmlFor="note-title" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Title
              </label>
              <input
                ref={titleInputRef}
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your note a title..."
                maxLength={200}
                className="w-full px-4 py-3 text-base font-medium text-stone-800 placeholder-stone-300 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
            </div>
          ) : null}

          {/* Content Input / Display */}
          {isEditing ? (
            <div>
              <label htmlFor="note-content" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Content
              </label>
              <textarea
                ref={contentInputRef}
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts..."
                rows={8}
                className="w-full px-4 py-3 text-sm text-stone-700 placeholder-stone-300 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 resize-none custom-scrollbar leading-relaxed"
              />
              <div className="flex justify-end mt-1.5">
                <span className={`text-xs ${charCount > 5000 ? 'text-rose-500' : 'text-stone-400'}`}>
                  {charCount.toLocaleString()} characters
                </span>
              </div>
            </div>
          ) : isViewing && note ? (
            <>
              {/* Note Content */}
              <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </div>

              {/* Divider */}
              <div className="border-t border-stone-100" />

              {/* AI Summary Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-stone-700">AI Summary</span>
                </div>

                {/* Summary Display */}
                {summary && (
                  <div className="relative bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100/60 rounded-xl p-4 animate-fade-in">
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-medium text-violet-400 bg-violet-100/60 px-2 py-0.5 rounded-full">
                        AI Generated
                      </span>
                    </div>
                    <p className="text-sm text-violet-900/80 leading-relaxed pr-20">
                      {displayedSummary}
                      {displayedSummary.length < summary.length && (
                        <span className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 animate-blink" />
                      )}
                    </p>
                  </div>
                )}

                {/* Shimmer Loading */}
                {isSummarizing && (
                  <div className="bg-violet-50/50 border border-violet-100/40 rounded-xl p-4 space-y-2 animate-pulse">
                    <div className="h-3 bg-violet-200/50 rounded-full w-full" />
                    <div className="h-3 bg-violet-200/50 rounded-full w-4/5" />
                    <div className="h-3 bg-violet-200/50 rounded-full w-3/5" />
                  </div>
                )}

                {/* Summarize Button */}
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className={`
                    group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 active:scale-[0.97]
                    ${isSummarizing
                      ? 'bg-violet-100 text-violet-400 cursor-wait'
                      : summary
                        ? 'bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-200/60'
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/50 hover:shadow-xl hover:shadow-violet-300/50'
                    }
                  `}
                >
                  {isSummarizing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                      </svg>
                      {summary ? 'Regenerate Summary' : 'Summarize with AI'}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-100 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left actions (view mode only) */}
            <div className="flex items-center gap-2">
              {isViewing && note && (
                <>
                  <button
                    onClick={() => {
                      setCurrentMode('edit');
                      setTimeout(() => titleInputRef.current?.focus(), 100);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-stone-600 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 hover:text-stone-700 active:scale-[0.97] transition-all duration-150"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-stone-400 bg-stone-50 border border-stone-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:scale-[0.97] transition-all duration-150"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {isEditing ? (
                <>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-all duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!canSave || isSaving}
                    className={`
                      inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl
                      transition-all duration-200 active:scale-[0.97]
                      ${canSave && !isSaving
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/50 hover:shadow-xl'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      currentMode === 'create' ? 'Create Note' : 'Save Changes'
                    )}
                  </button>
                </>
              ) : isViewing ? (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-all duration-150"
                >
                  Close
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
