import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 backdrop-blur text-gray-700 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-zinc-800 ${className}`}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="text-sm font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
