import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-150 ease-in-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-[var(--color-primary-600)] text-white
      hover:bg-[var(--color-primary-700)]
      active:bg-[var(--color-primary-800)]
      focus-visible:ring-[var(--color-primary-500)]
    `,
    secondary: `
      bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]
      hover:bg-[var(--color-bg-hover)]
      active:bg-[var(--color-border-primary)]
      focus-visible:ring-[var(--color-border-secondary)]
    `,
    outline: `
      border-2 border-[var(--color-border-primary)] text-[var(--color-text-primary)]
      bg-transparent
      hover:bg-[var(--color-bg-tertiary)]
      active:bg-[var(--color-bg-hover)]
      focus-visible:ring-[var(--color-border-secondary)]
    `,
    ghost: `
      text-[var(--color-text-secondary)]
      bg-transparent
      hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]
      active:bg-[var(--color-bg-hover)]
      focus-visible:ring-[var(--color-border-secondary)]
    `,
    danger: `
      bg-[var(--color-error-600)] text-white
      hover:bg-[var(--color-error-700)]
      active:bg-[var(--color-error-700)]
      focus-visible:ring-[var(--color-error-500)]
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
