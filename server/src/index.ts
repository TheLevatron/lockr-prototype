import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import lockerRoutes from './routes/lockers';
import reservationRoutes from './routes/reservations';
import locationRoutes from './routes/locations';
import policyRoutes from './routes/policies';
import { seedData } from './data/seed';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lockers', lockerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/policies', policyRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
async function start() {
  // Seed initial data
  await seedData();

  app.listen(PORT, () => {
    console.log(`🚀 LockR Server running on http://localhost:${PORT}`);
    console.log(`📚 API available at http://localhost:${PORT}/api`);
  });
}

start().catch(console.error);
