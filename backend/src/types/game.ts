export interface GameImage {
  id: string;
  concept: string;
  imageUrl: string;
  isMemoryTarget: boolean; 
}

export interface GameSession {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  theme?: string;
  memoryImages: GameImage[]; 
  allImages: GameImage[]; 
  displayDuration: number; 
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  userId?: string; 
}

export interface CreateGameParams {
  difficulty: 'easy' | 'medium' | 'hard';
  theme?: string;
}

export interface SubmitGameParams {
  gameId: string;
  selectedImageIds: string[];
  timeSpent: number; 
}