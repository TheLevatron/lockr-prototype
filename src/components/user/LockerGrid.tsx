import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import type { Locker } from '@/types';
import { Badge, getLockerStatusBadgeVariant, formatStatus } from '@/components/ui';

interface LockerGridProps {
  lockers: Locker[];
  onLockerSelect?: (locker: Locker) => void;
  selectedLockerId?: string;
  isEditing?: boolean;
}

export function LockerGrid({
  lockers,
  onLockerSelect,
  selectedLockerId,
  isEditing = false,
}: LockerGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Calculate grid dimensions
  const maxX = Math.max(...lockers.map((l) => l.position.x), 0);
  const columns = maxX + 1;

  // Handle keyboard navigation (roving tabindex)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const { key } = event;
      let newIndex = index;

      switch (key) {
        case 'ArrowRight':
          event.preventDefault();
          newIndex = Math.min(index + 1, lockers.length - 1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          newIndex = Math.max(index - 1, 0);
          break;
        case 'ArrowDown':
          event.preventDefault();
          newIndex = Math.min(index + columns, lockers.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          newIndex = Math.max(index - columns, 0);
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = lockers.length - 1;
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (lockers[index].status === 'available' || isEditing) {
            onLockerSelect?.(lockers[index]);
          }
          return;
        default:
          return;
      }

      if (newIndex !== index) {
        setFocusedIndex(newIndex);
        // Focus the new element
        const buttons = gridRef.current?.querySelectorAll('[role="gridcell"] button');
        (buttons?.[newIndex] as HTMLElement)?.focus();
      }
    },
    [lockers, columns, isEditing, onLockerSelect]
  );

  const getLockerStyles = (status: Locker['status'], isSelected: boolean) => {
    const baseStyles = {
      available: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30',
      occupied: 'bg-gradient-to-br from-rose-400 to-red-500 shadow-rose-500/30',
      reserved: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30',
      pending: 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-violet-500/30',
      disabled: 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-400/30',
    };
    
    const hoverStyles = {
      available: 'hover:from-emerald-300 hover:to-teal-400 hover:shadow-lg',
      occupied: '',
      reserved: '',
      pending: '',
      disabled: '',
    };

    return clsx(
      baseStyles[status],
      hoverStyles[status],
      isSelected && 'ring-4 ring-white ring-offset-2 ring-offset-[var(--color-bg-primary)]'
    );
  };

  const isSelectable = (locker: Locker) => {
    return locker.status === 'available' || isEditing;
  };

  return (
    <div className="w-full">
      {/* Legend */}
      <div 
        className="flex flex-wrap gap-4 sm:gap-6 mb-8 p-5 bg-gradient-to-r from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-sm" 
        aria-label="Locker status legend"
      >
        {([
          { status: 'available', label: 'Available', color: 'from-emerald-400 to-teal-500' },
          { status: 'occupied', label: 'Occupied', color: 'from-rose-400 to-red-500' },
          { status: 'reserved', label: 'Reserved', color: 'from-amber-400 to-orange-500' },
          { status: 'pending', label: 'Pending', color: 'from-violet-400 to-purple-500' },
          { status: 'disabled', label: 'Disabled', color: 'from-gray-300 to-gray-400' },
        ] as const).map(({ status, label, color }) => (
          <div key={status} className="flex items-center gap-2.5">
            <div className={clsx('w-5 h-5 rounded-lg bg-gradient-to-br shadow-md', color)} />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-label="Locker grid"
        className="grid gap-3 sm:gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {lockers.map((locker, index) => (
          <div key={locker.id} role="gridcell">
            <button
              type="button"
              tabIndex={index === focusedIndex ? 0 : -1}
              disabled={!isSelectable(locker) && !isEditing}
              onClick={() => {
                if (isSelectable(locker) || isEditing) {
                  onLockerSelect?.(locker);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              className={clsx(
                'w-full aspect-square rounded-2xl',
                'flex flex-col items-center justify-center',
                'text-white font-bold text-lg',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-500)]',
                'shadow-lg',
                getLockerStyles(locker.status, selectedLockerId === locker.id),
                isSelectable(locker)
                  ? 'cursor-pointer active:scale-95 hover:-translate-y-0.5'
                  : 'cursor-not-allowed opacity-75'
              )}
              aria-label={`Locker ${locker.number}, ${locker.status}, ${locker.size} size`}
              aria-selected={selectedLockerId === locker.id}
              aria-disabled={!isSelectable(locker) && !isEditing}
            >
              <span className="truncate max-w-full px-2 drop-shadow-sm">
                {locker.number.split('-')[1]}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Selected locker info */}
      {selectedLockerId && (
        <div
          className="mt-8 p-6 bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-bg-primary)] rounded-2xl animate-fade-in border-2 border-[var(--color-primary-200)] shadow-lg shadow-[var(--color-primary-500)]/10"
          role="status"
          aria-live="polite"
        >
          {(() => {
            const selected = lockers.find((l) => l.id === selectedLockerId);
            if (!selected) return null;
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    'w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg',
                    'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/30'
                  )}>
                    {selected.number.split('-')[1]}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-[var(--color-text-primary)]">
                      Locker {selected.number}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Size: <span className="capitalize font-medium">{selected.size}</span>
                    </p>
                  </div>
                </div>
                <Badge variant={getLockerStatusBadgeVariant(selected.status)}>
                  {formatStatus(selected.status)}
                </Badge>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
