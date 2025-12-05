import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AcademicYearWizard } from '@/components/admin';
import { academicYearService } from '@/services/api';
import type { AcademicYear } from '@/types';

export function AcademicYearPage() {
  const queryClient = useQueryClient();

  const { data: academicYearData, isLoading } = useQuery({
    queryKey: ['academicYear'],
    queryFn: () => academicYearService.getCurrentAcademicYear(),
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<AcademicYear>) =>
      academicYearService.updateAcademicYear(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYear'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-[var(--color-text-tertiary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <AcademicYearWizard
        currentAcademicYear={academicYearData?.data}
        onSave={async (data) => {
          await updateMutation.mutateAsync(data);
        }}
      />
    </div>
  );
}
