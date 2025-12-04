import React, { useState } from 'react';
import { Calendar, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import clsx from 'clsx';
import type { AcademicYear } from '@/types';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { toast } from '@/components/ui/Toast';

interface AcademicYearWizardProps {
  currentAcademicYear?: AcademicYear;
  onSave: (academicYear: Partial<AcademicYear>) => Promise<void>;
}

const steps = [
  { id: 'year', title: 'Academic Year', description: 'Set the school year' },
  { id: 'semester', title: 'Semester', description: 'Select the semester' },
  { id: 'dates', title: 'Dates', description: 'Set start and end dates' },
  { id: 'reservation', title: 'Reservation Period', description: 'Set reservation window' },
];

export function AcademicYearWizard({ currentAcademicYear, onSave }: AcademicYearWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: currentAcademicYear?.year || '',
    semester: currentAcademicYear?.semester || 'first',
    startDate: currentAcademicYear?.startDate || '',
    endDate: currentAcademicYear?.endDate || '',
    reservationStartDate: currentAcademicYear?.reservationStartDate || '',
    reservationEndDate: currentAcademicYear?.reservationEndDate || '',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave({
        ...formData,
        isActive: true,
      });
      toast.success('Academic year settings saved successfully');
    } catch {
      toast.error('Failed to save academic year settings');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input
              label="Academic Year"
              placeholder="e.g., 2024-2025"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              helperText="Enter the academic year in format YYYY-YYYY"
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">Select the semester:</p>
            <div className="grid grid-cols-3 gap-3">
              {(['first', 'second', 'summer'] as const).map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setFormData({ ...formData, semester: sem })}
                  className={clsx(
                    'p-4 rounded-xl text-center capitalize',
                    'border-2 transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]',
                    formData.semester === sem
                      ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                      : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)]'
                  )}
                >
                  <p
                    className={clsx(
                      'font-medium',
                      formData.semester === sem
                        ? 'text-[var(--color-primary-700)]'
                        : 'text-[var(--color-text-primary)]'
                    )}
                  >
                    {sem}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Semester</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Input
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              type="date"
              label="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Input
              type="date"
              label="Reservation Start Date"
              value={formData.reservationStartDate}
              onChange={(e) =>
                setFormData({ ...formData, reservationStartDate: e.target.value })
              }
              helperText="When students can start reserving lockers"
            />
            <Input
              type="date"
              label="Reservation End Date"
              value={formData.reservationEndDate}
              onChange={(e) => setFormData({ ...formData, reservationEndDate: e.target.value })}
              helperText="Deadline for locker reservations"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle as="h2">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[var(--color-primary-600)]" />
            Academic Year Setup
          </div>
        </CardTitle>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Configure the academic year settings for locker reservations
        </p>
      </CardHeader>

      <CardContent>
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      'text-sm font-medium transition-colors duration-200',
                      index < currentStep
                        ? 'bg-[var(--color-success-500)] text-white'
                        : index === currentStep
                        ? 'bg-[var(--color-primary-600)] text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]'
                    )}
                  >
                    {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <p
                    className={clsx(
                      'text-xs mt-2 text-center',
                      index === currentStep
                        ? 'text-[var(--color-text-primary)] font-medium'
                        : 'text-[var(--color-text-tertiary)]'
                    )}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      'flex-1 h-0.5 mx-2',
                      index < currentStep
                        ? 'bg-[var(--color-success-500)]'
                        : 'bg-[var(--color-border-primary)]'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[var(--color-border-primary)]">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
              Save Settings
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
