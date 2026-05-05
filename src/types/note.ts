/**
 * Core types for the Notes application.
 * These types define the shape of our data throughout the app.
 */

// Available accent colors for note cards
export type NoteColor = 'rose' | 'amber' | 'emerald' | 'sky' | 'violet' | 'orange';

// The main Note model
export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;    // AI-generated summary, null if not yet summarized
  color: NoteColor;          // Accent color for the card border
  createdAt: string;         // ISO date string
  updatedAt: string;         // ISO date string
}

// Used when creating a new note (id and dates are auto-generated)
export interface CreateNoteData {
  title: string;
  content: string;
  color?: NoteColor;
}

// Used when updating an existing note
export interface UpdateNoteData {
  title?: string;
  content?: string;
}

// Modal display modes
export type ModalMode = 'view' | 'edit' | 'create' | null;
