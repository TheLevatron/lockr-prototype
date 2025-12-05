import type { 
  Floor, 
  Locker, 
  Reservation, 
  AcademicYear, 
  ReservationPolicy,
  ApiResponse,
  PaginatedResponse,
  ReservationFilters,
  ReservationStatus,
  User 
} from '@/types';
import { 
  mockFloors, 
  mockLockers, 
  mockReservations, 
  mockAcademicYear, 
  mockPolicy 
} from './mockData';

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Floor services
export const floorService = {
  async getFloors(): Promise<ApiResponse<Floor[]>> {
    await delay(300);
    return { data: mockFloors, success: true };
  },

  async getFloorById(id: string): Promise<ApiResponse<Floor | null>> {
    await delay(200);
    const floor = mockFloors.find((f) => f.id === id);
    return { 
      data: floor || null, 
      success: !!floor,
      message: floor ? undefined : 'Floor not found',
    };
  },
};

// Locker services
export const lockerService = {
  async getLockersByFloor(floorId: string): Promise<ApiResponse<Locker[]>> {
    await delay(300);
    const lockers = mockLockers[floorId] || [];
    return { data: lockers, success: true };
  },

  async getLockerById(id: string): Promise<ApiResponse<Locker | null>> {
    await delay(200);
    for (const floorLockers of Object.values(mockLockers)) {
      const locker = floorLockers.find((l) => l.id === id);
      if (locker) {
        return { data: locker, success: true };
      }
    }
    return { data: null, success: false, message: 'Locker not found' };
  },

  async updateLocker(id: string, updates: Partial<Locker>): Promise<ApiResponse<Locker>> {
    await delay(400);
    for (const floorLockers of Object.values(mockLockers)) {
      const index = floorLockers.findIndex((l) => l.id === id);
      if (index >= 0) {
        const updated = { ...floorLockers[index], ...updates };
        floorLockers[index] = updated;
        return { data: updated, success: true, message: 'Locker updated successfully' };
      }
    }
    throw new Error('Locker not found');
  },

  async addLocker(floorId: string, locker: Omit<Locker, 'id'>): Promise<ApiResponse<Locker>> {
    await delay(400);
    const newLocker: Locker = {
      ...locker,
      id: `${floorId}-l${Date.now()}`,
    };
    if (mockLockers[floorId]) {
      mockLockers[floorId].push(newLocker);
    } else {
      mockLockers[floorId] = [newLocker];
    }
    return { data: newLocker, success: true, message: 'Locker added successfully' };
  },

  async deleteLocker(id: string): Promise<ApiResponse<boolean>> {
    await delay(400);
    for (const [floorId, floorLockers] of Object.entries(mockLockers)) {
      const index = floorLockers.findIndex((l) => l.id === id);
      if (index >= 0) {
        mockLockers[floorId].splice(index, 1);
        return { data: true, success: true, message: 'Locker deleted successfully' };
      }
    }
    return { data: false, success: false, message: 'Locker not found' };
  },
};

// Reservation services
export const reservationService = {
  async getReservations(
    filters?: ReservationFilters,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Reservation>> {
    await delay(400);
    
    let filtered = [...mockReservations];
    
    if (filters?.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }
    if (filters?.floorId) {
      filtered = filtered.filter((r) => r.locker.floorId === filters.floorId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.user.firstName.toLowerCase().includes(search) ||
          r.user.lastName.toLowerCase().includes(search) ||
          r.locker.number.toLowerCase().includes(search) ||
          r.user.studentId?.toLowerCase().includes(search)
      );
    }
    
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);
    
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async getReservationById(id: string): Promise<ApiResponse<Reservation | null>> {
    await delay(200);
    const reservation = mockReservations.find((r) => r.id === id);
    return {
      data: reservation || null,
      success: !!reservation,
      message: reservation ? undefined : 'Reservation not found',
    };
  },

  async createReservation(
    lockerId: string,
    userId: string,
    agreedToTerms: boolean
  ): Promise<ApiResponse<Reservation>> {
    await delay(500);
    
    const locker = Object.values(mockLockers)
      .flat()
      .find((l) => l.id === lockerId);
    
    if (!locker) {
      throw new Error('Locker not found');
    }
    
    if (locker.status !== 'available') {
      throw new Error('Locker is not available');
    }
    
    const newReservation: Reservation = {
      id: `r${Date.now()}`,
      lockerId,
      locker,
      userId,
      user: {
        id: userId,
        email: 'student@lockr.edu',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        studentId: '2024-00001',
        role: 'student',
      },
      status: 'for_endorsement',
      academicYear: mockAcademicYear.year,
      semester: mockAcademicYear.semester,
      agreedToTerms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockReservations.push(newReservation);
    locker.status = 'pending';
    
    return { data: newReservation, success: true, message: 'Reservation created successfully' };
  },

  async uploadReceipt(
    reservationId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<string>> {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await delay(100);
      onProgress?.(i);
    }
    
    const reservation = mockReservations.find((r) => r.id === reservationId);
    if (reservation) {
      reservation.receiptUrl = URL.createObjectURL(file);
      reservation.receiptUploadedAt = new Date().toISOString();
      reservation.updatedAt = new Date().toISOString();
    }
    
    return { 
      data: reservation?.receiptUrl || '', 
      success: true, 
      message: 'Receipt uploaded successfully' 
    };
  },

  async updateReservationStatus(
    id: string,
    status: ReservationStatus,
    reviewer: User,
    notes?: string
  ): Promise<ApiResponse<Reservation>> {
    await delay(400);
    
    const reservation = mockReservations.find((r) => r.id === id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    reservation.status = status;
    reservation.updatedAt = new Date().toISOString();
    reservation.notes = notes;
    
    if (status === 'for_approval') {
      reservation.endorsedBy = reviewer;
      reservation.endorsedAt = new Date().toISOString();
    } else if (status === 'approved' || status === 'occupied') {
      reservation.approvedBy = reviewer;
      reservation.approvedAt = new Date().toISOString();
    }
    
    // Update locker status
    const locker = Object.values(mockLockers)
      .flat()
      .find((l) => l.id === reservation.lockerId);
    if (locker) {
      if (status === 'occupied') {
        locker.status = 'occupied';
      } else if (status === 'rejected') {
        locker.status = 'available';
      }
    }
    
    return { data: reservation, success: true, message: `Reservation ${status}` };
  },
};

// Academic year services
export const academicYearService = {
  async getCurrentAcademicYear(): Promise<ApiResponse<AcademicYear>> {
    await delay(200);
    return { data: mockAcademicYear, success: true };
  },

  async updateAcademicYear(updates: Partial<AcademicYear>): Promise<ApiResponse<AcademicYear>> {
    await delay(400);
    Object.assign(mockAcademicYear, updates);
    return { data: mockAcademicYear, success: true, message: 'Academic year updated' };
  },
};

// Policy services
export const policyService = {
  async getActivePolicy(): Promise<ApiResponse<ReservationPolicy>> {
    await delay(200);
    return { data: mockPolicy, success: true };
  },
};
