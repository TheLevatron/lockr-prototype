import { Menu, Sun, Moon, Bell } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '@/context/ThemeContext';

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={clsx(
        'sticky top-0 z-[var(--z-sticky)]',
        'h-16 px-4 lg:px-6',
        'bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)]',
        'flex items-center justify-between gap-4'
      )}
      role="banner"
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className={clsx(
            'lg:hidden p-2 rounded-lg',
            'text-[var(--color-text-secondary)]',
            'hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]'
          )}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h1>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications (placeholder) */}
        <button
          type="button"
          className={clsx(
            'relative p-2 rounded-lg',
            'text-[var(--color-text-secondary)]',
            'hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]'
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-error-500)] rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          className={clsx(
            'p-2 rounded-lg',
            'text-[var(--color-text-secondary)]',
            'hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]'
          )}
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-pressed={theme === 'dark'}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Sun className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
