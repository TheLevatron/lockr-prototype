import React from 'react';
import clsx from 'clsx';
import type { LockerStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
    success: 'bg-[var(--color-success-100)] text-[var(--color-success-700)]',
    warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
    error: 'bg-[var(--color-error-100)] text-[var(--color-error-700)]',
    info: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper to get badge variant from locker status
export function getLockerStatusBadgeVariant(status: LockerStatus): BadgeProps['variant'] {
  const statusMap: Record<LockerStatus, BadgeProps['variant']> = {
    available: 'success',
    occupied: 'error',
    reserved: 'warning',
    pending: 'info',
    disabled: 'default',
  };
  return statusMap[status];
}

// Helper to get badge variant from reservation status
export function getReservationStatusBadgeVariant(
  status: string
): BadgeProps['variant'] {
  const statusMap: Record<string, BadgeProps['variant']> = {
    for_endorsement: 'info',
    for_approval: 'warning',
    approved: 'success',
    rejected: 'error',
    occupied: 'success',
  };
  return statusMap[status] || 'default';
}

// Helper to format status for display
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
