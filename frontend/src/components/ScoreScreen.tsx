
import React from 'react';
import type { Score } from '../types';

interface ScoreScreenProps {
  score: Score;
  onPlayAgain: () => void;
  targetConcept: string;
  userSelection: Set<string>;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ score, onPlayAgain, targetConcept, userSelection }) => {
  const correctAnswer = score.correctAnswer;
  const allImages = score.images || [];
  const wasCorrect = score.correct > 0;

  return (
    <div className="w-full max-w-4xl text-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 fade-in">
      <h2 className="text-3xl font-bold mb-2 text-cyan-300">Your Results</h2>
      <p className="text-6xl font-bold my-4 bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">{score.finalScore} <span className="text-3xl">points</span></p>
      
      <div className="grid grid-cols-3 gap-4 text-center my-8">
        <div className="bg-green-500/10 p-4 rounded-lg">
          <p className="text-4xl font-bold text-green-400">{score.correct}</p>
          <p className="text-slate-300">Correct</p>
        </div>
        <div className="bg-red-500/10 p-4 rounded-lg">
          <p className="text-4xl font-bold text-red-400">{score.incorrect}</p>
          <p className="text-slate-300">Wrong</p>
        </div>
        <div className="bg-yellow-500/10 p-4 rounded-lg">
          <p className="text-4xl font-bold text-yellow-400">{score.missed}</p>
          <p className="text-slate-300">Missed</p>
        </div>
      </div>

      {allImages.length > 0 && (
        <div className="text-center mt-8">
          <h3 className="text-xl font-bold mb-4 text-slate-200">All images:</h3>
          <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
            {allImages.map(img => (
              <div key={img.id} className="relative">
                <img 
                  src={img.imageUrl} 
                  alt="" 
                  className={`w-full h-24 rounded-md object-cover ${
                    img.isMemoryTarget && userSelection.has(img.id) ? 'border-4 border-green-500' : 
                    !img.isMemoryTarget && userSelection.has(img.id) ? 'border-4 border-red-500' : 
                    img.isMemoryTarget ? 'border-2 border-yellow-500' :
                    'border border-slate-600'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="mt-12 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xl rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
      >
        Play Again
      </button>
    </div>
  );
};

export default ScoreScreen;
