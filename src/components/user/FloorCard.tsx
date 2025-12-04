import { useNavigate } from 'react-router-dom';
import { MapPin, Box } from 'lucide-react';
import clsx from 'clsx';
import type { Floor } from '@/types';
import { Card, CardContent, Button } from '@/components/ui';

interface FloorCardProps {
  floor: Floor;
  onClick?: () => void;
}

export function FloorCard({ floor, onClick }: FloorCardProps) {
  const navigate = useNavigate();
  const availabilityPercent = Math.round((floor.availableCount / floor.lockerCount) * 100);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/floors/${floor.id}`);
    }
  };

  return (
    <Card hover className="animate-fade-in p-6">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[var(--color-primary-600)]" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">{floor.name}</h3>
              <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">{floor.building}</p>
            </div>
          </div>
        </div>

        {/* Availability bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--color-text-secondary)]">Availability</span>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {floor.availableCount} / {floor.lockerCount}
            </span>
          </div>
          <div className="h-2.5 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-300',
                availabilityPercent > 50
                  ? 'bg-[var(--color-success-500)]'
                  : availabilityPercent > 20
                  ? 'bg-[var(--color-warning-500)]'
                  : 'bg-[var(--color-error-500)]'
              )}
              style={{ width: `${availabilityPercent}%` }}
              role="progressbar"
              aria-valuenow={floor.availableCount}
              aria-valuemin={0}
              aria-valuemax={floor.lockerCount}
              aria-label={`${floor.availableCount} of ${floor.lockerCount} lockers available`}
            />
          </div>
        </div>

        {/* Description */}
        {floor.description && (
          <p className="text-sm text-[var(--color-text-tertiary)] mb-5 leading-relaxed">{floor.description}</p>
        )}

        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleClick}
          leftIcon={<Box className="w-4 h-4" />}
        >
          View Lockers
        </Button>
      </CardContent>
    </Card>
  );
}
