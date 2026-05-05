<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<h1 align="center">📝 Notely — AI-Powered Notes</h1>

<p align="center">
  A clean, modern notes application with AI-powered summarization.<br/>
  Built with React, TypeScript, and Tailwind CSS — ready to connect to a full MERN stack backend.
</p>

---

## 📸 What It Looks Like

| | |
|---|---|
| **Home — Notes Grid** | Clean card layout with color-coded accents, search, and staggered entrance animations. |
| **Note Modal** | View, edit, or delete any note. Full content display with relative timestamps. |
| **AI Summary** | Click "Summarize with AI" to get a real-time typed-out summary with a shimmer loading state. |
| **Create / Edit** | Focused form with character count, validation, and smooth transitions. |
| **Empty State** | Friendly illustration and CTA when no notes exist or search returns nothing. |
| **Responsive** | 1-col on mobile → 2-col tablet → 3-col desktop. Mobile-first throughout. |

---

## ✨ Features

- **Create, Read, Edit, Delete notes** — Full CRUD with instant UI updates
- **AI Summarization** — One-click summary generation with typing animation
- **Real-time Search** — Filter notes by title or content instantly
- **Color-coded Cards** — 6 accent colors randomly assigned for visual variety
- **Loading Skeletons** — Pulse-animated placeholder cards during data fetch
- **Delete Confirmation** — Two-step flow prevents accidental deletes
- **Responsive Design** — Looks great on phone, tablet, and desktop
- **Smooth Animations** — Card hover lift, modal slide-up, fade-in stagger, typing cursor
- **Persistent Storage** — Notes saved to localStorage (swap-ready for MongoDB)
- **Seed Data** — 4 realistic sample notes pre-loaded on first visit
- **Type-safe** — Full TypeScript coverage across all files

---

## 📂 Project Structure

```
notely/
├── public/                  # Static assets
├── src/
│   ├── types/
│   │   └── note.ts          # TypeScript interfaces (Note, ModalMode, NoteColor)
│   ├── services/
│   │   └── api.ts           # API service layer (localStorage mock + AI summarizer)
│   ├── components/
│   │   ├── Header.tsx       # Sticky header — brand, search bar, new note CTA
│   │   ├── NoteCard.tsx     # Note card — color border, preview, hover animation
│   │   ├── NoteModal.tsx    # Multi-mode modal — view/edit/create + AI summary
│   │   └── EmptyState.tsx   # Empty state — illustration + call to action
│   ├── App.tsx              # Root component — state management, layout orchestration
│   ├── main.tsx             # Entry point — React DOM render
│   └── index.css            # Global styles — animations, scrollbar, base
├── index.html               # HTML shell
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # You are here
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x — [Download here](https://nodejs.org/)
- **npm** ≥ 9.x (comes with Node.js)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd notely
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will open at **http://localhost:5173**

### 4. Build for Production

```bash
npm run build
```

Output goes to `dist/index.html` — a single self-contained file ready to deploy.

### 5. Preview the Production Build

```bash
npm run preview
```

---

## 🏗️ Architecture Deep Dive

### How State Flows

```
App.tsx (State Owner)
  │
  ├── Header ← searchQuery, noteCount
  │     └── Search input → filters notes in real-time
  │     └── "New Note" button → opens modal in CREATE mode
  │
  ├── NoteCard[] ← notes array (filtered)
  │     └── Click → opens modal in VIEW mode with selectedNote
  │
  └── NoteModal ← modalMode, selectedNote
        ├── VIEW mode → shows content + AI summarize button
        ├── EDIT mode → form to update title/content
        └── CREATE mode → form for new note
```

### Service Layer Pattern

All data operations go through `src/services/api.ts`. This provides a clean separation between UI and data logic. The current implementation uses `localStorage` as a stand-in for a database, but every function is structured to match real REST API calls:

| Function | Simulated Endpoint | Purpose |
|---|---|---|
| `getNotes()` | `GET /api/notes` | Fetch all notes, sorted by recent |
| `getNote(id)` | `GET /api/notes/:id` | Fetch a single note |
| `createNote(data)` | `POST /api/notes` | Create a new note |
| `updateNote(id, data)` | `PUT /api/notes/:id` | Update an existing note |
| `deleteNote(id)` | `DELETE /api/notes/:id` | Delete a note |
| `summarizeText(text)` | `POST /api/notes/summarize` | Generate AI summary |

### AI Summarization (Mock)

The current `summarizeText()` function performs **extractive summarization** locally — it selects key sentences from the content and recombines them into a concise summary. This demonstrates the full UI flow (loading shimmer → typing animation) without requiring an API key.

---

## 🔌 Connecting a Real MERN Backend

This frontend is **production-ready** to connect to a real Express + MongoDB + OpenAI backend. Here's how:

### Step 1: Create the Backend Project

```bash
mkdir server && cd server
npm init -y
npm install express mongoose cors dotenv openai
npm install -D nodemon
```

### Step 2: Project Structure for Backend

```
server/
├── .env                    # Environment variables
├── package.json
├── server.js               # Express entry point
├── models/
│   └── Note.js             # Mongoose Note model
├── routes/
│   └── notes.js            # API route handlers
└── services/
    └── ai.js               # OpenAI integration
