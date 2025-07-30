
import React from 'react';
import type { ImageItem } from '../types';

interface SelectionScreenProps {
  pool: ImageItem[];
  selection: Set<string>;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ pool, selection, onSelect, onConfirm }) => {
  return (
    <div className="w-full flex flex-col items-center fade-in">
      <div className="p-6 bg-slate-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-cyan-300">Select the matching image</h2>
        <p className="text-center text-slate-300 mb-6">Choose only one image that matches the concept</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {pool.map(image => {
            const isSelected = selection.has(image.id);
            return (
              <button
                key={image.id}
                onClick={() => onSelect(image.id)}
                className={`aspect-square bg-slate-700 rounded-lg overflow-hidden shadow-lg transition-all duration-200 outline-none transform hover:scale-105 ${isSelected ? 'ring-4 ring-cyan-400 scale-105' : 'ring-2 ring-transparent'}`}
              >
                <img
                  src={image.url}
                  alt={image.concept}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={onConfirm}
            disabled={selection.size === 0}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xl rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100"
          >
            Confirm Selection ({selection.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionScreen;
