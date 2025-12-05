// Seed data for development - aligned with thesis requirements
// Reference: Section 3.4 Development Plan - mockups show floors and locker grids

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { dataStore } from './store';
import { User, Location, FloorPlan, Locker, Policy } from '../types';

const SALT_ROUNDS = 10;

export async function seedData(): Promise<void> {
  console.log('Seeding database with initial data...');

  // Create default admin user (OSAS staff)
  const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  const adminUser: User = {
    id: uuidv4(),
    email: 'admin@iacademy.edu.ph',
    password: adminPassword,
    firstName: 'Admin',
    lastName: 'OSAS',
    role: 'admin',
    department: 'OSAS',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  dataStore.users.set(adminUser.id, adminUser);

  // Create sample student
  const studentPassword = await bcrypt.hash('student123', SALT_ROUNDS);
  const studentUser: User = {
    id: uuidv4(),
    email: 'student@iacademy.edu.ph',
    password: studentPassword,
    firstName: 'John',
    lastName: 'Doe',
    role: 'student',
    courseStrand: 'BSIT',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  dataStore.users.set(studentUser.id, studentUser);

  // Create location (iACADEMY building)
  const location: Location = {
    id: uuidv4(),
    name: 'iACADEMY Main Building',
    branchId: 'MAIN',
    address: 'Makati City, Philippines',
    description: 'Main campus building with student lockers on multiple floors',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  dataStore.locations.set(location.id, location);

  // Create floor plans (as shown in thesis mockups)
  const floors = [
    { number: 2, name: '2nd Floor' },
    { number: 3, name: '3rd Floor' },
    { number: 4, name: '4th Floor' },
    { number: 5, name: '5th Floor' },
  ];

  for (const floor of floors) {
    const floorPlan: FloorPlan = {
      id: uuidv4(),
      locationId: location.id,
      floorNumber: floor.number,
      floorName: floor.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dataStore.floorPlans.set(floorPlan.id, floorPlan);

    // Create lockers for each floor (10 lockers per floor for demo)
    // Use deterministic pattern: lockers 5, 6, 7, 10 are occupied on each floor
    const occupiedLockers = [5, 6, 7, 10];
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    
    for (let i = 1; i <= 10; i++) {
      const locker: Locker = {
        id: uuidv4(),
        lockerNumber: `${floor.number}${i.toString().padStart(2, '0')}`,
        locationId: location.id,
        floorNumber: floor.number,
        status: occupiedLockers.includes(i) ? 'occupied' : 'available',
        size: sizes[(i - 1) % 3], // Cycle through sizes deterministically
        accessible: i === 1 || i === 2, // First two lockers are accessible
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dataStore.lockers.set(locker.id, locker);
    }
  }

  // Create default policy (as shown in thesis Figure 3.4.1.7)
  const policy: Policy = {
    id: uuidv4(),
    title: 'Locker Usage Rules and Regulations',
    content: `
1. Lockers are for personal use only and may not be shared with other students.
2. Students must keep their lockers clean and in good condition.
3. The school is not responsible for any lost or stolen items.
4. Lockers may be inspected by school authorities at any time.
5. Reservations are valid for the current academic term only.
6. Students must return their keys at the end of the reservation period.
7. Violations may result in termination of locker privileges.
8. Payment must be made within 3 days of reservation.
9. Duplicate keys must be provided to OSAS for emergency access.
10. Any damage to lockers must be reported immediately.
    `.trim(),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  dataStore.policies.set(policy.id, policy);

  console.log('Seed data created successfully!');
  console.log(`- ${dataStore.users.size} users`);
  console.log(`- ${dataStore.locations.size} locations`);
  console.log(`- ${dataStore.floorPlans.size} floor plans`);
  console.log(`- ${dataStore.lockers.size} lockers`);
  console.log(`- ${dataStore.policies.size} policies`);
}
