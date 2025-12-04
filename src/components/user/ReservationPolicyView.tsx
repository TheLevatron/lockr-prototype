import React, { useState } from 'react';
import clsx from 'clsx';
import { Check, AlertCircle } from 'lucide-react';
import type { ReservationPolicy } from '@/types';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface ReservationPolicyViewProps {
  policy: ReservationPolicy;
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
  onContinue: () => void;
  onBack?: () => void;
}

export function ReservationPolicyView({
  policy,
  agreed,
  onAgreeChange,
  onContinue,
  onBack,
}: ReservationPolicyViewProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle as="h2">{policy.title}</CardTitle>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Version {policy.version} • Effective: {new Date(policy.effectiveDate).toLocaleDateString()}
        </p>
      </CardHeader>

      <CardContent>
        {/* Policy content */}
        <div
          className={clsx(
            'h-64 overflow-y-auto p-4 mb-4',
            'bg-[var(--color-bg-tertiary)] rounded-lg',
            'prose prose-sm max-w-none',
            'text-[var(--color-text-secondary)]'
          )}
          onScroll={handleScroll}
          tabIndex={0}
          aria-label="Reservation policy document"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: policy.content
                .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-2 text-[var(--color-text-primary)]">$1</h2>')
                .replace(/^\d+\. \*\*(.+?)\*\*:/gm, '<p class="mt-2"><strong class="text-[var(--color-text-primary)]">$1:</strong>')
                .replace(/^ {3}- (.+)$/gm, '<li class="ml-4">$1</li>')
                .replace(/\n/g, '<br/>')
            }}
          />
        </div>

        {!hasScrolledToBottom && (
          <p className="text-sm text-[var(--color-warning-600)] flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            Please scroll to read the entire policy
          </p>
        )}

        {/* Agreement checkbox */}
        <label
          className={clsx(
            'flex items-start gap-3 p-4 rounded-lg cursor-pointer',
            'border-2 transition-colors duration-150',
            agreed
              ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
              : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)]',
            !hasScrolledToBottom && 'opacity-50 pointer-events-none'
          )}
        >
          <div
            className={clsx(
              'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
              'transition-colors duration-150',
              agreed
                ? 'bg-[var(--color-primary-600)] border-[var(--color-primary-600)]'
                : 'border-[var(--color-border-secondary)]'
            )}
          >
            {agreed && <Check className="w-3 h-3 text-white" />}
          </div>
          <div>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => onAgreeChange(e.target.checked)}
              disabled={!hasScrolledToBottom}
              className="sr-only"
              aria-describedby="policy-agreement-description"
            />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              I have read and agree to the locker reservation policy
            </span>
            <p
              id="policy-agreement-description"
              className="text-sm text-[var(--color-text-tertiary)] mt-1"
            >
              By checking this box, you acknowledge that you have read, understood, and agree to
              abide by all the terms and conditions stated in the policy above.
            </p>
          </div>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--color-border-primary)]">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={onContinue}
            disabled={!agreed}
            className={!onBack ? 'ml-auto' : ''}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
