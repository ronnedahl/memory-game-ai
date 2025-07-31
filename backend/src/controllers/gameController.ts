import { Request, Response } from 'express';
import { gameService } from '../services/gameService';
import { geminiService } from '../services/geminiService';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const gameController = {
  createGame: asyncHandler(async (req: Request, res: Response) => {
    const { difficulty, theme } = req.body;
    
    logger.info('Creating game', { difficulty, theme });
    
    const game = await gameService.createGame({ difficulty, theme });
    
    const gameResponse = {
      id: game.id,
      difficulty: game.difficulty,
      theme: game.theme,
      memoryImages: game.memoryImages,
      allImages: game.allImages,
      displayDuration: game.displayDuration,
      startedAt: game.startedAt
    };
    
    res.status(201).json({
      status: 'success',
      data: gameResponse
    });
  }),

  getGame: asyncHandler(async (req: Request, res: Response) => {
    const { gameId } = req.params;

    if (!gameId) {
      res.status(400).json({ status: 'error', message: 'Game ID is required' });
    } else {
      const game = await gameService.getGame(gameId);

      const gameResponse = game.completedAt ? {
        ...game
      } : {
        id: game.id,
        difficulty: game.difficulty,
        theme: game.theme,
        startedAt: game.startedAt,
        displayDuration: game.displayDuration
      };
      
      res.json({
        status: 'success',
        data: gameResponse
      });
    }
  }),

  submitGame: asyncHandler(async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const { selectedImageIds, timeSpent } = req.body;
    
    if (!gameId) {
      res.status(400).json({ status: 'error', message: 'Game ID is required' });
    } else {
      logger.info('Submitting game', { gameId, selectedImageIds });
    
      const game = await gameService.submitGame({
        gameId,
        selectedImageIds,
        timeSpent
      });
      
      res.json({
        status: 'success',
        data: {
          id: game.id,
          score: game.score,
          completedAt: game.completedAt,
          memoryImages: game.memoryImages,
          allImages: game.allImages
        }
      });
    }
  }),

  healthCheck: asyncHandler(async (_req: Request, res: Response) => {
    const isGeminiConnected = await geminiService.testConnection();
    
    res.json({
      status: 'success',
      data: {
        service: 'memory-game-backend',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        geminiConnection: isGeminiConnected
      }
    });
  })
};