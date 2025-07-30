
import React, { useState, useEffect } from 'react';
import { MEMORIZE_DURATION_SECONDS } from '../constants';

interface TimerProps {
  duration?: number; // duration in seconds
  onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration = MEMORIZE_DURATION_SECONDS, onComplete }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / (duration * 10)); // update every 100ms
      });
    }, 100);

    const timeout = setTimeout(onComplete, duration * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onComplete]);

  return (
    <div className="w-full bg-slate-700 rounded-full h-4 my-6 shadow-inner">
      <div
        className="bg-gradient-to-r from-sky-400 to-cyan-300 h-4 rounded-full transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Timer;
