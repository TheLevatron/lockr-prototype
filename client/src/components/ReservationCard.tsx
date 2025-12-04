import type { Reservation, Locker } from '../types';
import { useCancelReservation, useSubmitForEndorsement, useAcceptAgreement } from '../hooks/useReservations';
import { useLockers } from '../hooks/useLockers';

interface ReservationCardProps {
  reservation: Reservation;
  showActions?: boolean;
}

export function ReservationCard({ reservation, showActions = true }: ReservationCardProps) {
  const { data: lockers } = useLockers();
  const cancelMutation = useCancelReservation();
  const submitMutation = useSubmitForEndorsement();
  const acceptAgreementMutation = useAcceptAgreement();

  const locker = lockers?.find((l: Locker) => l.id === reservation.lockerId);

  const getStatusBadge = (status: Reservation['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      for_endorsement: 'bg-blue-100 text-blue-800',
      for_approval: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      pending: 'Pending Payment',
      for_endorsement: 'For Endorsement',
      for_approval: 'For Approval',
      approved: 'Approved',
      cancelled: 'Cancelled',
      expired: 'Expired',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      await cancelMutation.mutateAsync(reservation.id);
    }
  };

  const handleSubmit = async () => {
    // In a real app, this would involve file upload
    await submitMutation.mutateAsync({ id: reservation.id, receiptUrl: 'receipt-uploaded.pdf' });
  };

  const handleAcceptAgreement = async () => {
    await acceptAgreementMutation.mutateAsync(reservation.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Locker {locker?.lockerNumber || 'Unknown'}
          </h3>
          <p className="text-sm text-gray-500">
            Referral Slip: {reservation.referralSlipNo}
          </p>
        </div>
        {getStatusBadge(reservation.status)}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium">Period:</span>{' '}
          {new Date(reservation.reservationTimeStart).toLocaleDateString()} -{' '}
          {new Date(reservation.reservationTimeEnd).toLocaleDateString()}
        </p>
        {reservation.term && (
          <p>
            <span className="font-medium">Term:</span> {reservation.term}
          </p>
        )}
        <p>
          <span className="font-medium">Agreement:</span>{' '}
          {reservation.agreement ? '✅ Accepted' : '❌ Not accepted'}
        </p>
      </div>

      {showActions && (
        <div className="mt-4 flex flex-wrap gap-2">
          {reservation.status === 'pending' && !reservation.agreement && (
            <button
              onClick={handleAcceptAgreement}
              disabled={acceptAgreementMutation.isPending}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Accept Agreement
            </button>
          )}
          {reservation.status === 'pending' && reservation.agreement && (
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Submit Payment Receipt
            </button>
          )}
          {['pending', 'for_endorsement', 'for_approval'].includes(reservation.status) && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
