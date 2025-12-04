import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, className, padding = 'md', hover = false, gradient = false }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl',
        gradient 
          ? 'bg-gradient-to-br from-white to-[var(--color-bg-secondary)] dark:from-[var(--color-bg-secondary)] dark:to-[var(--color-bg-primary)]'
          : 'bg-[var(--color-bg-primary)]',
        'border border-[var(--color-border-primary)]',
        'shadow-[var(--shadow-card)]',
        paddingStyles[padding],
        hover && 'transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary-200)] hover:-translate-y-1 cursor-pointer',
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
    <div className={clsx('mb-5 pb-5 border-b border-[var(--color-border-primary)]', className)}>
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
        'mt-5 pt-5 border-t border-[var(--color-border-primary)] flex items-center gap-3',
        className
      )}
    >
      {children}
    </div>
  );
}
