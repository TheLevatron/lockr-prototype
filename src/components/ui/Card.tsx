import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className, padding = 'md', hover = false }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={clsx(
        'bg-[var(--color-bg-primary)] rounded-2xl shadow-sm',
        'border border-[var(--color-border-primary)]',
        paddingStyles[padding],
        hover && 'transition-all duration-200 hover:shadow-md hover:border-[var(--color-border-secondary)] cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('mb-4 pb-4 border-b border-[var(--color-border-primary)]', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}

export function CardTitle({ children, as: Tag = 'h3', className }: CardTitleProps) {
  return (
    <Tag
      className={clsx(
        'text-lg font-semibold text-[var(--color-text-primary)]',
        className
      )}
    >
      {children}
    </Tag>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={clsx('text-[var(--color-text-secondary)]', className)}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={clsx(
        'mt-4 pt-4 border-t border-[var(--color-border-primary)] flex items-center gap-3',
        className
      )}
    >
      {children}
    </div>
  );
}
