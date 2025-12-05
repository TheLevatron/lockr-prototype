// LockR Type Definitions
// Based on thesis: "LockR: A Digital Platform for Management of School Lockers"

export type LockerStatus = 'available' | 'occupied' | 'reserved' | 'pending' | 'disabled';

export type UserRole = 'student' | 'officer' | 'admin';

export type ReservationStatus = 
  | 'for_endorsement'    // Awaiting officer review
  | 'for_approval'       // Awaiting admin approval
  | 'approved'           // Reservation approved
  | 'rejected'           // Reservation rejected
  | 'occupied';          // Currently in use

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Floor {
  id: string;
  name: string;
  building: string;
  floorNumber: number;
  description?: string;
  imageUrl?: string;
  lockerCount: number;
  availableCount: number;
}

export interface Locker {
  id: string;
  number: string;
  floorId: string;
  status: LockerStatus;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
  };
  currentOccupant?: User;
  reservationId?: string;
}

export interface Reservation {
  id: string;
  lockerId: string;
  locker: Locker;
  userId: string;
  user: User;
  status: ReservationStatus;
  academicYear: string;
  semester: 'first' | 'second' | 'summer';
  receiptUrl?: string;
  receiptUploadedAt?: string;
  agreedToTerms: boolean;
  createdAt: string;
  updatedAt: string;
  approvedBy?: User;
  approvedAt?: string;
  endorsedBy?: User;
  endorsedAt?: string;
  notes?: string;
}

export interface AcademicYear {
  id: string;
  year: string;          // e.g., "2024-2025"
  semester: 'first' | 'second' | 'summer';
  startDate: string;
  endDate: string;
  isActive: boolean;
  reservationStartDate: string;
  reservationEndDate: string;
}

export interface ReservationPolicy {
  id: string;
  title: string;
  content: string;
  version: number;
  isActive: boolean;
  effectiveDate: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface ReservationFormData {
  lockerId: string;
  agreedToTerms: boolean;
  receiptFile?: File;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types for admin tables
export interface ReservationFilters {
  status?: ReservationStatus;
  floorId?: string;
  search?: string;
  academicYear?: string;
}
