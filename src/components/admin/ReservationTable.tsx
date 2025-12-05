import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle } from 'lucide-react';
import type { Reservation } from '@/types';
import { Button, Input, Badge, Modal } from '@/components/ui';
import { getReservationStatusBadgeVariant, formatStatus } from '@/components/ui/Badge';

interface ReservationTableProps {
  reservations: Reservation[];
  isLoading?: boolean;
  onApprove?: (reservation: Reservation) => void;
  onReject?: (reservation: Reservation) => void;
  onViewDetails?: (reservation: Reservation) => void;
  showActions?: boolean;
  actionLabel?: 'endorse' | 'approve';
}

export function ReservationTable({
  reservations,
  isLoading = false,
  onApprove,
  onReject,
  onViewDetails,
  showActions = true,
  actionLabel = 'approve',
}: ReservationTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const pageSize = 10;

  const filteredReservations = useMemo(() => {
    if (!searchTerm) return reservations;
    const search = searchTerm.toLowerCase();
    return reservations.filter(
      (r) =>
        r.user.firstName.toLowerCase().includes(search) ||
        r.user.lastName.toLowerCase().includes(search) ||
        r.locker.number.toLowerCase().includes(search) ||
        r.user.studentId?.toLowerCase().includes(search)
    );
  }, [reservations, searchTerm]);

  const paginatedReservations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReservations.slice(start, start + pageSize);
  }, [filteredReservations, currentPage]);

  const totalPages = Math.ceil(filteredReservations.length / pageSize);

  return (
    <div className="animate-fade-in">
      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search by name, student ID, or locker number..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          leftIcon={<Search className="w-4 h-4" />}
          aria-label="Search reservations"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-b border-[var(--color-border-primary)]">
              <th
                scope="col"
                className="text-left text-sm font-medium text-[var(--color-text-tertiary)] py-3 px-4"
              >
                Student
              </th>
              <th
                scope="col"
                className="text-left text-sm font-medium text-[var(--color-text-tertiary)] py-3 px-4"
              >
                Locker
              </th>
              <th
                scope="col"
                className="text-left text-sm font-medium text-[var(--color-text-tertiary)] py-3 px-4"
              >
                Status
              </th>
              <th
                scope="col"
                className="text-left text-sm font-medium text-[var(--color-text-tertiary)] py-3 px-4"
              >
                Date
              </th>
              {showActions && (
                <th
                  scope="col"
                  className="text-right text-sm font-medium text-[var(--color-text-tertiary)] py-3 px-4"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[var(--color-text-tertiary)]">
                  Loading...
                </td>
              </tr>
            ) : paginatedReservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[var(--color-text-tertiary)]">
                  No reservations found
                </td>
              </tr>
            ) : (
              paginatedReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b border-[var(--color-border-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors duration-150"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {reservation.user.firstName} {reservation.user.lastName}
                      </p>
                      <p className="text-sm text-[var(--color-text-tertiary)]">
                        {reservation.user.studentId}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[var(--color-text-primary)]">{reservation.locker.number}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getReservationStatusBadgeVariant(reservation.status)}>
                      {formatStatus(reservation.status)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">
                    {new Date(reservation.createdAt).toLocaleDateString()}
                  </td>
                  {showActions && (
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            onViewDetails?.(reservation);
                          }}
                          aria-label={`View details for ${reservation.user.firstName} ${reservation.user.lastName}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {onApprove && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onApprove(reservation)}
                            aria-label={`${actionLabel === 'endorse' ? 'Endorse' : 'Approve'} reservation for ${reservation.user.firstName}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {onReject && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onReject(reservation)}
                            aria-label={`Reject reservation for ${reservation.user.firstName}`}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border-primary)]">
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredReservations.length)} of{' '}
            {filteredReservations.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-[var(--color-text-secondary)]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        title="Reservation Details"
        size="lg"
      >
        {selectedReservation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Student Name</p>
                <p className="font-medium text-[var(--color-text-primary)]">
                  {selectedReservation.user.firstName} {selectedReservation.user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Student ID</p>
                <p className="font-medium text-[var(--color-text-primary)]">
                  {selectedReservation.user.studentId}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Locker</p>
                <p className="font-medium text-[var(--color-text-primary)]">
                  {selectedReservation.locker.number}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Status</p>
                <Badge variant={getReservationStatusBadgeVariant(selectedReservation.status)}>
                  {formatStatus(selectedReservation.status)}
                </Badge>
              </div>
            </div>

            {selectedReservation.receiptUrl && (
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)] mb-2">Receipt</p>
                <div className="rounded-lg border border-[var(--color-border-primary)] overflow-hidden">
                  <img
                    src={selectedReservation.receiptUrl}
                    alt="Payment receipt"
                    className="w-full max-h-64 object-contain bg-[var(--color-bg-tertiary)]"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setSelectedReservation(null)}>
                Close
              </Button>
              {showActions && onApprove && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => {
                      onReject?.(selectedReservation);
                      setSelectedReservation(null);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onApprove(selectedReservation);
                      setSelectedReservation(null);
                    }}
                  >
                    {actionLabel === 'endorse' ? 'Endorse' : 'Approve'}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
