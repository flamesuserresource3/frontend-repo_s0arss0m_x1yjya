import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pin, PinOff } from 'lucide-react';

const COLORS = [
  { key: 'none', label: 'Default', ring: 'ring-gray-300', base: 'bg-white dark:bg-zinc-900', dot: 'bg-gray-300' },
  { key: 'yellow', label: 'Yellow', ring: 'ring-yellow-300', base: 'bg-yellow-100 dark:bg-yellow-900/30', dot: 'bg-yellow-400' },
  { key: 'blue', label: 'Blue', ring: 'ring-blue-300', base: 'bg-blue-100 dark:bg-blue-900/30', dot: 'bg-blue-400' },
  { key: 'green', label: 'Green', ring: 'ring-green-300', base: 'bg-green-100 dark:bg-green-900/30', dot: 'bg-green-400' },
];

export default function NoteEditor({ open, note, onClose, onChange, onTogglePin }) {
  const [local, setLocal] = useState(note || {});

  useEffect(() => {
    setLocal(note || {});
  }, [note]);

  // Auto-save with debounce
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      onChange?.(local);
    }, 400);
    return () => clearTimeout(id);
  }, [local, open, onChange]);

  const selectedColor = useMemo(() => COLORS.find(c => c.key === (local.color || 'none')) || COLORS[0], [local.color]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className={`relative w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-2xl ${selectedColor.base}`}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => onTogglePin?.(local)}
                className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:opacity-90"
              >
                {local.pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                <span className="text-sm font-medium">{local.pinned ? 'Pinned' : 'Pin note'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                aria-label="Close editor"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 pb-4">
              <input
                autoFocus
                type="text"
                value={local.title || ''}
                onChange={(e) => setLocal({ ...local, title: e.target.value })}
                placeholder="Title"
                className="w-full bg-transparent text-xl font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              />
              <textarea
                value={local.content || ''}
                onChange={(e) => setLocal({ ...local, content: e.target.value })}
                placeholder="Take a note..."
                rows={8}
                className="mt-2 w-full bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none resize-y"
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setLocal({ ...local, color: c.key })}
                      className={`h-8 w-8 rounded-full border border-gray-200 dark:border-zinc-700 ${c.base} flex items-center justify-center ${local.color === c.key ? `ring-2 ${c.ring}` : ''}`}
                      aria-label={`Set color ${c.label}`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {local.updatedAt ? `Edited ${new Date(local.updatedAt).toLocaleString()}` : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
