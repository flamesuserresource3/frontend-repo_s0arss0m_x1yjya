import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar({ value, onChange, className = '' }) {
  const [q, setQ] = useState(value || '');

  useEffect(() => {
    setQ(value || '');
  }, [value]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={q}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
          onChange?.(v);
        }}
        placeholder="Search notes..."
        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 dark:bg-zinc-800/70 backdrop-blur border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
      />
    </div>
  );
}
