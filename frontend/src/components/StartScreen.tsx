
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  error: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, error, difficulty, onDifficultyChange }) => (
  <div className="text-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 fade-in max-w-2xl">
    <h2 className="text-3xl font-bold mb-4 text-cyan-300">Test Your Visual Memory</h2>
    <p className="text-lg text-slate-300 mb-2">
      Look for the image that matches the target concept.
    </p>
    <p className="text-lg text-slate-300 mb-4">
      You'll have time to memorize the concept, then select the matching image from the grid.
    </p>
    
    <div className="mb-6">
      <label className="text-slate-300 mb-2 block">Select Difficulty:</label>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onDifficultyChange('easy')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            difficulty === 'easy'
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Easy (4 images)
        </button>
        <button
          onClick={() => onDifficultyChange('medium')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            difficulty === 'medium'
              ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Medium (6 images)
        </button>
        <button
          onClick={() => onDifficultyChange('hard')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            difficulty === 'hard'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Hard (9 images)
        </button>
      </div>
    </div>
    {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Oops! </strong>
            <span className="block sm:inline">{error}</span>
        </div>
    )}
    <button
      onClick={onStart}
      className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xl rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
    >
      Start Challenge
    </button>
  </div>
);

export default StartScreen;
