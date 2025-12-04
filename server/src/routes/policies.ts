import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllPolicies,
  getActivePolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from '../services/policyService';

const router = Router();

// GET /api/policies - Get all policies (active only for students)
router.get('/', authMiddleware, (req: Request, res: Response) => {
  let policies;
  if (req.user?.role === 'admin') {
    policies = getAllPolicies();
  } else {
    policies = getActivePolicies();
  }
  res.json({ policies });
});

// GET /api/policies/:id - Get policy by ID
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const policy = getPolicyById(id);

  if (!policy) {
    res.status(404).json({ error: 'Policy not found' });
    return;
  }

  res.json({ policy });
});

// POST /api/policies - Create a new policy (admin only)
router.post('/', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  try {
    const { title, content, isActive = true } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const policy = createPolicy({ title, content, isActive });
    res.status(201).json({ policy });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create policy';
    res.status(400).json({ error: message });
  }
});

// PUT /api/policies/:id - Update a policy (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const policy = updatePolicy(id, updates);

  if (!policy) {
    res.status(404).json({ error: 'Policy not found' });
    return;
  }

  res.json({ policy });
});

// DELETE /api/policies/:id - Delete a policy (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = deletePolicy(id);

  if (!deleted) {
    res.status(404).json({ error: 'Policy not found' });
    return;
  }

  res.json({ message: 'Policy deleted successfully' });
});

export default router;
