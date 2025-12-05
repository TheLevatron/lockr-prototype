import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../data/store';
import { Reservation, CreateReservationRequest, ReservationStatus } from '../types';
import { updateLockerStatus, getLockerById } from './lockerService';

// Generate a unique referral slip number (as per thesis Section 3.3.9.3)
function generateReferralSlipNo(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RS-${timestamp}-${random}`;
}

export function getAllReservations(): Reservation[] {
  return Array.from(dataStore.reservations.values());
}

export function getReservationById(id: string): Reservation | null {
  return dataStore.reservations.get(id) || null;
}

export function getReservationsByUser(userId: string): Reservation[] {
  return Array.from(dataStore.reservations.values()).filter(
    (reservation) => reservation.userId === userId
  );
}

export function getReservationsByStatus(status: ReservationStatus): Reservation[] {
  return Array.from(dataStore.reservations.values()).filter(
    (reservation) => reservation.status === status
  );
}

export function getReservationsByLocker(lockerId: string): Reservation[] {
  return Array.from(dataStore.reservations.values()).filter(
    (reservation) => reservation.lockerId === lockerId
  );
}

export function createReservation(
  userId: string,
  data: CreateReservationRequest
): Reservation {
  // Check if locker exists
  const locker = getLockerById(data.lockerId);
  if (!locker) {
    throw new Error('Locker not found');
  }

  // Check if locker is available
  if (locker.status !== 'available') {
    throw new Error('Locker is not available for reservation');
  }

  // Check if user already has an active reservation
  const existingReservation = Array.from(dataStore.reservations.values()).find(
    (r) => r.userId === userId && 
    ['pending', 'for_endorsement', 'for_approval', 'approved'].includes(r.status)
  );
  if (existingReservation) {
    throw new Error('You already have an active reservation');
  }

  const newReservation: Reservation = {
    id: uuidv4(),
    referralSlipNo: generateReferralSlipNo(),
    userId,
    lockerId: data.lockerId,
    status: 'pending', // Initial status as per thesis workflow
    reservationTimeStart: new Date(data.reservationTimeStart),
    reservationTimeEnd: new Date(data.reservationTimeEnd),
    term: data.term,
    agreement: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dataStore.reservations.set(newReservation.id, newReservation);
  
  // Update locker status to reserved
  updateLockerStatus(data.lockerId, 'reserved');

  return newReservation;
}

export function updateReservation(
  id: string,
  updates: Partial<Omit<Reservation, 'id' | 'createdAt' | 'referralSlipNo'>>
): Reservation | null {
  const reservation = dataStore.reservations.get(id);
  if (!reservation) return null;

  const updatedReservation: Reservation = {
    ...reservation,
    ...updates,
    updatedAt: new Date(),
  };

  dataStore.reservations.set(id, updatedReservation);
  return updatedReservation;
}

// Update reservation status (as per thesis workflow: pending -> for_endorsement -> for_approval -> approved)
export function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  approvedBy?: string
): Reservation | null {
  const reservation = dataStore.reservations.get(id);
  if (!reservation) return null;

  const updates: Partial<Reservation> = { status };

  // Set agreement dates when approved
  if (status === 'approved') {
    updates.approvedBy = approvedBy;
    updates.agreementDateStart = new Date();
    updates.agreementDateEnd = reservation.reservationTimeEnd;
    
    // Update locker status to occupied
    updateLockerStatus(reservation.lockerId, 'occupied');
  }

  // Reset locker status if cancelled or expired
  if (status === 'cancelled' || status === 'expired') {
    updateLockerStatus(reservation.lockerId, 'available');
  }

  return updateReservation(id, updates);
}

// Submit for endorsement (student uploads receipt)
export function submitForEndorsement(
  id: string,
  receiptUrl: string
): Reservation | null {
  const reservation = dataStore.reservations.get(id);
  if (!reservation || reservation.status !== 'pending') {
    throw new Error('Reservation not found or not in pending status');
  }

  return updateReservation(id, {
    status: 'for_endorsement',
    receiptUrl,
  });
}

// Endorse reservation (move to for_approval)
export function endorseReservation(id: string): Reservation | null {
  const reservation = dataStore.reservations.get(id);
  if (!reservation || reservation.status !== 'for_endorsement') {
    throw new Error('Reservation not found or not in for_endorsement status');
  }

  return updateReservation(id, { status: 'for_approval' });
}

// Approve reservation
export function approveReservation(id: string, approvedBy: string): Reservation | null {
  const reservation = dataStore.reservations.get(id);
  if (!reservation || reservation.status !== 'for_approval') {
    throw new Error('Reservation not found or not in for_approval status');
  }

  return updateReservationStatus(id, 'approved', approvedBy);
}

// Cancel reservation
export function cancelReservation(id: string): Reservation | null {
  const reservation = dataStore.reservations.get(id);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (['cancelled', 'expired'].includes(reservation.status)) {
    throw new Error('Reservation is already cancelled or expired');
  }

  return updateReservationStatus(id, 'cancelled');
}

// Extend reservation
export function extendReservation(id: string, newEndDate: string): Reservation | null {
  const reservation = dataStore.reservations.get(id);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (reservation.status !== 'approved') {
    throw new Error('Only approved reservations can be extended');
  }

  return updateReservation(id, {
    reservationTimeEnd: new Date(newEndDate),
    agreementDateEnd: new Date(newEndDate),
  });
}

// Accept agreement
export function acceptAgreement(id: string): Reservation | null {
  const reservation = dataStore.reservations.get(id);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  return updateReservation(id, { agreement: true });
}
