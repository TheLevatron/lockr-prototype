import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard, Users, FileCheck, ClipboardList, History, Box } from 'lucide-react';
import { Card, CardContent, Tabs, TabPanel, toast } from '@/components/ui';
import { ReservationTable } from '@/components/admin';
import { reservationService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { Reservation, ReservationStatus } from '@/types';

const tabs = [
  { id: 'endorsement', label: 'For Endorsement', icon: <FileCheck className="w-4 h-4" /> },
  { id: 'approval', label: 'For Approval', icon: <ClipboardList className="w-4 h-4" /> },
  { id: 'occupied', label: 'Occupied', icon: <Users className="w-4 h-4" /> },
  { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
];

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('endorsement');
  const { user, isOfficer, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const statusMap: Record<string, ReservationStatus | undefined> = {
    endorsement: 'for_endorsement',
    approval: 'for_approval',
    occupied: 'occupied',
    history: undefined,
  };

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['reservations', 'admin', activeTab],
    queryFn: () =>
      reservationService.getReservations(
        statusMap[activeTab] ? { status: statusMap[activeTab] } : undefined,
        1,
        50
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: ReservationStatus;
      notes?: string;
    }) => reservationService.updateReservationStatus(id, status, user!, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  const reservations = reservationsData?.data || [];

  const handleEndorse = async (reservation: Reservation) => {
    try {
      await updateMutation.mutateAsync({
        id: reservation.id,
        status: 'for_approval',
      });
      toast.success('Reservation endorsed', 'Forwarded to admin for approval');
    } catch {
      toast.error('Failed to endorse reservation');
    }
  };

  const handleApprove = async (reservation: Reservation) => {
    try {
      await updateMutation.mutateAsync({
        id: reservation.id,
        status: 'occupied',
      });
      toast.success('Reservation approved', 'Locker has been assigned');
    } catch {
      toast.error('Failed to approve reservation');
    }
  };

  const handleReject = async (reservation: Reservation) => {
    try {
      await updateMutation.mutateAsync({
        id: reservation.id,
        status: 'rejected',
        notes: 'Reservation rejected by administrator',
      });
      toast.info('Reservation rejected');
    } catch {
      toast.error('Failed to reject reservation');
    }
  };

  // Get stats
  const endorsementCount = reservations.filter((r) => r.status === 'for_endorsement').length;
  const approvalCount = reservations.filter((r) => r.status === 'for_approval').length;
  const occupiedCount = reservations.filter((r) => r.status === 'occupied').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[var(--color-primary-600)]" />
          Admin Dashboard
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Manage locker reservations and approvals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-[var(--color-primary-600)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">For Endorsement</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {endorsementCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-warning-100)] flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-[var(--color-warning-600)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">For Approval</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {approvalCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-success-100)] flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--color-success-600)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Occupied</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {occupiedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                <Box className="w-6 h-6 text-[var(--color-text-tertiary)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Total</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {reservations.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Table */}
      <Card>
        <CardContent>
          <Tabs
            tabs={tabs.map((tab) => ({
              ...tab,
              count:
                tab.id === 'endorsement'
                  ? endorsementCount
                  : tab.id === 'approval'
                  ? approvalCount
                  : tab.id === 'occupied'
                  ? occupiedCount
                  : undefined,
            }))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            aria-label="Reservation status tabs"
          />

          <div className="mt-4">
            <TabPanel id="endorsement" activeTab={activeTab}>
              <ReservationTable
                reservations={reservations.filter((r) => r.status === 'for_endorsement')}
                isLoading={isLoading}
                onApprove={isOfficer || isAdmin ? handleEndorse : undefined}
                onReject={isOfficer || isAdmin ? handleReject : undefined}
                actionLabel="endorse"
              />
            </TabPanel>

            <TabPanel id="approval" activeTab={activeTab}>
              <ReservationTable
                reservations={reservations.filter((r) => r.status === 'for_approval')}
                isLoading={isLoading}
                onApprove={isAdmin ? handleApprove : undefined}
                onReject={isAdmin ? handleReject : undefined}
                actionLabel="approve"
              />
            </TabPanel>

            <TabPanel id="occupied" activeTab={activeTab}>
              <ReservationTable
                reservations={reservations.filter((r) => r.status === 'occupied')}
                isLoading={isLoading}
                showActions={false}
              />
            </TabPanel>

            <TabPanel id="history" activeTab={activeTab}>
              <ReservationTable
                reservations={reservations}
                isLoading={isLoading}
                showActions={false}
              />
            </TabPanel>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
