import type { Floor, Locker, Reservation, AcademicYear, ReservationPolicy } from '@/types';

// Mock Floors
export const mockFloors: Floor[] = [
  {
    id: 'f1',
    name: 'Ground Floor',
    building: 'Main Building',
    floorNumber: 1,
    description: 'Ground floor lockers near the entrance',
    lockerCount: 50,
    availableCount: 15,
  },
  {
    id: 'f2',
    name: 'Second Floor',
    building: 'Main Building',
    floorNumber: 2,
    description: 'Second floor lockers near classrooms',
    lockerCount: 60,
    availableCount: 22,
  },
  {
    id: 'f3',
    name: 'Third Floor',
    building: 'Main Building',
    floorNumber: 3,
    description: 'Third floor lockers near library',
    lockerCount: 40,
    availableCount: 8,
  },
  {
    id: 'f4',
    name: 'Fourth Floor',
    building: 'Science Building',
    floorNumber: 4,
    description: 'Science building lockers',
    lockerCount: 30,
    availableCount: 12,
  },
];

// Generate mock lockers for a floor
function generateLockers(floorId: string, count: number): Locker[] {
  const lockers: Locker[] = [];
  const columns = 10;
  
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / columns);
    const col = i % columns;
    const statusIndex = Math.random();
    let status: Locker['status'];
    
    if (statusIndex < 0.3) status = 'available';
    else if (statusIndex < 0.6) status = 'occupied';
    else if (statusIndex < 0.8) status = 'reserved';
    else if (statusIndex < 0.95) status = 'pending';
    else status = 'disabled';
    
    lockers.push({
      id: `${floorId}-l${i + 1}`,
      number: `${floorId.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      floorId,
      status,
      size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as Locker['size'],
      position: { x: col, y: row },
    });
  }
  
  return lockers;
}

// Mock all lockers
export const mockLockers: Record<string, Locker[]> = {
  f1: generateLockers('f1', 50),
  f2: generateLockers('f2', 60),
  f3: generateLockers('f3', 40),
  f4: generateLockers('f4', 30),
};

// Mock reservations
export const mockReservations: Reservation[] = [
  {
    id: 'r1',
    lockerId: 'f1-l5',
    locker: mockLockers.f1[4],
    userId: '1',
    user: {
      id: '1',
      email: 'student@lockr.edu',
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      studentId: '2024-00001',
      role: 'student',
    },
    status: 'for_endorsement',
    academicYear: '2024-2025',
    semester: 'first',
    receiptUrl: '/uploads/receipt1.jpg',
    receiptUploadedAt: '2024-01-15T10:30:00Z',
    agreedToTerms: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'r2',
    lockerId: 'f2-l10',
    locker: mockLockers.f2[9],
    userId: '4',
    user: {
      id: '4',
      email: 'pedro@lockr.edu',
      firstName: 'Pedro',
      lastName: 'Garcia',
      studentId: '2024-00002',
      role: 'student',
    },
    status: 'for_approval',
    academicYear: '2024-2025',
    semester: 'first',
    receiptUrl: '/uploads/receipt2.jpg',
    receiptUploadedAt: '2024-01-14T09:00:00Z',
    agreedToTerms: true,
    createdAt: '2024-01-14T08:30:00Z',
    updatedAt: '2024-01-14T11:00:00Z',
    endorsedBy: {
      id: '2',
      email: 'officer@lockr.edu',
      firstName: 'Maria',
      lastName: 'Santos',
      role: 'officer',
    },
    endorsedAt: '2024-01-14T11:00:00Z',
  },
  {
    id: 'r3',
    lockerId: 'f1-l20',
    locker: mockLockers.f1[19],
    userId: '5',
    user: {
      id: '5',
      email: 'ana@lockr.edu',
      firstName: 'Ana',
      lastName: 'Reyes',
      studentId: '2024-00003',
      role: 'student',
    },
    status: 'occupied',
    academicYear: '2024-2025',
    semester: 'first',
    receiptUrl: '/uploads/receipt3.jpg',
    receiptUploadedAt: '2024-01-10T14:00:00Z',
    agreedToTerms: true,
    createdAt: '2024-01-10T13:30:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    endorsedBy: {
      id: '2',
      email: 'officer@lockr.edu',
      firstName: 'Maria',
      lastName: 'Santos',
      role: 'officer',
    },
    endorsedAt: '2024-01-11T10:00:00Z',
    approvedBy: {
      id: '3',
      email: 'admin@lockr.edu',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
    approvedAt: '2024-01-12T09:00:00Z',
  },
];

// Mock academic year
export const mockAcademicYear: AcademicYear = {
  id: 'ay1',
  year: '2024-2025',
  semester: 'first',
  startDate: '2024-08-01',
  endDate: '2024-12-15',
  isActive: true,
  reservationStartDate: '2024-07-15',
  reservationEndDate: '2024-08-15',
};

// Mock reservation policy
// TODO: Update with actual policy content from thesis PDF Section 4.3
export const mockPolicy: ReservationPolicy = {
  id: 'p1',
  title: 'LockR Locker Reservation Policy',
  content: `
## General Guidelines

1. **Eligibility**: Only currently enrolled students may reserve a locker.

2. **Payment**: A non-refundable reservation fee must be paid before the locker assignment is confirmed. Upload the official receipt as proof of payment.

3. **Duration**: Locker reservations are valid for one academic semester only. Renewal requires a new application.

4. **Contents**: 
   - Do not store prohibited items (weapons, hazardous materials, etc.)
   - Do not store perishable food items
   - The school is not liable for lost or stolen items

5. **Maintenance**:
   - Keep lockers clean and orderly
   - Report any damage immediately
   - Do not tamper with locker mechanisms

6. **Sharing**: Lockers are for individual use only. Sharing or transferring locker access is prohibited.

7. **Inspection**: School administrators reserve the right to inspect lockers at any time for safety and security purposes.

8. **Forfeiture**: Failure to comply with these policies may result in forfeiture of locker privileges.

## Payment Instructions

1. Pay the reservation fee at the Cashier's Office
2. Keep your Official Receipt (OR)
3. Upload a clear photo or scan of your OR in the reservation system
4. Wait for verification and approval

## Contact

For concerns, contact the Student Affairs Office or email lockr@school.edu.
  `,
  version: 1,
  isActive: true,
  effectiveDate: '2024-01-01',
};
