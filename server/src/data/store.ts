// In-memory data store with pluggable persistence interface
// This implementation uses in-memory storage but can be easily replaced with SQLite or JSON file storage

import { User, Locker, Location, FloorPlan, Reservation, Policy, MaintenanceTicket } from '../types';

export interface DataStore {
  users: Map<string, User>;
  lockers: Map<string, Locker>;
  locations: Map<string, Location>;
  floorPlans: Map<string, FloorPlan>;
  reservations: Map<string, Reservation>;
  policies: Map<string, Policy>;
  maintenanceTickets: Map<string, MaintenanceTicket>;
}

// Create the in-memory store
export const dataStore: DataStore = {
  users: new Map(),
  lockers: new Map(),
  locations: new Map(),
  floorPlans: new Map(),
  reservations: new Map(),
  policies: new Map(),
  maintenanceTickets: new Map(),
};

// Persistence interface for future implementations (JSON file, SQLite, etc.)
export interface PersistenceAdapter {
  load(): Promise<DataStore>;
  save(store: DataStore): Promise<void>;
}

// In-memory adapter (no persistence)
export class InMemoryAdapter implements PersistenceAdapter {
  async load(): Promise<DataStore> {
    return dataStore;
  }

  async save(_store: DataStore): Promise<void> {
    // No-op for in-memory storage
  }
}

// JSON file adapter placeholder for future implementation
export class JsonFileAdapter implements PersistenceAdapter {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async load(): Promise<DataStore> {
    // TODO: Implement JSON file loading
    console.log(`Would load from ${this.filePath}`);
    return dataStore;
  }

  async save(_store: DataStore): Promise<void> {
    // TODO: Implement JSON file saving
    console.log(`Would save to ${this.filePath}`);
  }
}

// Export the current adapter
export let persistenceAdapter: PersistenceAdapter = new InMemoryAdapter();

export function setPersistenceAdapter(adapter: PersistenceAdapter): void {
  persistenceAdapter = adapter;
}
