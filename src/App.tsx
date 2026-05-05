/**
 * App Component — Main Entry Point
 * 
 * Orchestrates the entire Notely application:
 * - Manages global state (notes, search, modal)
 * - Handles CRUD operations via the API service
 * - Renders the layout: Header, Note Grid, Modal, Empty State
 */

import { useState, useEffect, useCallback } from 'react';
import type { Note, ModalMode } from './types/note';
import * as api from './services/api';
import Header from './components/Header';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import EmptyState from './components/EmptyState';

export default function App() {
  // ─── State ───────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // ─── Data Fetching ───────────────────────────────────────────────────────
  
  /** Load all notes from the API on mount */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await api.getNotes();
        setNotes(data);
      } catch (err) {
        console.error('Failed to load notes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // ─── CRUD Handlers ───────────────────────────────────────────────────────

  const handleCreateNote = async (title: string, content: string) => {
    const newNote = await api.createNote({ title, content });
    setNotes(prev => [newNote, ...prev]);
  };

  const handleUpdateNote = async (id: string, title: string, content: string) => {
    const updated = await api.updateNote(id, { title, content });
    setNotes(prev => prev.map(n => n.id === id ? updated : n));
    setSelectedNote(updated);
  };

  const handleDeleteNote = async (id: string) => {
    await api.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleSummarize = async (id: string, text: string): Promise<string> => {
    const summary = await api.summarizeText(text);
    // Update the note with the summary in our local state
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, summary } : n
    ));
    if (selectedNote?.id === id) {
      setSelectedNote(prev => prev ? { ...prev, summary } : null);
    }
    return summary;
  };

  // ─── Modal Controls ──────────────────────────────────────────────────────

  const openCreateModal = useCallback(() => {
    setSelectedNote(null);
    setModalMode('create');
  }, []);

  const openViewModal = useCallback((note: Note) => {
    setSelectedNote(note);
    setModalMode('view');
  }, []);

  const closeModal = useCallback(() => {
    setModalMode(null);
    // Delay clearing the note so the close animation plays
    setTimeout(() => setSelectedNote(null), 200);
  }, []);

  // ─── Filtering ───────────────────────────────────────────────────────────

  const filteredNotes = notes.filter(note => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header with search and new note button */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewNote={openCreateModal}
        noteCount={notes.length}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200/80 p-6 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-5 bg-stone-100 rounded-lg w-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-stone-100 rounded-full w-full" />
                  <div className="h-3 bg-stone-100 rounded-full w-5/6" />
                  <div className="h-3 bg-stone-100 rounded-full w-4/6" />
                </div>
                <div className="h-3 bg-stone-100 rounded-full w-1/4 mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNotes.length === 0 && (
          <EmptyState
            isSearch={searchQuery.trim().length > 0}
            onNewNote={openCreateModal}
          />
        )}

        {/* Notes Grid */}
        {!isLoading && filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => openViewModal(note)}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      {/* Note Modal (View / Edit / Create) */}
      {modalMode && (
        <NoteModal
          mode={modalMode}
          note={selectedNote}
          onClose={closeModal}
          onCreate={handleCreateNote}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
          onSummarize={handleSummarize}
        />
      )}

      {/* Footer */}
      {!isLoading && notes.length > 0 && (
        <footer className="text-center py-8 mt-4">
          <p className="text-xs text-stone-300">
            Notely — Your thoughts, amplified by AI
          </p>
        </footer>
      )}
    </div>
  );
}
