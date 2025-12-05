import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocations, useFloors, useCreateLocation, useCreateFloor } from '../hooks/useLocations';
import { useLockers, useCreateLocker, useDeleteLocker } from '../hooks/useLockers';
import { useReservations, useEndorseReservation, useApproveReservation, useCancelReservation } from '../hooks/useReservations';
import type { Reservation, Locker } from '../types';

type Tab = 'reservations' | 'lockers' | 'locations';

export function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('reservations');

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-red-800">Access Denied</h2>
          <p className="mt-2 text-red-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage lockers, locations, and reservations.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'reservations', label: 'Reservations' },
            { id: 'lockers', label: 'Lockers' },
            { id: 'locations', label: 'Locations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'reservations' && <ReservationsTab />}
      {activeTab === 'lockers' && <LockersTab />}
      {activeTab === 'locations' && <LocationsTab />}
    </div>
  );
}

function ReservationsTab() {
  const { data: reservations, isLoading } = useReservations();
  const { data: lockers } = useLockers();
  const endorseMutation = useEndorseReservation();
  const approveMutation = useApproveReservation();
  const cancelMutation = useCancelReservation();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReservations = reservations?.filter((r) =>
    statusFilter === 'all' ? true : r.status === statusFilter
  );

  const getLocker = (lockerId: string) => lockers?.find((l: Locker) => l.id === lockerId);

  const getStatusBadge = (status: Reservation['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      for_endorsement: 'bg-blue-100 text-blue-800',
      for_approval: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">All Reservations</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="for_endorsement">For Endorsement</option>
          <option value="for_approval">For Approval</option>
          <option value="approved">Approved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referral Slip
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Locker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReservations?.map((reservation) => {
              const locker = getLocker(reservation.lockerId);
              return (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reservation.referralSlipNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {locker?.lockerNumber || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.reservationTimeStart).toLocaleDateString()} -{' '}
                    {new Date(reservation.reservationTimeEnd).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(reservation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {reservation.status === 'for_endorsement' && (
                        <button
                          onClick={() => endorseMutation.mutate(reservation.id)}
                          disabled={endorseMutation.isPending}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Endorse
                        </button>
                      )}
                      {reservation.status === 'for_approval' && (
                        <button
                          onClick={() => approveMutation.mutate(reservation.id)}
                          disabled={approveMutation.isPending}
                          className="text-green-600 hover:text-green-800"
                        >
                          Approve
                        </button>
                      )}
                      {!['cancelled', 'expired', 'approved'].includes(reservation.status) && (
                        <button
                          onClick={() => cancelMutation.mutate(reservation.id)}
                          disabled={cancelMutation.isPending}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!filteredReservations || filteredReservations.length === 0) && (
          <div className="text-center py-8 text-gray-500">No reservations found.</div>
        )}
      </div>
    </div>
  );
}

function LockersTab() {
  const { data: lockers, isLoading } = useLockers();
  const { data: locations } = useLocations();
  const createMutation = useCreateLocker();
  const deleteMutation = useDeleteLocker();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    lockerNumber: '',
    locationId: '',
    floorNumber: '',
    size: 'medium' as 'small' | 'medium' | 'large',
    accessible: false,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      ...formData,
      floorNumber: parseInt(formData.floorNumber),
    });
    setFormData({
      lockerNumber: '',
      locationId: '',
      floorNumber: '',
      size: 'medium',
      accessible: false,
    });
    setShowCreateForm(false);
  };

  const getLocation = (locationId: string) => locations?.find((l) => l.id === locationId);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">All Lockers</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Add Locker'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locker Number
              </label>
              <input
                type="text"
                value={formData.lockerNumber}
                onChange={(e) => setFormData({ ...formData, lockerNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select location</option>
                {locations?.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor Number
              </label>
              <input
                type="number"
                value={formData.floorNumber}
                onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as 'small' | 'medium' | 'large' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.accessible}
                  onChange={(e) => setFormData({ ...formData, accessible: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Accessible (♿)</span>
              </label>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Locker'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Floor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lockers?.map((locker: Locker) => (
              <tr key={locker.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {locker.lockerNumber}
                  {locker.accessible && <span className="ml-2">♿</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getLocation(locker.locationId)?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {locker.floorNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {locker.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    locker.status === 'available' ? 'bg-green-100 text-green-800' :
                    locker.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                    locker.status === 'occupied' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {locker.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => deleteMutation.mutate(locker.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!lockers || lockers.length === 0) && (
          <div className="text-center py-8 text-gray-500">No lockers found.</div>
        )}
      </div>
    </div>
  );
}

function LocationsTab() {
  const { data: locations, isLoading } = useLocations();
  const createLocationMutation = useCreateLocation();
  const createFloorMutation = useCreateFloor();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFloorForm, setShowFloorForm] = useState<string | null>(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    branchId: '',
    address: '',
    description: '',
  });
  const [floorForm, setFloorForm] = useState({
    floorNumber: '',
    floorName: '',
  });

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLocationMutation.mutateAsync(locationForm);
    setLocationForm({ name: '', branchId: '', address: '', description: '' });
    setShowCreateForm(false);
  };

  const handleCreateFloor = async (e: React.FormEvent, locationId: string) => {
    e.preventDefault();
    await createFloorMutation.mutateAsync({
      locationId,
      floorNumber: parseInt(floorForm.floorNumber),
      floorName: floorForm.floorName,
    });
    setFloorForm({ floorNumber: '', floorName: '' });
    setShowFloorForm(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Add Location'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateLocation} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={locationForm.name}
                onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch ID</label>
              <input
                type="text"
                value={locationForm.branchId}
                onChange={(e) => setLocationForm({ ...locationForm, branchId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={locationForm.address}
                onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={locationForm.description}
                onChange={(e) => setLocationForm({ ...locationForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={createLocationMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {createLocationMutation.isPending ? 'Creating...' : 'Create Location'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {locations?.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            showFloorForm={showFloorForm}
            setShowFloorForm={setShowFloorForm}
            floorForm={floorForm}
            setFloorForm={setFloorForm}
            onCreateFloor={handleCreateFloor}
            isCreatingFloor={createFloorMutation.isPending}
          />
        ))}
        {(!locations || locations.length === 0) && (
          <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
            No locations found.
          </div>
        )}
      </div>
    </div>
  );
}

function LocationCard({
  location,
  showFloorForm,
  setShowFloorForm,
  floorForm,
  setFloorForm,
  onCreateFloor,
  isCreatingFloor,
}: {
  location: { id: string; name: string; branchId?: string; address?: string; description?: string };
  showFloorForm: string | null;
  setShowFloorForm: (id: string | null) => void;
  floorForm: { floorNumber: string; floorName: string };
  setFloorForm: (form: { floorNumber: string; floorName: string }) => void;
  onCreateFloor: (e: React.FormEvent, locationId: string) => void;
  isCreatingFloor: boolean;
}) {
  const { data: floors } = useFloors(location.id);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
          {location.branchId && (
            <p className="text-sm text-gray-500">Branch: {location.branchId}</p>
          )}
          {location.address && (
            <p className="text-sm text-gray-500">{location.address}</p>
          )}
        </div>
        <button
          onClick={() => setShowFloorForm(showFloorForm === location.id ? null : location.id)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showFloorForm === location.id ? 'Cancel' : 'Add Floor'}
        </button>
      </div>

      {showFloorForm === location.id && (
        <form
          onSubmit={(e) => onCreateFloor(e, location.id)}
          className="mt-4 p-4 bg-gray-50 rounded-md"
        >
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Floor Number"
              value={floorForm.floorNumber}
              onChange={(e) => setFloorForm({ ...floorForm, floorNumber: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Floor Name (e.g., 2nd Floor)"
              value={floorForm.floorName}
              onChange={(e) => setFloorForm({ ...floorForm, floorName: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              disabled={isCreatingFloor}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {floors && floors.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Floors:</p>
          <div className="flex flex-wrap gap-2">
            {floors.map((floor) => (
              <span
                key={floor.id}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {floor.floorName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
