import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getFloorPlansByLocation,
  createFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
} from '../services/locationService';

const router = Router();

// GET /api/locations - Get all locations
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const locations = getAllLocations();
  res.json({ locations });
});

// GET /api/locations/:id - Get location by ID
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const location = getLocationById(id);

  if (!location) {
    res.status(404).json({ error: 'Location not found' });
    return;
  }

  res.json({ location });
});

// GET /api/locations/:id/floors - Get floor plans for a location
router.get('/:id/floors', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const floors = getFloorPlansByLocation(id);
  res.json({ floors });
});

// POST /api/locations - Create a new location (admin only)
router.post('/', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  try {
    const { name, branchId, address, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Location name is required' });
      return;
    }

    const location = createLocation({ name, branchId, address, description });
    res.status(201).json({ location });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create location';
    res.status(400).json({ error: message });
  }
});

// PUT /api/locations/:id - Update a location (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const location = updateLocation(id, updates);

  if (!location) {
    res.status(404).json({ error: 'Location not found' });
    return;
  }

  res.json({ location });
});

// DELETE /api/locations/:id - Delete a location (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = deleteLocation(id);

  if (!deleted) {
    res.status(404).json({ error: 'Location not found' });
    return;
  }

  res.json({ message: 'Location deleted successfully' });
});

// POST /api/locations/:id/floors - Create a floor plan (admin only)
router.post('/:id/floors', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { floorNumber, floorName } = req.body;

    if (floorNumber === undefined || !floorName) {
      res.status(400).json({ error: 'Floor number and name are required' });
      return;
    }

    const floorPlan = createFloorPlan({
      locationId: id,
      floorNumber,
      floorName,
    });
    res.status(201).json({ floorPlan });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create floor plan';
    res.status(400).json({ error: message });
  }
});

// PUT /api/locations/:locationId/floors/:floorId - Update a floor plan (admin only)
router.put('/:locationId/floors/:floorId', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  const { floorId } = req.params;
  const updates = req.body;

  const floorPlan = updateFloorPlan(floorId, updates);

  if (!floorPlan) {
    res.status(404).json({ error: 'Floor plan not found' });
    return;
  }

  res.json({ floorPlan });
});

// DELETE /api/locations/:locationId/floors/:floorId - Delete a floor plan (admin only)
router.delete('/:locationId/floors/:floorId', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  const { floorId } = req.params;
  const deleted = deleteFloorPlan(floorId);

  if (!deleted) {
    res.status(404).json({ error: 'Floor plan not found' });
    return;
  }

  res.json({ message: 'Floor plan deleted successfully' });
});

export default router;
