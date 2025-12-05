import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  'aria-label'?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className, 'aria-label': ariaLabel }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={clsx(
        'flex border-b border-[var(--color-border-primary)]',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onTabChange(tab.id)}
          onKeyDown={(e) => {
            const currentIndex = tabs.findIndex((t) => t.id === activeTab);
            if (e.key === 'ArrowRight') {
              const nextIndex = (currentIndex + 1) % tabs.length;
              onTabChange(tabs[nextIndex].id);
            } else if (e.key === 'ArrowLeft') {
              const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
              onTabChange(tabs[prevIndex].id);
            }
          }}
          className={clsx(
            'relative flex items-center gap-2 px-4 py-3 text-sm font-medium',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:bg-[var(--color-bg-tertiary)]',
            activeTab === tab.id
              ? 'text-[var(--color-primary-600)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={clsx(
                'px-2 py-0.5 text-xs rounded-full',
                activeTab === tab.id
                  ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]'
              )}
            >
              {tab.count}
            </span>
          )}
          {/* Active indicator */}
          {activeTab === tab.id && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary-600)]"
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, activeTab, children, className }: TabPanelProps) {
  if (activeTab !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={clsx('focus:outline-none', className)}
    >
      {children}
    </div>
  );
}
