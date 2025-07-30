import { Router } from 'express';
import { gameController } from '../controllers/gameController';
import { validate, createGameSchema, submitGameSchema } from '../middleware/validation';

const router = Router();

// Health check
router.get('/health', gameController.healthCheck);

// Game routes
router.post('/games', validate(createGameSchema), gameController.createGame);
router.get('/games/:gameId', gameController.getGame);
router.post('/games/:gameId/submit', validate(submitGameSchema), gameController.submitGame);

export default router;