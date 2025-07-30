
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, type ImageItem, type Score } from './types';
import { apiService } from './services/api';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import Loader from './components/Loader';
import MemorizeScreen from './components/MemorizeScreen';
import SelectionScreen from './components/SelectionScreen';
import ScoreScreen from './components/ScoreScreen';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [gameId, setGameId] = useState<string | null>(null);
  const [targetConcept, setTargetConcept] = useState<string>('');
  const [imagesToMemorize, setImagesToMemorize] = useState<ImageItem[]>([]);
  const [selectionPool, setSelectionPool] = useState<ImageItem[]>([]);
  const [userSelection, setUserSelection] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<Score | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [displayDuration, setDisplayDuration] = useState<number>(10000);
  const gameStartTime = useRef<number>(0);

  const handleStartGame = useCallback(async () => {
    setGameState(GameState.LOADING);
    setError(null);
    setUserSelection(new Set());
    try {
      const gameData = await apiService.createGame({ difficulty });
      
      // Convert memory images to ImageItems
      const memoryImages: ImageItem[] = gameData.memoryImages.map(img => ({
        id: img.id,
        concept: img.concept,
        url: img.imageUrl,
      }));

      // Convert all images for selection screen
      const allImages: ImageItem[] = gameData.allImages.map(img => ({
        id: img.id,
        concept: img.concept,
        url: img.imageUrl,
      }));

      setGameId(gameData.id);
      setTargetConcept('Remember these images!'); // Generic instruction for memory game
      setImagesToMemorize(memoryImages); // Set images to memorize
      setSelectionPool(allImages); // Use all images for selection
      setDisplayDuration(gameData.displayDuration);
      gameStartTime.current = Date.now();
      setGameState(GameState.MEMORIZING);
    } catch (err) {
      setError('Failed to start the game. Please check your connection and try again.');
      setGameState(GameState.START);
      console.error(err);
    }
  }, [difficulty]);
  
  const handleTimeUp = useCallback(() => {
    setGameState(GameState.SELECTING);
  }, []);

  const handleImageSelect = (imageId: string) => {
    setUserSelection(prevSelection => {
      const newSelection = new Set(prevSelection);
      if (newSelection.has(imageId)) {
        newSelection.delete(imageId);
      } else {
        newSelection.add(imageId);
      }
      return newSelection;
    });
  };
  
  const handleConfirmSelection = useCallback(async () => {
    if (!gameId) return;
    
    setGameState(GameState.LOADING);
    try {
      const timeSpent = Date.now() - gameStartTime.current;
      const selectedImageIds = Array.from(userSelection);
      
      const result = await apiService.submitGame(gameId, {
        selectedImageIds,
        timeSpent
      });
      
      // Calculate score based on memory game results
      const memoryImageIds = result.memoryImages.map(img => img.id);
      const correctSelections = selectedImageIds.filter(id => memoryImageIds.includes(id));
      const incorrectSelections = selectedImageIds.filter(id => !memoryImageIds.includes(id));
      const missedImages = memoryImageIds.filter(id => !selectedImageIds.includes(id));
      
      setScore({
        correct: correctSelections.length,
        incorrect: incorrectSelections.length,
        missed: missedImages.length,
        finalScore: result.score,
        correctAnswer: result.memoryImages[0], // Using first memory image as placeholder
        images: result.allImages
      });
      
      setGameState(GameState.SCORE);
    } catch (err) {
      setError('Failed to submit your selection. Please try again.');
      setGameState(GameState.SELECTING);
      console.error(err);
    }
  }, [userSelection, gameId]);

  const handlePlayAgain = () => {
    setGameState(GameState.START);
    setGameId(null);
    setImagesToMemorize([]);
    setSelectionPool([]);
    setUserSelection(new Set());
    setScore(null);
    setError(null);
    setTargetConcept('');
    setDisplayDuration(10000);
  };
  
  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen 
          onStart={handleStartGame} 
          error={error} 
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />;
      case GameState.LOADING:
        return <Loader text="Generating a new visual challenge..." />;
      case GameState.MEMORIZING:
        return <MemorizeScreen 
          targetConcept={targetConcept} 
          imagesToMemorize={imagesToMemorize}
          displayDuration={displayDuration}
          onTimeUp={handleTimeUp} 
        />;
      case GameState.SELECTING:
        return <SelectionScreen 
                    pool={selectionPool} 
                    selection={userSelection} 
                    onSelect={handleImageSelect}
                    onConfirm={handleConfirmSelection}
                />;
      case GameState.SCORE:
        return score ? <ScoreScreen 
                          score={score} 
                          onPlayAgain={handlePlayAgain}
                          targetConcept={targetConcept}
                          userSelection={userSelection}
                        /> : <Loader text="Calculating score..." />;
      default:
        return <StartScreen onStart={handleStartGame} error={error} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl flex-grow flex flex-col items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
}

