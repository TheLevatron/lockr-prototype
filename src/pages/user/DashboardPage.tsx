import { useQuery } from '@tanstack/react-query';
import { Box, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import { FloorCard } from '@/components/user';
import { floorService, reservationService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

export function UserDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: floorsData, isLoading: floorsLoading } = useQuery({
    queryKey: ['floors'],
    queryFn: () => floorService.getFloors(),
  });

  const { data: reservationsData } = useQuery({
    queryKey: ['reservations', 'user'],
    queryFn: () => reservationService.getReservations({ search: user?.studentId }),
  });

  const floors = floorsData?.data || [];
  const reservations = reservationsData?.data || [];
  const activeReservation = reservations.find(
    (r) => r.status === 'occupied' || r.status === 'approved'
  );
  const pendingReservation = reservations.find(
    (r) => r.status === 'for_endorsement' || r.status === 'for_approval'
  );

  const totalAvailable = floors.reduce((sum, f) => sum + f.availableCount, 0);
  const totalLockers = floors.reduce((sum, f) => sum + f.lockerCount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Manage your locker reservation below
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center">
                <Box className="w-6 h-6 text-[var(--color-primary-600)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Available Lockers</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {totalAvailable}
                  <span className="text-sm font-normal text-[var(--color-text-tertiary)]">
                    {' '}
                    / {totalLockers}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-warning-100)] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[var(--color-warning-600)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Pending</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {pendingReservation ? '1' : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-success-100)] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[var(--color-success-600)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">My Locker</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {activeReservation ? activeReservation.locker.number : 'None'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Reservation */}
      {activeReservation && (
        <Card>
          <CardContent>
            <CardTitle as="h2" className="mb-4">
              Your Active Locker
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[var(--color-success-500)] flex items-center justify-center text-white text-lg font-bold">
                  {activeReservation.locker.number.split('-')[1]}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    Locker {activeReservation.locker.number}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {activeReservation.academicYear} - {activeReservation.semester} Semester
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/reservations')}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Reservation */}
      {pendingReservation && !activeReservation && (
        <Card className="border-[var(--color-warning-400)]">
          <CardContent>
            <CardTitle as="h2" className="mb-4">
              Pending Reservation
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[var(--color-warning-500)] flex items-center justify-center text-white text-lg font-bold">
                  {pendingReservation.locker.number.split('-')[1]}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    Locker {pendingReservation.locker.number}
                  </p>
                  <p className="text-sm text-[var(--color-warning-600)]">
                    Status: {pendingReservation.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/reservations')}>
                Track Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floor Plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Select a Floor
          </h2>
          <Button variant="ghost" onClick={() => navigate('/floors')}>
            View All
          </Button>
        </div>
        
        {floorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent>
                  <div className="h-32 bg-[var(--color-bg-tertiary)] rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {floors.slice(0, 3).map((floor) => (
              <FloorCard key={floor.id} floor={floor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
