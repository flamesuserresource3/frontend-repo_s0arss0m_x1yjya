import { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { NotebookPen } from 'lucide-react';

import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';
import FloatingButton from './components/FloatingButton';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';

// Helpers
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const LS_KEY = 'notes.keep.clone.v1';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setNotes(parsed);
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
  }, [notes]);

  const openCreate = () => {
    const id = uid();
    const draft = {
      id,
      title: '',
      content: '',
      color: 'none',
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((n) => [draft, ...n]);
    setCurrentId(id);
    setEditorOpen(true);
  };

  const openEdit = (note) => {
    setCurrentId(note.id);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    // Clean up empty drafts
    setNotes((prev) => {
      const n = prev.find((x) => x.id === currentId);
      if (n && !n.title?.trim() && !n.content?.trim()) {
        return prev.filter((x) => x.id !== currentId);
      }
      return prev;
    });
    setCurrentId(null);
  };

  const onEditorChange = (partial) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === partial.id
          ? { ...n, ...partial, updatedAt: Date.now() }
          : n
      )
    );
  };

  const togglePin = (note) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n))
    );
  };

  const deleteNote = (note) => {
    const ok = window.confirm('Delete this note? This action cannot be undone.');
    if (!ok) return;
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    if (currentId === note.id) setEditorOpen(false);
  };

  const sortedFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? notes.filter((n) =>
          (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q)
        )
      : notes;
    const pinned = filtered.filter((n) => n.pinned);
    const others = filtered.filter((n) => !n.pinned);
    const sortByDate = (a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
    return {
      pinned: [...pinned].sort(sortByDate),
      others: [...others].sort(sortByDate),
    };
  }, [notes, query]);

  const activeNote = useMemo(() => notes.find((n) => n.id === currentId), [notes, currentId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-zinc-900/60 border-b border-gray-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <NotebookPen className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">Notes</span>
          </div>
          <div className="flex-1 max-w-2xl">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero with Spline */}
      <section className="relative w-full h-[280px] sm:h-[360px] overflow-hidden">
        <Spline
          scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/90 dark:to-zinc-950/95" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100"
            >
              Capture ideas instantly
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-gray-600 dark:text-gray-300"
            >
              Fast, minimalist notes with pinning, colors, search, and auto-save.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Pinned */}
        <AnimatePresence initial={false}>
          {sortedFiltered.pinned.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Pinned</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedFiltered.pinned.map((n) => (
                  <NoteCard
                    key={n.id}
                    note={n}
                    onEdit={openEdit}
                    onDelete={deleteNote}
                    onTogglePin={togglePin}
                  />
                ))}
              </div>
            </section>
          )}
        </AnimatePresence>

        {/* Others */}
        <section>
          {sortedFiltered.others.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedFiltered.others.map((n) => (
                <NoteCard
                  key={n.id}
                  note={n}
                  onEdit={openEdit}
                  onDelete={deleteNote}
                  onTogglePin={togglePin}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-center">No notes yet. Click the + button to create one.</p>
            </div>
          )}
        </section>
      </main>

      {/* Editor Modal */}
      <NoteEditor
        open={editorOpen}
        note={activeNote}
        onClose={closeEditor}
        onChange={onEditorChange}
        onTogglePin={togglePin}
      />

      {/* Floating Add Button */}
      <FloatingButton onClick={openCreate} />
    </div>
  );
}
