import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Calendar } from 'lucide-react';
import { Card, CardContent, Badge } from '@/components/ui';
import { getReservationStatusBadgeVariant, formatStatus } from '@/components/ui/Badge';
import { reservationService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export function ReservationsPage() {
  const { user } = useAuth();

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['reservations', 'user', user?.studentId],
    queryFn: () => reservationService.getReservations({ search: user?.studentId }),
  });

  const reservations = reservationsData?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-[var(--color-primary-600)]" />
          My Reservations
        </h1>
        <p className="text-[var(--color-text-secondary)]">Track your locker reservation history</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent>
                <div className="h-24 bg-[var(--color-bg-tertiary)] rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ClipboardList className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-4" />
            <p className="text-lg font-medium text-[var(--color-text-primary)]">
              No reservations yet
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Go to Floor Plan to reserve a locker
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="animate-fade-in">
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold ${
                        reservation.status === 'occupied' || reservation.status === 'approved'
                          ? 'bg-[var(--color-success-500)]'
                          : reservation.status === 'rejected'
                          ? 'bg-[var(--color-error-500)]'
                          : 'bg-[var(--color-warning-500)]'
                      }`}
                    >
                      {reservation.locker.number.split('-')[1]}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)]">
                        Locker {reservation.locker.number}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Calendar className="w-4 h-4" />
                        {reservation.academicYear} - {reservation.semester} Semester
                      </div>
                      <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
                        Reserved on {new Date(reservation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <Badge variant={getReservationStatusBadgeVariant(reservation.status)}>
                      {formatStatus(reservation.status)}
                    </Badge>
                    {reservation.receiptUrl && (
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        Receipt uploaded
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline for pending reservations */}
                {(reservation.status === 'for_endorsement' ||
                  reservation.status === 'for_approval') && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border-primary)]">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Progress
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          reservation.receiptUploadedAt
                            ? 'bg-[var(--color-success-500)]'
                            : 'bg-[var(--color-border-secondary)]'
                        }`}
                      />
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        Receipt Uploaded
                      </span>
                      <div className="flex-1 h-0.5 bg-[var(--color-border-primary)]" />
                      <div
                        className={`w-3 h-3 rounded-full ${
                          reservation.endorsedAt
                            ? 'bg-[var(--color-success-500)]'
                            : 'bg-[var(--color-border-secondary)]'
                        }`}
                      />
                      <span className="text-sm text-[var(--color-text-secondary)]">Endorsed</span>
                      <div className="flex-1 h-0.5 bg-[var(--color-border-primary)]" />
                      <div
                        className={`w-3 h-3 rounded-full ${
                          reservation.approvedAt
                            ? 'bg-[var(--color-success-500)]'
                            : 'bg-[var(--color-border-secondary)]'
                        }`}
                      />
                      <span className="text-sm text-[var(--color-text-secondary)]">Approved</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
