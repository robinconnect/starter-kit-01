import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-accent-2 dark:bg-accent-7 text-accent-7 dark:text-accent-1 transition-colors hover:bg-accent-1 hover:dark:bg-accent-2 focus:outline-none"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300" style={{ opacity: isDark ? 0 : 1 }}>
        {/* Sun Icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </span>
      <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300" style={{ opacity: isDark ? 1 : 0 }}>
        {/* Moon Icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      </span>
    </button>
  );
}