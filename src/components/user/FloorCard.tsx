import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
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

  // Determine gradient based on floor index
  const gradients = [
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ];
  const gradientIndex = parseInt(floor.id.replace(/\D/g, '')) % gradients.length || 0;
  const gradient = gradients[gradientIndex];

  return (
    <Card hover className="group animate-fade-in overflow-hidden">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className={clsx(
          'relative h-28 bg-gradient-to-br p-5',
          gradient
        )}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              {floor.availableCount} available
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-1">
            {floor.name}
          </h3>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-4">{floor.building}</p>

          {/* Availability bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">
                Availability
              </span>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">
                {availabilityPercent}%
              </span>
            </div>
            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className={clsx(
                  'h-full rounded-full transition-all duration-500',
                  availabilityPercent > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    : availabilityPercent > 20
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-rose-500 to-red-500'
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
            <p className="text-sm text-[var(--color-text-secondary)] mb-5 line-clamp-2">
              {floor.description}
            </p>
          )}

          <Button
            variant="secondary"
            size="md"
            className="w-full group-hover:bg-[var(--color-primary-600)] group-hover:text-white transition-all duration-300"
            onClick={handleClick}
            rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          >
            View Lockers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
