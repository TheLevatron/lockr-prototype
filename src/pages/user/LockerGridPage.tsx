import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Box } from 'lucide-react';
import { Button, Card, CardContent, CardTitle, toast } from '@/components/ui';
import { LockerGrid, ReservationPolicyView, ReceiptUploadView, VerifiedReceiptView } from '@/components/user';
import { floorService, lockerService, policyService, reservationService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { Locker, Reservation } from '@/types';

type Step = 'select' | 'policy' | 'upload' | 'success';

export function LockerGridPage() {
  const { floorId } = useParams<{ floorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const [completedReservation, setCompletedReservation] = useState<Reservation | null>(null);

  const { data: floorData } = useQuery({
    queryKey: ['floor', floorId],
    queryFn: () => floorService.getFloorById(floorId!),
    enabled: !!floorId,
  });

  const { data: lockersData, isLoading: lockersLoading } = useQuery({
    queryKey: ['lockers', floorId],
    queryFn: () => lockerService.getLockersByFloor(floorId!),
    enabled: !!floorId,
  });

  const { data: policyData } = useQuery({
    queryKey: ['policy'],
    queryFn: () => policyService.getActivePolicy(),
  });

  const floor = floorData?.data;
  const lockers = lockersData?.data || [];
  const policy = policyData?.data;

  const handleLockerSelect = (locker: Locker) => {
    if (locker.status === 'available') {
      setSelectedLocker(locker);
    }
  };

  const handleContinueToPolicy = () => {
    if (selectedLocker) {
      setCurrentStep('policy');
    } else {
      toast.warning('Please select a locker first');
    }
  };

  const handlePolicyContinue = () => {
    if (agreedToPolicy) {
      setCurrentStep('upload');
    }
  };

  const handleUpload = async (file: File) => {
    if (!selectedLocker || !user) return;

    setIsUploading(true);
    setUploadError(undefined);
    setUploadProgress(0);

    try {
      // Create reservation
      const reservationResult = await reservationService.createReservation(
        selectedLocker.id,
        user.id,
        agreedToPolicy
      );

      // Upload receipt
      await reservationService.uploadReceipt(
        reservationResult.data.id,
        file,
        setUploadProgress
      );

      setCompletedReservation(reservationResult.data);
      setCurrentStep('success');
      toast.success('Reservation submitted!', 'Your reservation is now being reviewed');
    } catch {
      setUploadError('Failed to submit reservation. Please try again.');
      toast.error('Upload failed', 'Please try again');
    } finally {
      setIsUploading(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'select':
        return (
          <Card className="animate-fade-in p-6 sm:p-8">
            <CardContent className="p-0">
              <CardTitle as="h2" className="mb-6">
                <div className="flex items-center gap-3">
                  <Box className="w-6 h-6 text-[var(--color-primary-600)]" />
                  Select a Locker - {floor?.name}
                </div>
              </CardTitle>

              {lockersLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-[var(--color-text-tertiary)]">
                    Loading lockers...
                  </div>
                </div>
              ) : (
                <LockerGrid
                  lockers={lockers}
                  selectedLockerId={selectedLocker?.id}
                  onLockerSelect={handleLockerSelect}
                />
              )}

              <div className="mt-8 pt-6 border-t border-[var(--color-border-primary)] flex justify-between">
                <Button variant="ghost" onClick={() => navigate('/floors')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Floors
                </Button>
                <Button variant="primary" size="md" onClick={handleContinueToPolicy} disabled={!selectedLocker}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'policy':
        return policy ? (
          <ReservationPolicyView
            policy={policy}
            agreed={agreedToPolicy}
            onAgreeChange={setAgreedToPolicy}
            onContinue={handlePolicyContinue}
            onBack={() => setCurrentStep('select')}
          />
        ) : null;

      case 'upload':
        return selectedLocker ? (
          <ReceiptUploadView
            locker={selectedLocker}
            onUpload={handleUpload}
            onBack={() => setCurrentStep('policy')}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            uploadError={uploadError}
          />
        ) : null;

      case 'success':
        return completedReservation ? (
          <VerifiedReceiptView reservation={completedReservation} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress indicator */}
      {currentStep !== 'success' && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-sm">
            {(['select', 'policy', 'upload'] as const).map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center gap-2 ${
                    currentStep === step
                      ? 'text-[var(--color-primary-600)] font-medium'
                      : 'text-[var(--color-text-tertiary)]'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step
                        ? 'bg-[var(--color-primary-600)] text-white'
                        : ['select'].indexOf(currentStep) < ['select', 'policy', 'upload'].indexOf(step)
                        ? 'bg-[var(--color-bg-tertiary)]'
                        : 'bg-[var(--color-success-500)] text-white'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="hidden sm:inline capitalize">{step === 'select' ? 'Select Locker' : step === 'policy' ? 'Review Policy' : 'Upload Receipt'}</span>
                </div>
                {index < 2 && (
                  <div className="w-12 h-0.5 bg-[var(--color-border-primary)]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
}
