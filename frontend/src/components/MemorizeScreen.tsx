
import React from 'react';
import Timer from './Timer';
import { ImageItem } from '../types';

interface MemorizeScreenProps {
  targetConcept: string;
  imagesToMemorize: ImageItem[];
  displayDuration: number;
  onTimeUp: () => void;
}

const MemorizeScreen: React.FC<MemorizeScreenProps> = ({ targetConcept, imagesToMemorize, displayDuration, onTimeUp }) => {
  return (
    <div className="w-full flex flex-col items-center fade-in">
      <div className="p-8 bg-slate-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 max-w-6xl">
        <h2 className="text-3xl font-bold mb-4 text-cyan-300 text-center">{targetConcept}</h2>
        <Timer duration={displayDuration / 1000} onComplete={onTimeUp} />
        
        <div className="mt-6 grid grid-cols-5 gap-4">
          {imagesToMemorize.map((image) => (
            <div
              key={image.id}
              className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-slate-900/50">
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        
        <p className="mt-6 text-slate-300 text-center">
          Memorize these images. You'll need to select them from a larger set!
        </p>
      </div>
    </div>
  );
};

export default MemorizeScreen;
