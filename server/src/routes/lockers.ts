import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllLockers,
  getLockerById,
  getLockersByLocation,
  getLockersByFloor,
  getAvailableLockers,
  createLocker,
  updateLocker,
  deleteLocker,
} from '../services/lockerService';
import { CreateLockerRequest } from '../types';

const router = Router();

// GET /api/lockers - Get all lockers
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const lockers = getAllLockers();
  res.json({ lockers });
});

// GET /api/lockers/availability - Get available lockers with filters
router.get('/availability', authMiddleware, (req: Request, res: Response) => {
  const { location, floor } = req.query;
  const floorNumber = floor ? parseInt(floor as string) : undefined;
  
  const lockers = getAvailableLockers(location as string, floorNumber);
  res.json({ lockers });
});

// GET /api/lockers/location/:locationId - Get lockers by location
router.get('/location/:locationId', authMiddleware, (req: Request, res: Response) => {
  const { locationId } = req.params;
  const { floor } = req.query;

  let lockers;
  if (floor) {
    lockers = getLockersByFloor(locationId, parseInt(floor as string));
  } else {
    lockers = getLockersByLocation(locationId);
  }

  res.json({ lockers });
});

// GET /api/lockers/:id - Get locker by ID
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const locker = getLockerById(id);

  if (!locker) {
    res.status(404).json({ error: 'Locker not found' });
    return;
  }

  res.json({ locker });
});

// POST /api/lockers - Create a new locker (admin only)
router.post('/', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  try {
    const data: CreateLockerRequest = req.body;

    if (!data.lockerNumber || !data.locationId || data.floorNumber === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const locker = createLocker(data);
    res.status(201).json({ locker });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create locker';
    res.status(400).json({ error: message });
  }
});

// PUT /api/lockers/:id - Update a locker (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const locker = updateLocker(id, updates);

  if (!locker) {
    res.status(404).json({ error: 'Locker not found' });
    return;
  }

  res.json({ locker });
});

// DELETE /api/lockers/:id - Delete a locker (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = deleteLocker(id);

  if (!deleted) {
    res.status(404).json({ error: 'Locker not found' });
    return;
  }

  res.json({ message: 'Locker deleted successfully' });
});

export default router;
