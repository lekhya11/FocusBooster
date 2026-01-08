
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';

interface TimerProps {
  durationMinutes: number;
  onComplete: (remainingSeconds: number, totalSeconds: number) => void;
  isCompleted?: boolean;
  timerApiRef?: React.RefObject<{ getTimeLeft: () => number }>;
}

const Timer: React.FC<TimerProps> = ({ durationMinutes, onComplete, isCompleted = false, timerApiRef }) => {
  const TOTAL_SECONDS = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const timerRef = useRef<number | null>(null);

  // Expose the current time to the parent component via the ref
  useImperativeHandle(timerApiRef, () => ({
    getTimeLeft: () => timeLeft
  }), [timeLeft]);

  useEffect(() => {
    // Resume timer from stored start time if available
    const startTimeStr = localStorage.getItem('focus_start_time');
    if (startTimeStr) {
      const startTime = parseInt(startTimeStr, 10);
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, TOTAL_SECONDS - elapsedSeconds);
      setTimeLeft(remaining);
    }

    // Only start the interval if the session isn't already marked as completed
    if (!isCompleted) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            onComplete(0, TOTAL_SECONDS);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [TOTAL_SECONDS, onComplete, isCompleted]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = timeLeft / TOTAL_SECONDS;
  const showFinished = isCompleted || timeLeft === 0;

  // Cinematic color mapping
  const activeGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";
  const finishedGradient = "linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)";

  return (
    <div className="flex flex-col items-center gap-10">
      <div className={`relative flex items-center justify-center ${!showFinished ? 'timer-pulse' : ''}`}>
        {/* Glow Layer */}
        <div 
          className="absolute w-[220px] h-[220px] rounded-full blur-[80px] transition-all duration-1000 opacity-40"
          style={{ background: showFinished ? '#10b981' : '#a855f7' }}
        />

        {/* 3D Liquid Morphing Blob Container */}
        <div className="blob-container">
          {/* Main morphing layer */}
          <div 
            className="blob" 
            style={{ 
              background: showFinished ? finishedGradient : activeGradient,
              opacity: 0.3 + (progress * 0.6) 
            }} 
          />
          {/* Secondary morphing layer for "iridescent" depth */}
          <div 
            className="blob blob-secondary" 
            style={{ 
              background: showFinished ? 'linear-gradient(45deg, #34d399, #6ee7b7)' : 'linear-gradient(-45deg, #3b82f6, #ec4899)',
              opacity: 0.2 + (progress * 0.4)
            }} 
          />
          
          {/* Glossy Overlay Highlight */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-[140px] h-[140px] rounded-full bg-gradient-to-br from-white/20 to-transparent blur-md opacity-40" />
          </div>

          {/* Icon indicator */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <span className={`text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-700 ${showFinished ? 'scale-125' : 'scale-100'}`}>
              {showFinished ? '✨' : '💠'}
            </span>
          </div>
        </div>
      </div>

      {/* Cinematic Time Display */}
      <div className="text-center fade-in-up">
        <div className="relative inline-block">
          <span className={`text-7xl font-bold tabular-nums tracking-[-0.05em] transition-all duration-1000 drop-shadow-2xl ${
            showFinished ? 'text-emerald-400' : 'text-white'
          }`}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className={`absolute inset-0 text-7xl font-bold tabular-nums tracking-[-0.05em] blur-xl opacity-40 select-none pointer-events-none transition-all duration-1000 ${
            showFinished ? 'text-emerald-500' : 'text-indigo-400'
          }`}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        
        <p className={`text-[11px] mt-4 tracking-[0.4em] font-black uppercase transition-all duration-1000 ${
          showFinished ? 'text-emerald-500/80 translate-y-0' : 'text-white/40'
        }`}>
          {showFinished ? 'Flow Completed' : 'Deep Work State'}
        </p>
      </div>
    </div>
  );
};

export default Timer;
