import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import { FloorPlanEditor } from '@/components/admin';
import { floorService, lockerService } from '@/services/api';
import type { Locker } from '@/types';

export function AdminFloorPlanPage() {
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: floorsData, isLoading: floorsLoading } = useQuery({
    queryKey: ['floors'],
    queryFn: () => floorService.getFloors(),
  });

  const { data: lockersData, isLoading: lockersLoading } = useQuery({
    queryKey: ['lockers', selectedFloorId],
    queryFn: () => lockerService.getLockersByFloor(selectedFloorId!),
    enabled: !!selectedFloorId,
  });

  const floors = floorsData?.data || [];
  const lockers = lockersData?.data || [];

  const addLockerMutation = useMutation({
    mutationFn: (locker: Omit<Locker, 'id'>) => lockerService.addLocker(selectedFloorId!, locker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockers', selectedFloorId] });
    },
  });

  const updateLockerMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Locker> }) =>
      lockerService.updateLocker(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockers', selectedFloorId] });
    },
  });

  const deleteLockerMutation = useMutation({
    mutationFn: (id: string) => lockerService.deleteLocker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockers', selectedFloorId] });
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[var(--color-primary-600)]" />
          Floor Plan Editor
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Add, edit, or remove lockers from the floor plan
        </p>
      </div>

      {/* Floor selector */}
      <Card>
        <CardContent>
          <CardTitle as="h2" className="mb-4">
            Select Floor
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {floorsLoading ? (
              <div className="animate-pulse text-[var(--color-text-tertiary)]">
                Loading floors...
              </div>
            ) : (
              floors.map((floor) => (
                <Button
                  key={floor.id}
                  variant={selectedFloorId === floor.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedFloorId(floor.id)}
                >
                  {floor.name}
                </Button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Floor plan editor */}
      {selectedFloorId && (
        <Card>
          <CardContent>
            <CardTitle as="h2" className="mb-4">
              Lockers - {floors.find((f) => f.id === selectedFloorId)?.name}
            </CardTitle>

            {lockersLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-[var(--color-text-tertiary)]">
                  Loading lockers...
                </div>
              </div>
            ) : (
              <FloorPlanEditor
                lockers={lockers}
                floorId={selectedFloorId}
                onAddLocker={async (locker) => {
                  await addLockerMutation.mutateAsync(locker);
                }}
                onUpdateLocker={async (id, updates) => {
                  await updateLockerMutation.mutateAsync({ id, updates });
                }}
                onDeleteLocker={async (id) => {
                  await deleteLockerMutation.mutateAsync(id);
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {!selectedFloorId && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-4" />
            <p className="text-[var(--color-text-secondary)]">
              Select a floor above to manage its lockers
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
