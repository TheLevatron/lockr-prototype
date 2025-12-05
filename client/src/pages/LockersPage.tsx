import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocations, useFloors } from '../hooks/useLocations';
import { useLockersByLocation } from '../hooks/useLockers';
import { usePolicies } from '../hooks/usePolicies';
import { useCreateReservation } from '../hooks/useReservations';
import { LockerGrid, LockerLegend } from '../components/LockerGrid';
import type { Locker } from '../types';

export function LockersPage() {
  const navigate = useNavigate();
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: policies } = usePolicies();
  const createReservation = useCreateReservation();

  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<number | undefined>();
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const { data: floors } = useFloors(selectedLocationId);
  const { data: lockers, isLoading: lockersLoading } = useLockersByLocation(
    selectedLocationId,
    selectedFloor
  );

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    setSelectedFloor(undefined);
    setSelectedLocker(null);
  };

  const handleFloorChange = (floor: number | undefined) => {
    setSelectedFloor(floor);
    setSelectedLocker(null);
  };

  const handleLockerClick = (locker: Locker) => {
    if (locker.status === 'available') {
      setSelectedLocker(locker);
      setShowPolicyModal(true);
    }
  };

  const handlePolicyAccept = () => {
    setShowPolicyModal(false);
    setShowReservationModal(true);
  };

  const handleReserve = async () => {
    if (!selectedLocker) return;

    try {
      // Default reservation for current term
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 4); // 4 months for a term

      await createReservation.mutateAsync({
        lockerId: selectedLocker.id,
        reservationTimeStart: startDate.toISOString(),
        reservationTimeEnd: endDate.toISOString(),
        term: 'Current Term',
      });

      setShowReservationModal(false);
      setSelectedLocker(null);
      navigate('/dashboard');
    } catch (error) {
      console.error('Reservation failed:', error);
    }
  };

  if (locationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Lockers</h1>
        <p className="mt-2 text-gray-600">
          Select a location and floor to view available lockers.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={selectedLocationId}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a location</option>
              {locations?.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Floor
            </label>
            <select
              value={selectedFloor ?? ''}
              onChange={(e) =>
                handleFloorChange(e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={!selectedLocationId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">All floors</option>
              {floors?.map((floor) => (
                <option key={floor.id} value={floor.floorNumber}>
                  {floor.floorName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Locker Grid */}
      {selectedLocationId && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <LockerLegend />
          {lockersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : lockers && lockers.length > 0 ? (
            <LockerGrid
              lockers={lockers}
              onLockerClick={handleLockerClick}
              selectedLockerId={selectedLocker?.id}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No lockers found for this selection.
            </div>
          )}
        </div>
      )}

      {!selectedLocationId && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Select a location</h3>
          <p className="mt-2 text-gray-500">
            Choose a location from the dropdown to view available lockers.
          </p>
        </div>
      )}

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Locker Usage Policy
              </h2>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {policies && policies.length > 0 ? (
                <div className="prose prose-sm">
                  <h3 className="text-lg font-medium">{policies[0].title}</h3>
                  <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans">
                    {policies[0].content}
                  </pre>
                </div>
              ) : (
                <p className="text-gray-600">
                  By proceeding with this reservation, you agree to follow all locker usage rules and regulations set by the institution.
                </p>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowPolicyModal(false);
                  setSelectedLocker(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePolicyAccept}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Confirmation Modal */}
      {showReservationModal && selectedLocker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Confirm Reservation
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Locker Number</label>
                  <p className="text-lg font-semibold">{selectedLocker.lockerNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Floor</label>
                  <p className="text-lg">{selectedLocker.floorNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Size</label>
                  <p className="text-lg capitalize">{selectedLocker.size}</p>
                </div>
                {selectedLocker.accessible && (
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">♿</span>
                    <span>Accessible locker</span>
                  </div>
                )}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-800">
                    After reservation, you will receive a referral slip. Please proceed to the Finance department for payment, then submit your receipt for approval.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowReservationModal(false);
                  setSelectedLocker(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                disabled={createReservation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createReservation.isPending ? 'Reserving...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
