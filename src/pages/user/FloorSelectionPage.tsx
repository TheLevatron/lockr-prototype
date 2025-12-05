import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { FloorCard } from '@/components/user';
import { Card, CardContent } from '@/components/ui';
import { floorService } from '@/services/api';

export function FloorSelectionPage() {
  const { data: floorsData, isLoading } = useQuery({
    queryKey: ['floors'],
    queryFn: () => floorService.getFloors(),
  });

  const floors = floorsData?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[var(--color-primary-600)]" />
          Floor Plan
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Select a floor to view available lockers
        </p>
      </div>

      {/* Floor cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent>
                <div className="h-40 bg-[var(--color-bg-tertiary)] rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {floors.map((floor) => (
            <FloorCard key={floor.id} floor={floor} />
          ))}
        </div>
      )}

      {!isLoading && floors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-4" />
            <p className="text-[var(--color-text-secondary)]">
              No floor plans available at the moment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
