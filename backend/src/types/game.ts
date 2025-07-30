export interface GameImage {
  id: string;
  concept: string;
  imageUrl: string;
  isMemoryTarget: boolean; // Images to be memorized
}

export interface GameSession {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  theme?: string;
  memoryImages: GameImage[]; // 10 images to memorize
  allImages: GameImage[]; // 15 images (10 memory + 5 distractors)
  displayDuration: number; // Duration to show memory images (in ms)
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  userId?: string; // For future user authentication
}

export interface CreateGameParams {
  difficulty: 'easy' | 'medium' | 'hard';
  theme?: string;
}

export interface SubmitGameParams {
  gameId: string;
  selectedImageIds: string[];
  timeSpent: number; // in milliseconds
}