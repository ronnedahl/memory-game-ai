import { v4 as uuidv4 } from 'uuid';
import { geminiService, Concept } from './geminiService';
import { logger } from '../utils/logger';
import { NotFoundError, ValidationError } from '../types/errors';
import { 
  GameSession, 
  GameImage, 
  CreateGameParams, 
  SubmitGameParams 
} from '../types/game';

class GameService {
  // In-memory storage for now (replace with database later)
  private games: Map<string, GameSession> = new Map();

  async createGame(params: CreateGameParams): Promise<GameSession> {
    const { difficulty, theme } = params;
    
    logger.info('Creating new memory game', { difficulty, theme });

    // Always 10 images to memorize + 5 distractors = 15 total
    const memoryImageCount = 10;
    const distractorCount = 5;
    
    // Generate concepts for memory images and distractors
    const allConcepts = await geminiService.generateConcepts({
      theme,
      difficulty,
      count: memoryImageCount + distractorCount
    });

    // Split concepts into memory and distractor sets
    const memoryConcepts = allConcepts.slice(0, memoryImageCount);
    const distractorConcepts = allConcepts.slice(memoryImageCount);

    // Create memory images (to be memorized)
    const memoryImages = await this.createGameImages(memoryConcepts, true);
    
    // Create distractor images
    const distractorImages = await this.createGameImages(distractorConcepts, false);

    // Combine and shuffle all images for the selection grid
    const allImages = [...memoryImages, ...distractorImages];
    this.shuffleArray(allImages);

    // Set display duration (10 seconds)
    const displayDuration = 10000; // 10 seconds in milliseconds

    // Create game session
    const gameSession: GameSession = {
      id: uuidv4(),
      difficulty,
      theme,
      memoryImages,
      allImages,
      displayDuration,
      startedAt: new Date()
    };

    // Store game session
    this.games.set(gameSession.id, gameSession);

    logger.info('Memory game created successfully', { 
      gameId: gameSession.id,
      memoryImageCount: memoryImages.length,
      totalImageCount: allImages.length
    });

    return gameSession;
  }

  async submitGame(params: SubmitGameParams): Promise<GameSession> {
    const { gameId, selectedImageIds, timeSpent } = params;

    const game = this.games.get(gameId);
    if (!game) {
      throw new NotFoundError('Game session not found');
    }

    if (game.completedAt) {
      throw new ValidationError('Game has already been completed');
    }

    // Get IDs of all memory images
    const memoryImageIds = game.memoryImages.map(img => img.id);

    // Calculate correct and incorrect selections
    const correctSelections = selectedImageIds.filter(id => 
      memoryImageIds.includes(id)
    );
    const incorrectSelections = selectedImageIds.filter(id => 
      !memoryImageIds.includes(id)
    );
    const missedImages = memoryImageIds.filter(id => 
      !selectedImageIds.includes(id)
    );

    // Calculate score
    const score = this.calculateScore({
      difficulty: game.difficulty,
      correctSelections: correctSelections.length,
      incorrectSelections: incorrectSelections.length,
      missedImages: missedImages.length,
      totalMemoryImages: memoryImageIds.length,
      timeSpent
    });

    // Update game session
    game.completedAt = new Date();
    game.score = score;

    logger.info('Memory game submitted', { 
      gameId, 
      score, 
      correctSelections: correctSelections.length,
      incorrectSelections: incorrectSelections.length,
      missedImages: missedImages.length
    });

    // Return game with required response structure
    return {
      ...game,
      memoryImages: game.memoryImages,
      allImages: game.allImages
    };
  }

  async getGame(gameId: string): Promise<GameSession> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new NotFoundError('Game session not found');
    }
    return game;
  }

  private async createGameImages(concepts: Concept[], isMemoryTarget: boolean): Promise<GameImage[]> {
    return concepts.map(concept => ({
      id: uuidv4(),
      concept: concept.text,
      imageUrl: this.generateImageUrl(concept.text),
      isMemoryTarget
    }));
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      const swapValue = array[j];
      if (temp !== undefined && swapValue !== undefined) {
        array[i] = swapValue;
        array[j] = temp;
      }
    }
  }

  private generateImageUrl(concept: string): string {
    // Using Picsum API with seed for consistent images
    const seed = encodeURIComponent(concept);
    const size = 400;
    return `https://picsum.photos/seed/${seed}/${size}/${size}`;
  }

  private calculateScore({
    difficulty,
    correctSelections,
    incorrectSelections,
    missedImages,
    totalMemoryImages,
    timeSpent
  }: {
    difficulty: string;
    correctSelections: number;
    incorrectSelections: number;
    missedImages: number;
    totalMemoryImages: number;
    timeSpent: number;
  }): number {
    // Base score per correctly selected image
    const baseScorePerImage = {
      easy: 10,
      medium: 15,
      hard: 20
    }[difficulty] || 10;

    // Calculate base score
    const baseScore = correctSelections * baseScorePerImage;

    // Accuracy bonus (percentage of correct selections)
    const accuracy = totalMemoryImages > 0 
      ? correctSelections / totalMemoryImages 
      : 0;
    const accuracyBonus = Math.floor(accuracy * 100);

    // Time bonus (max 50 points, decreases with time spent after viewing phase)
    // Subtract 10 seconds viewing time from total time
    const selectionTime = Math.max(0, timeSpent - 10000);
    const timeBonus = Math.max(0, 50 - Math.floor(selectionTime / 2000));

    // Penalties
    const incorrectPenalty = incorrectSelections * 5; // Penalty for selecting wrong images
    const missedPenalty = missedImages * 3; // Penalty for missing memory images

    // Calculate final score
    const finalScore = baseScore + accuracyBonus + timeBonus - incorrectPenalty - missedPenalty;

    return Math.max(0, finalScore);
  }

  // Cleanup old games (run periodically)
  cleanupOldGames(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [id, game] of this.games.entries()) {
      if (game.startedAt < oneHourAgo) {
        this.games.delete(id);
      }
    }

    logger.info('Cleaned up old games', { 
      remainingGames: this.games.size 
    });
  }
}

export const gameService = new GameService();