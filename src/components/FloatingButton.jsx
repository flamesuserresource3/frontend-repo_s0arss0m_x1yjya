import { Plus } from 'lucide-react';

export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Add note"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center"
    >
      <Plus className="h-7 w-7" />
    </button>
  );
}
