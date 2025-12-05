import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { Locker, LockerStatus } from '@/types';
import { Button, Modal, Input } from '@/components/ui';
import { LockerGrid } from '@/components/user/LockerGrid';
import { toast } from '@/components/ui/Toast';

interface FloorPlanEditorProps {
  lockers: Locker[];
  floorId: string;
  onAddLocker: (locker: Omit<Locker, 'id'>) => Promise<void>;
  onUpdateLocker: (id: string, updates: Partial<Locker>) => Promise<void>;
  onDeleteLocker: (id: string) => Promise<void>;
}

export function FloorPlanEditor({
  lockers,
  floorId,
  onAddLocker,
  onUpdateLocker,
  onDeleteLocker,
}: FloorPlanEditorProps) {
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new locker
  const [newLockerNumber, setNewLockerNumber] = useState('');
  const [newLockerSize, setNewLockerSize] = useState<Locker['size']>('medium');
  const [newLockerStatus, setNewLockerStatus] = useState<LockerStatus>('available');

  const handleLockerSelect = (locker: Locker) => {
    setSelectedLocker(locker);
    setNewLockerNumber(locker.number);
    setNewLockerSize(locker.size);
    setNewLockerStatus(locker.status);
    setIsEditModalOpen(true);
  };

  const handleAddLocker = async () => {
    if (!newLockerNumber.trim()) {
      toast.error('Please enter a locker number');
      return;
    }

    setIsLoading(true);
    try {
      const maxX = lockers.length > 0 ? Math.max(...lockers.map((l) => l.position.x)) : -1;
      const maxY = lockers.length > 0 ? Math.max(...lockers.map((l) => l.position.y)) : 0;
      
      // Place new locker at end of grid
      const newX = (maxX + 1) % 10;
      const newY = newX === 0 ? maxY + 1 : maxY;

      await onAddLocker({
        number: newLockerNumber,
        floorId,
        status: newLockerStatus,
        size: newLockerSize,
        position: { x: newX, y: newY },
      });

      toast.success('Locker added successfully');
      setIsAddModalOpen(false);
      resetForm();
    } catch {
      toast.error('Failed to add locker');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLocker = async () => {
    if (!selectedLocker) return;

    setIsLoading(true);
    try {
      await onUpdateLocker(selectedLocker.id, {
        number: newLockerNumber,
        size: newLockerSize,
        status: newLockerStatus,
      });

      toast.success('Locker updated successfully');
      setIsEditModalOpen(false);
      setSelectedLocker(null);
      resetForm();
    } catch {
      toast.error('Failed to update locker');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocker = async () => {
    if (!selectedLocker) return;

    setIsLoading(true);
    try {
      await onDeleteLocker(selectedLocker.id);
      toast.success('Locker deleted successfully');
      setIsDeleteModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedLocker(null);
    } catch {
      toast.error('Failed to delete locker');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewLockerNumber('');
    setNewLockerSize('medium');
    setNewLockerStatus('available');
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Click on a locker to edit or delete it
        </p>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          Add Locker
        </Button>
      </div>

      {/* Locker Grid */}
      <LockerGrid
        lockers={lockers}
        onLockerSelect={handleLockerSelect}
        selectedLockerId={selectedLocker?.id}
        isEditing={true}
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Locker"
      >
        <div className="space-y-4">
          <Input
            label="Locker Number"
            value={newLockerNumber}
            onChange={(e) => setNewLockerNumber(e.target.value)}
            placeholder="e.g., F1-051"
          />

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Size
            </label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setNewLockerSize(size)}
                  className={clsx(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize',
                    'transition-colors duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]',
                    newLockerSize === size
                      ? 'bg-[var(--color-primary-600)] text-white'
                      : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Initial Status
            </label>
            <div className="flex gap-2">
              {(['available', 'disabled'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNewLockerStatus(status)}
                  className={clsx(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize',
                    'transition-colors duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]',
                    newLockerStatus === status
                      ? 'bg-[var(--color-primary-600)] text-white'
                      : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddLocker} isLoading={isLoading}>
              Add Locker
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLocker(null);
        }}
        title="Edit Locker"
      >
        {selectedLocker && (
          <div className="space-y-4">
            <Input
              label="Locker Number"
              value={newLockerNumber}
              onChange={(e) => setNewLockerNumber(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Size
              </label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setNewLockerSize(size)}
                    className={clsx(
                      'flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize',
                      'transition-colors duration-150',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]',
                      newLockerSize === size
                        ? 'bg-[var(--color-primary-600)] text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['available', 'occupied', 'reserved', 'pending', 'disabled'] as const).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setNewLockerStatus(status)}
                      className={clsx(
                        'py-2 px-3 rounded-lg text-sm font-medium capitalize',
                        'transition-colors duration-150',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]',
                        newLockerStatus === status
                          ? 'bg-[var(--color-primary-600)] text-white'
                          : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                      )}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="danger"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedLocker(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateLocker} isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Locker"
        size="sm"
      >
        <div>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Are you sure you want to delete locker{' '}
            <strong className="text-[var(--color-text-primary)]">{selectedLocker?.number}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteLocker} isLoading={isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
