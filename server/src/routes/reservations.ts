import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllReservations,
  getReservationById,
  getReservationsByUser,
  getReservationsByStatus,
  createReservation,
  submitForEndorsement,
  endorseReservation,
  approveReservation,
  cancelReservation,
  extendReservation,
  acceptAgreement,
} from '../services/reservationService';
import { CreateReservationRequest, ReservationStatus } from '../types';

const router = Router();

// GET /api/reservations - Get all reservations (admin) or user's reservations
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const { status } = req.query;

  const validStatuses = ['pending', 'for_endorsement', 'for_approval', 'approved', 'cancelled', 'expired'];
  
  let reservations;
  if (req.user?.role === 'admin') {
    if (status && validStatuses.includes(status as string)) {
      reservations = getReservationsByStatus(status as ReservationStatus);
    } else {
      reservations = getAllReservations();
    }
  } else {
    reservations = getReservationsByUser(req.user!.id);
  }

  res.json({ reservations });
});

// GET /api/reservations/:id - Get reservation by ID
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const reservation = getReservationById(id);

  if (!reservation) {
    res.status(404).json({ error: 'Reservation not found' });
    return;
  }

  // Check if user has access to this reservation
  if (req.user?.role !== 'admin' && reservation.userId !== req.user?.id) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  res.json({ reservation });
});

// POST /api/reservations - Create a new reservation
router.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const data: CreateReservationRequest = req.body;

    if (!data.lockerId || !data.reservationTimeStart || !data.reservationTimeEnd) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const reservation = createReservation(req.user!.id, data);
    res.status(201).json({ reservation });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create reservation';
    res.status(400).json({ error: message });
  }
});

// PUT /api/reservations/:id/agreement - Accept agreement
router.put('/:id/agreement', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = getReservationById(id);

    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }

    if (reservation.userId !== req.user?.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updated = acceptAgreement(id);
    res.json({ reservation: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to accept agreement';
    res.status(400).json({ error: message });
  }
});

// PUT /api/reservations/:id/submit - Submit for endorsement (upload receipt)
router.put('/:id/submit', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { receiptUrl } = req.body;

    const reservation = getReservationById(id);

    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }

    if (reservation.userId !== req.user?.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updated = submitForEndorsement(id, receiptUrl || 'receipt-stub.pdf');
    res.json({ reservation: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit for endorsement';
    res.status(400).json({ error: message });
  }
});

// PUT /api/reservations/:id/endorse - Endorse reservation (admin only)
router.put('/:id/endorse', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = endorseReservation(id);
    res.json({ reservation: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to endorse reservation';
    res.status(400).json({ error: message });
  }
});

// PUT /api/reservations/:id/approve - Approve reservation (admin only)
router.put('/:id/approve', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = approveReservation(id, req.user!.id);
    res.json({ reservation: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to approve reservation';
    res.status(400).json({ error: message });
  }
});

// PUT /api/reservations/:id/cancel - Cancel reservation
router.put('/:id/cancel', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = getReservationById(id);

    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }

    // Users can only cancel their own reservations, admins can cancel any
    if (req.user?.role !== 'admin' && reservation.userId !== req.user?.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updated = cancelReservation(id);
    res.json({ reservation: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to cancel reservation';
    res.status(400).json({ error: message });
  }
});

// PUT /api/reservations/:id/extend - Extend reservation
router.put('/:id/extend', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newEndDate } = req.body;

    if (!newEndDate) {
      res.status(400).json({ error: 'New end date is required' });
      return;
    }

    const reservation = getReservationById(id);

    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }

    // Only admin or owner can extend
    if (req.user?.role !== 'admin' && reservation.userId !== req.user?.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updated = extendReservation(id, newEndDate);
    res.json({ reservation: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to extend reservation';
    res.status(400).json({ error: message });
  }
});

export default router;
