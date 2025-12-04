import React from 'react';
import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 80,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-primary)',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '400px',
        },
      }}
    />
  );
}

interface ToastOptions {
  duration?: number;
  id?: string;
}

const createToastContent = (
  message: string,
  description?: string,
  icon?: React.ReactNode,
  iconBgClass?: string
) => (
  <div className="flex items-start gap-3">
    <div
      className={clsx(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        iconBgClass
      )}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-[var(--color-text-primary)]">{message}</p>
      {description && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
      )}
    </div>
  </div>
);

export const toast = {
  success: (message: string, description?: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <div
          className={clsx(
            'animate-slide-in-bottom',
            t.visible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {createToastContent(
            message,
            description,
            <CheckCircle className="w-5 h-5 text-[var(--color-success-600)]" />,
            'bg-[var(--color-success-100)]'
          )}
        </div>
      ),
      { duration: options?.duration || 4000, id: options?.id }
    );
  },

  error: (message: string, description?: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <div
          className={clsx(
            'animate-slide-in-bottom',
            t.visible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {createToastContent(
            message,
            description,
            <XCircle className="w-5 h-5 text-[var(--color-error-600)]" />,
            'bg-[var(--color-error-100)]'
          )}
        </div>
      ),
      { duration: options?.duration || 5000, id: options?.id }
    );
  },

  warning: (message: string, description?: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <div
          className={clsx(
            'animate-slide-in-bottom',
            t.visible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {createToastContent(
            message,
            description,
            <AlertCircle className="w-5 h-5 text-[var(--color-warning-600)]" />,
            'bg-[var(--color-warning-100)]'
          )}
        </div>
      ),
      { duration: options?.duration || 4000, id: options?.id }
    );
  },

  info: (message: string, description?: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <div
          className={clsx(
            'animate-slide-in-bottom',
            t.visible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {createToastContent(
            message,
            description,
            <Info className="w-5 h-5 text-[var(--color-primary-600)]" />,
            'bg-[var(--color-primary-100)]'
          )}
        </div>
      ),
      { duration: options?.duration || 4000, id: options?.id }
    );
  },

  dismiss: (id?: string) => {
    hotToast.dismiss(id);
  },
};
