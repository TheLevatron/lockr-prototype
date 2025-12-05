// Types aligned with the LockR thesis data model
// Matches server types for type safety across frontend and backend

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  courseStrand?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  branchId?: string;
  address?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FloorPlan {
  id: string;
  locationId: string;
  floorNumber: number;
  floorName: string;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 'pending' | 'for_endorsement' | 'for_approval' | 'approved' | 'cancelled' | 'expired';

export interface Reservation {
  id: string;
  referralSlipNo: string;
  userId: string;
  lockerId: string;
  status: ReservationStatus;
  reservationTimeStart: string;
  reservationTimeEnd: string;
  agreementDateStart?: string;
  agreementDateEnd?: string;
  term?: string;
  agreement: boolean;
  duplicate?: boolean;
  receiptUrl?: string;
  paymentAdviceSlipUrl?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types
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
  user: User;
}

export interface CreateReservationRequest {
  lockerId: string;
  reservationTimeStart: string;
  reservationTimeEnd: string;
  term?: string;
}

export interface CreateLockerRequest {
  lockerNumber: string;
  locationId: string;
  floorNumber: number;
  size?: 'small' | 'medium' | 'large';
  accessible?: boolean;
}
