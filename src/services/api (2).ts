/**
 * Mock API Service Layer
 * 
 * This module simulates a full MERN stack backend using localStorage.
 * In production, you would replace these functions with actual API calls
 * to your Express.js server endpoints:
 * 
 *   GET    /api/notes          → getNotes()
 *   GET    /api/notes/:id      → getNote(id)
 *   POST   /api/notes          → createNote(data)
 *   PUT    /api/notes/:id      → updateNote(id, data)
 *   DELETE /api/notes/:id      → deleteNote(id)
 *   POST   /api/notes/summarize → summarizeText(text)
 */

import type { Note, CreateNoteData, UpdateNoteData, NoteColor } from '../types/note';

// LocalStorage key for persisting notes
const STORAGE_KEY = 'notely_notes';

// All available accent colors — randomly assigned to new notes
const NOTE_COLORS: NoteColor[] = ['rose', 'amber', 'emerald', 'sky', 'violet', 'orange'];

/**
 * Simulate network latency so we can show loading states.
 * In production, this delay comes naturally from the API call.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate a unique ID for each note.
 * In production, MongoDB generates _id automatically.
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

/**
 * Pick a random accent color for a new note.
 */
const randomColor = (): NoteColor => {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
};

/**
 * Seed data — realistic sample notes so the app doesn't start empty.
 */
const SEED_NOTES: Note[] = [
  {
    id: generateId(),
    title: 'Meeting Notes — Product Roadmap Q2',
    content: 'Discussed the upcoming product roadmap for Q2. Key priorities include improving the onboarding flow, launching the new analytics dashboard, and addressing the top 10 customer feedback items. Sarah will lead the onboarding redesign, and Marcus is taking point on the analytics dashboard. We need to have wireframes ready by Friday. The customer feedback items should be triaged by the support team and prioritized by impact score. Budget approval for the new designer headcount is still pending from finance.',
    summary: null,
    color: 'sky',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: generateId(),
    title: 'Book Recommendations from Alex',
    content: 'Alex recommended these books during lunch: "Designing Data-Intensive Applications" by Martin Kleppmann — great for understanding distributed systems. "The Mom Test" by Rob Fitzpatrick — essential for doing customer interviews properly. "Staff Engineer" by Will Larson — useful for understanding career growth beyond senior level. Should create a reading list and maybe start a book club at work.',
    summary: null,
    color: 'violet',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: generateId(),
    title: 'Weekend Trip Packing List',
    content: 'Camping trip to Big Sur this weekend. Need to pack: tent, sleeping bags, camping stove, cooler with ice, food for 3 meals, water bottles, hiking boots, sunscreen, first aid kit, headlamps, fire starter, marshmallows. Check weather forecast — might rain Saturday. Don\'t forget the camera for the sunset shots at McWay Falls. Pick up firewood from the store on the way.',
    summary: null,
    color: 'emerald',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: generateId(),
    title: 'API Migration Checklist',
    content: 'Steps for migrating from REST to GraphQL: 1) Audit all existing REST endpoints and document usage patterns. 2) Set up Apollo Server with Express. 3) Define GraphQL schema matching current data models. 4) Implement resolvers — start with read operations first. 5) Write integration tests for each resolver. 6) Update frontend to use Apollo Client. 7) Set up query complexity analysis for security. 8) Add rate limiting. 9) Load test with production-like traffic. 10) Gradual rollout with feature flags.',
    summary: null,
    color: 'amber',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// ─── LocalStorage helpers ────────────────────────────────────────────────────

function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Corrupted data — start fresh
  }
  // First visit — seed with sample notes
  const seeds = SEED_NOTES;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
  return seeds;
}

function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ─── CRUD Operations ─────────────────────────────────────────────────────────

/** GET /api/notes — Fetch all notes, sorted by most recently updated */
export async function getNotes(): Promise<Note[]> {
  await delay(300);
  const notes = loadNotes();
  return notes.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/** GET /api/notes/:id — Fetch a single note by ID */
export async function getNote(id: string): Promise<Note | null> {
  await delay(150);
  const notes = loadNotes();
  return notes.find(n => n.id === id) ?? null;
}

/** POST /api/notes — Create a new note */
export async function createNote(data: CreateNoteData): Promise<Note> {
  await delay(400);
  const notes = loadNotes();
  const now = new Date().toISOString();
  const newNote: Note = {
    id: generateId(),
    title: data.title.trim(),
    content: data.content.trim(),
    summary: null,
    color: data.color ?? randomColor(),
    createdAt: now,
    updatedAt: now,
  };
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
}

/** PUT /api/notes/:id — Update an existing note */
export async function updateNote(id: string, data: UpdateNoteData): Promise<Note> {
  await delay(350);
  const notes = loadNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) throw new Error('Note not found');
  
  notes[index] = {
    ...notes[index],
    ...(data.title !== undefined && { title: data.title.trim() }),
    ...(data.content !== undefined && { content: data.content.trim() }),
    updatedAt: new Date().toISOString(),
  };
  saveNotes(notes);
  return notes[index];
}

/** DELETE /api/notes/:id — Delete a note */
export async function deleteNote(id: string): Promise<void> {
  await delay(300);
  const notes = loadNotes();
  const filtered = notes.filter(n => n.id !== id);
  if (filtered.length === notes.length) throw new Error('Note not found');
  saveNotes(filtered);
}

// ─── AI Summarization ────────────────────────────────────────────────────────

/**
 * POST /api/notes/summarize
 * 
 * Mock AI summarization that produces realistic-looking results.
 * In production, this would call:
 * 
 *   const response = await fetch('/api/notes/summarize', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ text }),
 *   });
 * 
 * Which on the backend would call OpenAI's API:
 * 
 *   const completion = await openai.chat.completions.create({
 *     model: 'gpt-3.5-turbo',
 *     messages: [
 *       { role: 'system', content: 'Summarize the following note concisely.' },
 *       { role: 'user', content: text },
 *     ],
 *   });
 */
export async function summarizeText(text: string): Promise<string> {
  // Simulate AI processing time (1.5 - 2.5 seconds)
  await delay(1500 + Math.random() * 1000);
  
  if (!text || text.trim().length === 0) {
    return 'No content to summarize.';
  }

  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);

  // For very short content, return a brief summary
  if (text.length < 100) {
    return `This is a brief note: ${text.trim().substring(0, 80)}${text.length > 80 ? '...' : ''}`;
  }

  // For longer content, create an extractive summary
  if (sentences.length <= 2) {
    return sentences.join(' ');
  }

  // Take the first sentence as context, and key points from the rest
  const firstSentence = sentences[0];
  const lastSentence = sentences[sentences.length - 1];
  
  // Pick a middle sentence that adds value
  const midIndex = Math.floor(sentences.length / 2);
  const middleSentence = sentences[midIndex];

  // Construct a natural-sounding summary
  const summaryParts = [firstSentence];
  
  if (middleSentence !== firstSentence && middleSentence !== lastSentence) {
    summaryParts.push(middleSentence.replace(/^[A-Z]/, c => c.toLowerCase()));
  }
  
  if (lastSentence !== firstSentence) {
    summaryParts.push(lastSentence.replace(/^[A-Z]/, c => c.toLowerCase()));
  }

  return summaryParts.join(', and ') + '.';
}
