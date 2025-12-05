// Types aligned with the LockR thesis data model
// Reference: Section 3.3.8 Entity Relationship Diagram and Section 3.3.9 Data Dictionary

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string; // bcrypt hash
  firstName: string;
  lastName: string;
  role: UserRole;
  courseStrand?: string; // For students
  department?: string; // For admin/OSAS
  createdAt: Date;
  updatedAt: Date;
}

export type LockerStatus = 'available' | 'reserved' | 'occupied' | 'unavailable';

export interface Locker {
  id: string;
  lockerNumber: string;
  locationId: string;
  floorNumber: number;
  status: LockerStatus;
  size?: 'small' | 'medium' | 'large';
  accessible?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  branchId?: string;
  address?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FloorPlan {
  id: string;
  locationId: string;
  floorNumber: number;
  floorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ReservationStatus = 'pending' | 'for_endorsement' | 'for_approval' | 'approved' | 'cancelled' | 'expired';

export interface Reservation {
  id: string;
  referralSlipNo: string;
  userId: string;
  lockerId: string;
  status: ReservationStatus;
  reservationTimeStart: Date;
  reservationTimeEnd: Date;
  agreementDateStart?: Date;
  agreementDateEnd?: Date;
  term?: string;
  agreement: boolean;
  duplicate?: boolean;
  receiptUrl?: string;
  paymentAdviceSlipUrl?: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceTicket {
  id: string;
  lockerId: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  reportedBy: string;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  courseStrand?: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface CreateLockerRequest {
  lockerNumber: string;
  locationId: string;
  floorNumber: number;
  size?: 'small' | 'medium' | 'large';
  accessible?: boolean;
}

export interface CreateReservationRequest {
  lockerId: string;
  reservationTimeStart: string;
  reservationTimeEnd: string;
  term?: string;
}
