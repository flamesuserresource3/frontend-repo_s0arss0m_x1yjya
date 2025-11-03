import { motion } from 'framer-motion';
import { Pin, PinOff, Trash2, Edit3 } from 'lucide-react';

const colorMap = {
  none: 'bg-white dark:bg-zinc-800',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30',
  blue: 'bg-blue-100 dark:bg-blue-900/30',
  green: 'bg-green-100 dark:bg-green-900/30',
};

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={`${colorMap[note.color || 'none']} rounded-2xl border border-gray-200 dark:border-zinc-700 p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {note.title || 'Untitled'}
          </h3>
        </div>
        <button
          onClick={() => onTogglePin(note)}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
          aria-label={note.pinned ? 'Unpin' : 'Pin'}
        >
          {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
        {note.content?.slice(0, 400)}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {new Date(note.updatedAt || note.createdAt).toLocaleString()}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(note)}
            className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700"
            aria-label="Edit"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(note)}
            className="px-2 py-1 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
