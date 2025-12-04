import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../data/store';
import { Locker, CreateLockerRequest, LockerStatus } from '../types';

export function getAllLockers(): Locker[] {
  return Array.from(dataStore.lockers.values());
}

export function getLockerById(id: string): Locker | null {
  return dataStore.lockers.get(id) || null;
}

export function getLockersByLocation(locationId: string): Locker[] {
  return Array.from(dataStore.lockers.values()).filter(
    (locker) => locker.locationId === locationId
  );
}

export function getLockersByFloor(locationId: string, floorNumber: number): Locker[] {
  return Array.from(dataStore.lockers.values()).filter(
    (locker) => locker.locationId === locationId && locker.floorNumber === floorNumber
  );
}

export function getAvailableLockers(
  locationId?: string,
  floorNumber?: number
): Locker[] {
  let lockers = Array.from(dataStore.lockers.values()).filter(
    (locker) => locker.status === 'available'
  );

  if (locationId) {
    lockers = lockers.filter((locker) => locker.locationId === locationId);
  }

  if (floorNumber !== undefined) {
    lockers = lockers.filter((locker) => locker.floorNumber === floorNumber);
  }

  return lockers;
}

export function createLocker(data: CreateLockerRequest): Locker {
  // Check if locker number already exists at location
  const existingLocker = Array.from(dataStore.lockers.values()).find(
    (l) => l.lockerNumber === data.lockerNumber && l.locationId === data.locationId
  );
  if (existingLocker) {
    throw new Error('Locker number already exists at this location');
  }

  const newLocker: Locker = {
    id: uuidv4(),
    lockerNumber: data.lockerNumber,
    locationId: data.locationId,
    floorNumber: data.floorNumber,
    status: 'available',
    size: data.size || 'medium',
    accessible: data.accessible || false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dataStore.lockers.set(newLocker.id, newLocker);
  return newLocker;
}

export function updateLocker(
  id: string,
  updates: Partial<Omit<Locker, 'id' | 'createdAt'>>
): Locker | null {
  const locker = dataStore.lockers.get(id);
  if (!locker) return null;

  const updatedLocker: Locker = {
    ...locker,
    ...updates,
    updatedAt: new Date(),
  };

  dataStore.lockers.set(id, updatedLocker);
  return updatedLocker;
}

export function updateLockerStatus(id: string, status: LockerStatus): Locker | null {
  return updateLocker(id, { status });
}

export function deleteLocker(id: string): boolean {
  return dataStore.lockers.delete(id);
}
