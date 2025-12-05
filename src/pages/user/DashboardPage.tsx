import { useQuery } from '@tanstack/react-query';
import { Box, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 sm:p-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-sm text-white/90 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Welcome back!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Hello, {user?.firstName}! 👋
          </h1>
          <p className="text-white/70 text-lg max-w-lg">
            Manage your locker reservations and track your status all in one place.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card hover className="group">
          <CardContent className="p-0">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                <Box className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-tertiary)] mb-1">Available Lockers</p>
                <p className="text-4xl font-bold text-[var(--color-text-primary)]">
                  {totalAvailable}
                  <span className="text-lg font-normal text-[var(--color-text-tertiary)] ml-1">
                    / {totalLockers}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="group">
          <CardContent className="p-0">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-tertiary)] mb-1">Pending Requests</p>
                <p className="text-4xl font-bold text-[var(--color-text-primary)]">
                  {pendingReservation ? '1' : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="group sm:col-span-2 lg:col-span-1">
          <CardContent className="p-0">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-tertiary)] mb-1">My Locker</p>
                <p className="text-4xl font-bold text-[var(--color-text-primary)]">
                  {activeReservation ? activeReservation.locker.number : 'None'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Reservation */}
      {activeReservation && (
        <Card className="border-2 border-[var(--color-success-400)] bg-gradient-to-r from-[var(--color-success-50)] to-transparent">
          <CardContent className="p-0">
            <CardTitle as="h2" className="mb-5 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-success-600)]" />
              Your Active Locker
            </CardTitle>
            <div className="flex items-center justify-between flex-wrap gap-5">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-emerald-500/30">
                  {activeReservation.locker.number.split('-')[1]}
                </div>
                <div>
                  <p className="font-bold text-xl text-[var(--color-text-primary)]">
                    Locker {activeReservation.locker.number}
                  </p>
                  <p className="text-[var(--color-text-secondary)] mt-1">
                    {activeReservation.academicYear} - {activeReservation.semester} Semester
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/reservations')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Reservation */}
      {pendingReservation && !activeReservation && (
        <Card className="border-2 border-[var(--color-warning-400)] bg-gradient-to-r from-[var(--color-warning-50)] to-transparent">
          <CardContent className="p-0">
            <CardTitle as="h2" className="mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-warning-600)]" />
              Pending Reservation
            </CardTitle>
            <div className="flex items-center justify-between flex-wrap gap-5">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-amber-500/30 animate-pulse">
                  {pendingReservation.locker.number.split('-')[1]}
                </div>
                <div>
                  <p className="font-bold text-xl text-[var(--color-text-primary)]">
                    Locker {pendingReservation.locker.number}
                  </p>
                  <p className="text-[var(--color-warning-600)] mt-1 font-medium">
                    Status: {pendingReservation.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/reservations')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
              >
                Track Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floor Plans */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Select a Floor
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Browse available lockers by floor
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/floors')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All
          </Button>
        </div>
        
        {floorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-[var(--color-bg-tertiary)] rounded-xl" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {floors.slice(0, 3).map((floor) => (
              <FloorCard key={floor.id} floor={floor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
