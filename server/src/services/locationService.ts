import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../data/store';
import { Location, FloorPlan } from '../types';

// Location Services
export function getAllLocations(): Location[] {
  return Array.from(dataStore.locations.values());
}

export function getLocationById(id: string): Location | null {
  return dataStore.locations.get(id) || null;
}

export function createLocation(data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Location {
  const newLocation: Location = {
    id: uuidv4(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dataStore.locations.set(newLocation.id, newLocation);
  return newLocation;
}

export function updateLocation(
  id: string,
  updates: Partial<Omit<Location, 'id' | 'createdAt'>>
): Location | null {
  const location = dataStore.locations.get(id);
  if (!location) return null;

  const updatedLocation: Location = {
    ...location,
    ...updates,
    updatedAt: new Date(),
  };

  dataStore.locations.set(id, updatedLocation);
  return updatedLocation;
}

export function deleteLocation(id: string): boolean {
  return dataStore.locations.delete(id);
}

// Floor Plan Services
export function getAllFloorPlans(): FloorPlan[] {
  return Array.from(dataStore.floorPlans.values());
}

export function getFloorPlansByLocation(locationId: string): FloorPlan[] {
  return Array.from(dataStore.floorPlans.values()).filter(
    (fp) => fp.locationId === locationId
  );
}

export function getFloorPlanById(id: string): FloorPlan | null {
  return dataStore.floorPlans.get(id) || null;
}

export function createFloorPlan(data: Omit<FloorPlan, 'id' | 'createdAt' | 'updatedAt'>): FloorPlan {
  // Check if floor already exists at location
  const existingFloor = Array.from(dataStore.floorPlans.values()).find(
    (fp) => fp.locationId === data.locationId && fp.floorNumber === data.floorNumber
  );
  if (existingFloor) {
    throw new Error('Floor already exists at this location');
  }

  const newFloorPlan: FloorPlan = {
    id: uuidv4(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dataStore.floorPlans.set(newFloorPlan.id, newFloorPlan);
  return newFloorPlan;
}

export function updateFloorPlan(
  id: string,
  updates: Partial<Omit<FloorPlan, 'id' | 'createdAt'>>
): FloorPlan | null {
  const floorPlan = dataStore.floorPlans.get(id);
  if (!floorPlan) return null;

  const updatedFloorPlan: FloorPlan = {
    ...floorPlan,
    ...updates,
    updatedAt: new Date(),
  };

  dataStore.floorPlans.set(id, updatedFloorPlan);
  return updatedFloorPlan;
}

export function deleteFloorPlan(id: string): boolean {
  return dataStore.floorPlans.delete(id);
}
