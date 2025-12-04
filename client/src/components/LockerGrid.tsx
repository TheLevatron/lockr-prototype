import type { Locker } from '../types';

interface LockerGridProps {
  lockers: Locker[];
  onLockerClick?: (locker: Locker) => void;
  selectedLockerId?: string;
}

export function LockerGrid({ lockers, onLockerClick, selectedLockerId }: LockerGridProps) {
  const getStatusColor = (status: Locker['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'reserved':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'occupied':
        return 'bg-red-500 hover:bg-red-600';
      case 'unavailable':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusLabel = (status: Locker['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'reserved':
        return 'Reserved';
      case 'occupied':
        return 'Occupied';
      case 'unavailable':
        return 'Unavailable';
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
      {lockers.map((locker) => (
        <button
          key={locker.id}
          onClick={() => onLockerClick?.(locker)}
          disabled={locker.status !== 'available'}
          className={`
            aspect-square flex flex-col items-center justify-center rounded-lg
            text-white font-bold text-sm transition-all
            ${getStatusColor(locker.status)}
            ${selectedLockerId === locker.id ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
            ${locker.status !== 'available' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
          `}
          title={`Locker ${locker.lockerNumber} - ${getStatusLabel(locker.status)}`}
        >
          <span>{locker.lockerNumber}</span>
          {locker.accessible && <span className="text-xs">♿</span>}
        </button>
      ))}
    </div>
  );
}

export function LockerLegend() {
  const statuses = [
    { status: 'available', color: 'bg-green-500', label: 'Available' },
    { status: 'reserved', color: 'bg-yellow-500', label: 'Reserved' },
    { status: 'occupied', color: 'bg-red-500', label: 'Occupied' },
    { status: 'unavailable', color: 'bg-gray-400', label: 'Unavailable' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {statuses.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${color}`} />
          <span className="text-sm text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  );
}
