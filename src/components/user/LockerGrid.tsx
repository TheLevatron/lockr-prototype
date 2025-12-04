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

  const getLockerColor = (status: Locker['status']) => {
    const colors = {
      available: 'bg-[var(--color-success-500)] hover:bg-[var(--color-success-600)]',
      occupied: 'bg-[var(--color-error-500)]',
      reserved: 'bg-[var(--color-warning-500)]',
      pending: 'bg-[var(--color-primary-500)]',
      disabled: 'bg-[var(--color-text-tertiary)]',
    };
    return colors[status];
  };

  const isSelectable = (locker: Locker) => {
    return locker.status === 'available' || isEditing;
  };

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-5 mb-6 p-4 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border-primary)]" aria-label="Locker status legend">
        {(['available', 'occupied', 'reserved', 'pending', 'disabled'] as const).map((status) => (
          <div key={status} className="flex items-center gap-2">
            <div className={clsx('w-5 h-5 rounded-md', getLockerColor(status))} />
            <span className="text-sm font-medium text-[var(--color-text-secondary)] capitalize">{status}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-label="Locker grid"
        className="grid gap-3"
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
                'w-full aspect-square rounded-xl',
                'flex flex-col items-center justify-center',
                'text-white font-semibold',
                'transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-500)]',
                getLockerColor(locker.status),
                selectedLockerId === locker.id && 'ring-4 ring-[var(--color-primary-500)] ring-offset-2',
                isSelectable(locker)
                  ? 'cursor-pointer active:scale-95 shadow-md hover:shadow-lg'
                  : 'cursor-not-allowed opacity-80'
              )}
              aria-label={`Locker ${locker.number}, ${locker.status}, ${locker.size} size`}
              aria-selected={selectedLockerId === locker.id}
              aria-disabled={!isSelectable(locker) && !isEditing}
            >
              <span className="truncate max-w-full px-1">{locker.number.split('-')[1]}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Selected locker info */}
      {selectedLockerId && (
        <div
          className="mt-6 p-5 bg-[var(--color-bg-tertiary)] rounded-xl animate-fade-in border border-[var(--color-border-primary)]"
          role="status"
          aria-live="polite"
        >
          {(() => {
            const selected = lockers.find((l) => l.id === selectedLockerId);
            if (!selected) return null;
            return (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    Locker {selected.number}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] capitalize">
                    Size: {selected.size}
                  </p>
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
