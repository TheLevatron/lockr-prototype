import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Receipt, ArrowRight } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import type { Reservation } from '@/types';

interface VerifiedReceiptViewProps {
  reservation: Reservation;
}

export function VerifiedReceiptView({ reservation }: VerifiedReceiptViewProps) {
  const navigate = useNavigate();

  return (
    <Card className="max-w-md mx-auto text-center animate-scale-in">
      <CardContent className="py-8">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-success-100)] flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-[var(--color-success-600)]" />
        </div>

        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Reservation Submitted!
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Your locker reservation has been successfully submitted and is now awaiting review.
        </p>

        {/* Reservation details */}
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 text-left mb-6">
          <h3 className="text-sm font-medium text-[var(--color-text-tertiary)] mb-3">
            Reservation Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[var(--color-primary-600)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">Locker</p>
                <p className="font-medium text-[var(--color-text-primary)]">
                  {reservation.locker.number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[var(--color-primary-600)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">Academic Year</p>
                <p className="font-medium text-[var(--color-text-primary)]">
                  {reservation.academicYear} - {reservation.semester} Semester
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center">
                <Receipt className="w-4 h-4 text-[var(--color-primary-600)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">Status</p>
                <p className="font-medium text-[var(--color-warning-600)]">For Endorsement</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div className="text-left mb-6">
          <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
            What happens next?
          </h3>
          <ol className="text-sm text-[var(--color-text-secondary)] space-y-1 list-decimal list-inside">
            <li>An officer will verify your payment receipt</li>
            <li>Your reservation will be forwarded to admin for approval</li>
            <li>Once approved, you'll receive confirmation</li>
            <li>You can then start using your assigned locker</li>
          </ol>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={() => navigate('/reservations')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View My Reservations
        </Button>
      </CardContent>
    </Card>
  );
}
