// API Response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Game types
export interface CreateGameRequest {
  difficulty: 'easy' | 'medium' | 'hard';
  theme?: string;
}

export interface GameImage {
  id: string;
  imageUrl: string;
  concept: string;
  isMemoryTarget: boolean;
}

export interface CreateGameResponse {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  theme?: string;
  memoryImages: GameImage[];
  allImages: GameImage[];
  displayDuration: number;
  startedAt: string;
}

export interface SubmitGameRequest {
  selectedImageIds: string[];
  timeSpent: number;
}

export interface SubmitGameResponse {
  id: string;
  score: number;
  completedAt: string;
  memoryImages: GameImage[];
  allImages: GameImage[];
}

export interface HealthCheckResponse {
  service: string;
  uptime: number;
  timestamp: string;
  geminiConnection: boolean;
}