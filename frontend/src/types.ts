
export enum GameState {
  START,
  LOADING,
  MEMORIZING,
  SELECTING,
  SCORE,
}

export interface ImageItem {
  id: string;
  url: string;
  concept: string;
}

export interface Score {
  correct: number;
  incorrect: number;
  missed: number;
  finalScore: number;
  correctAnswer?: {
    id: string;
    concept: string;
    imageUrl: string;
    isTarget: boolean;
  };
  images?: Array<{
    id: string;
    concept: string;
    imageUrl: string;
    isTarget: boolean;
  }>;
}
