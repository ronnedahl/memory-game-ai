import { Router } from 'express';
import gameRoutes from './gameRoutes';

const router = Router();

// API routes
router.use('/api', gameRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Memory Game API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      createGame: 'POST /api/games',
      getGame: 'GET /api/games/:gameId',
      submitGame: 'POST /api/games/:gameId/submit'
    }
  });
});

export default router;