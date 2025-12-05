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
    inline-flex items-center justify-center gap-2.5
    font-semibold rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white
      hover:from-[var(--color-primary-500)] hover:to-[var(--color-primary-600)]
      shadow-md shadow-[var(--color-primary-500)]/20
      hover:shadow-lg hover:shadow-[var(--color-primary-500)]/30
      focus-visible:ring-[var(--color-primary-500)]
    `,
    secondary: `
      bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]
      hover:bg-[var(--color-bg-hover)]
      border border-[var(--color-border-primary)]
      focus-visible:ring-[var(--color-border-secondary)]
    `,
    outline: `
      border-2 border-[var(--color-border-primary)] text-[var(--color-text-primary)]
      bg-transparent
      hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-secondary)]
      focus-visible:ring-[var(--color-border-secondary)]
    `,
    ghost: `
      text-[var(--color-text-secondary)]
      bg-transparent
      hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]
      focus-visible:ring-[var(--color-border-secondary)]
    `,
    danger: `
      bg-gradient-to-r from-[var(--color-error-600)] to-[var(--color-error-500)] text-white
      hover:from-[var(--color-error-500)] hover:to-[var(--color-error-400)]
      shadow-md shadow-[var(--color-error-500)]/20
      focus-visible:ring-[var(--color-error-500)]
    `,
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5"
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