```

### Step 3: Setup `.env` File

```env
# server/.env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/notely?retryWrites=true&w=majority
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Create the Note Model

```js
// server/models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    enum: ['rose', 'amber', 'emerald', 'sky', 'violet', 'orange'],
    default: 'sky',
  },
}, {
  timestamps: true,  // auto-generates createdAt and updatedAt
});

module.exports = mongoose.model('Note', noteSchema);
```

### Step 5: Create the AI Service

```js
// server/services/ai.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeText(text) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Summarize the following note concisely in 1-3 sentences. Capture the key points.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
    max_tokens: 150,
    temperature: 0.5,
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { summarizeText };
```

### Step 6: Create the Routes

```js
// server/routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { summarizeText } = require('../services/ai');

// GET /api/notes — Fetch all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET /api/notes/:id — Fetch single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// POST /api/notes — Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const note = new Note({ title, content, color });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id — Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id — Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// POST /api/notes/summarize — AI Summarize
router.post('/summarize', async (req, res) => {
  try {
    const { text, noteId } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const summary = await summarizeText(text);

    // Optionally save summary to the note
    if (noteId) {
      await Note.findByIdAndUpdate(noteId, { summary });
    }

    res.json({ summary });
  } catch (err) {
    console.error('Summarization error:', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;
```

### Step 7: Wire It All Together

```js
// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Vite dev server
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/notes', notesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
```

### Step 8: Update the Frontend API Service

Replace the mock functions in `src/services/api.ts` with real HTTP calls:

```ts
// src/services/api.ts (replace with real API calls)

const API_BASE = 'http://localhost:5000/api';

export async function getNotes(): Promise<Note[]> {
  const res = await fetch(`${API_BASE}/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function getNote(id: string): Promise<Note | null> {
  const res = await fetch(`${API_BASE}/notes/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}

export async function updateNote(id: string, data: UpdateNoteData): Promise<Note> {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete note');
}

export async function summarizeText(text: string): Promise<string> {
  const res = await fetch(`${API_BASE}/notes/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Summarization failed');
  const data = await res.json();
  return data.summary;
}
```

---

## 🗄️ MongoDB Atlas Setup Guide

### 1. Create a Free Cluster

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (Free Tier — M0)
4. Choose a cloud provider and region closest to you

### 2. Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Create a username and secure password
4. Grant **Read and Write** privileges

### 3. Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. For development: click **Allow Access from Anywhere** (`0.0.0.0/0`)
3. For production: add your specific server IP

### 4. Get Your Connection String

1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your credentials
5. Add `notely` as the database name before the `?`

### 5. Add to `.env`

```env
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/notely?retryWrites=true&w=majority
```

---

## 🤖 OpenAI API Key Setup

### 1. Create an Account

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in

### 2. Generate an API Key

1. Navigate to **API Keys** in your account settings
2. Click **Create new secret key**
3. Copy the key (starts with `sk-...`)
4. Store it securely — you won't be able to see it again

### 3. Add Billing

- OpenAI requires billing to be set up for API usage
- Go to **Settings** → **Billing** → **Add payment method**
- GPT-3.5-Turbo costs ~$0.002 per 1K tokens (extremely affordable)

### 4. Add to `.env`

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🎨 Design System

### Colors

| Role | Color | Usage |
|---|---|---|
| **Primary** | Indigo-600 → Violet-600 | Buttons, focus rings, gradients |
| **AI/Accent** | Violet-50 → Indigo-50 | Summary cards, AI badges |
| **Surface** | White / Stone-50 | Cards, backgrounds |
| **Text** | Stone-800 / Stone-500 | Headings, body text |
| **Border** | Stone-200 | Dividers, card borders |
| **Note Accents** | Rose, Amber, Emerald, Sky, Violet, Orange | Left border on note cards |

### Typography

- **Headings:** System font stack, bold, tight tracking
- **Body:** System font stack, regular weight, relaxed line-height
- **Labels:** 12px uppercase, semibold, wide tracking

### Animations

| Animation | Duration | Easing | Where |
|---|---|---|---|
| `fade-in` | 250ms | ease-out | Backdrop, empty state |
| `fade-in-up` | 400ms | ease-out | Note cards (staggered) |
| `slide-up` | 350ms | spring curve | Modal entrance |
| `blink` | 800ms | ease-in-out | AI typing cursor |
| `pulse` | 2s | ease-in-out | Loading skeletons |

---

## 🧰 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI component library |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4.1 | Utility-first styling |
| Vite | 7.3 | Build tool and dev server |
| localStorage | Browser API | Client-side persistence |
| Express.js | — | Backend framework (when connected) |
| Mongoose | — | MongoDB ODM (when connected) |
| OpenAI API | — | AI text summarization (when connected) |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:5173` |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ and a little help from AI<br/>
  <strong>Notely</strong> — Your thoughts, amplified.
</p>
